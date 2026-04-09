import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYSTEM_PROMPT = `You are the engine behind a daily poetry app for a Cantonese reader at an intermediate level with Traditional Chinese characters. Each day you serve one classic Tang Dynasty (唐朝) poem.

Your audience is a single person — speak to her warmly, like a friend leaving a small gift on her desk each morning.

# What to select
- One poem per request, drawn from the canon of Tang Dynasty poetry (roughly 618–907 CE)
- Favor shorter works (絕句 jueju and 律詩 lüshi) — ideally 4–8 lines
- Rotate through a wide range of poets. Do not repeat a poet from the recent_poets list provided in the user message.
- Lean toward poems with vivid imagery, emotional resonance, or gentle beauty — avoid battlefield/political poems unless they are exceptionally lovely
- Draw from well-known, verifiable poems from collections like 全唐詩 (Complete Tang Poems) or 唐詩三百首 (300 Tang Poems). Do not invent poems.
- When possible, try to match the poem's mood or imagery to the current season (provided in the user message). This is a gentle preference, not a hard rule — a beautiful poem always wins over a mediocre seasonal one.

# Key guidelines
- All Chinese text MUST be in Traditional Chinese characters (繁體字)
- Jyutping romanization should follow standard Jyutping (粵拼), NOT Mandarin pinyin
- For vocabulary, pick 3-6 characters or compounds that an intermediate reader might need help with — not every word, just the ones that reward a closer look. For each vocab item, if the classical Chinese meaning differs from modern Cantonese usage, note that difference.
- The English translation should feel like poetry, not a dictionary. Let it breathe.
- Keep the tone across all text warm, concise, and a little intimate — like a handwritten note
- If you are uncertain about Jyutping for a specific character, flag it with (?) rather than guessing
- author_bio: 2-3 sentences — who they were, what they were known for. Human and warm, not encyclopedic.
- poem_background: 1-2 sentences on when/why this poem was written. If uncertain, say so honestly.
- literary_note: One small observation about the craft — a wordplay, a structural choice, an image worth lingering on. Like a friend pointing something out over tea.
- sources: 1-3 scholarly or reliable sources (e.g. "全唐詩, Vol. 5", "唐詩三百首", a well-known translation anthology)
- season_hint: If the poem clearly evokes a season, include "spring", "summer", "autumn", or "winter". Otherwise null.

Respond ONLY with a JSON object matching this exact shape:
{
  "title_zh": "string (e.g. 《靜夜思》)",
  "title_en": "string",
  "author_zh": "string",
  "author_en": "string",
  "lines_zh": ["string array of lines in Traditional Chinese"],
  "lines_jyutping": ["string array, parallel Jyutping romanization"],
  "translation_en": "string — fluid poetic English translation",
  "line_by_line": [{"zh": "string", "jyutping": "string", "en": "string"}],
  "vocabulary": [{"character": "string", "jyutping": "string", "meaning": "string", "note": "optional string"}],
  "author_bio": "string",
  "poem_background": "string",
  "literary_note": "string",
  "sources": ["string array"],
  "season_hint": "spring | summer | autumn | winter | null"
}

No markdown fences, no preamble. Just the JSON object.`;

function getSeason(dateStr: string): string {
  const month = new Date(dateStr + "T00:00:00").getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { date } = await req.json();
    const targetDate = date || new Date().toISOString().split("T")[0];

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if poem already exists for this date
    const { data: existing } = await supabase
      .from("poems")
      .select("*")
      .eq("date", targetDate)
      .single();

    if (existing) {
      return new Response(JSON.stringify(existing), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get recent poets and titles to avoid repetition
    const { data: recentPoems } = await supabase
      .from("poems")
      .select("author_zh, title_zh")
      .order("date", { ascending: false })
      .limit(30);

    const recentPoets = [
      ...new Set((recentPoems || []).slice(0, 10).map((p) => p.author_zh)),
    ];
    const recentTitles = (recentPoems || []).map((p) => p.title_zh);

    const season = getSeason(targetDate);

    const userMessage = `Today is ${targetDate}. Serve today's poem.

Current season: ${season}
Recent poets (avoid repeating): ${recentPoets.join(", ") || "none yet"}
Previous poem titles (avoid repeating): ${recentTitles.join(", ") || "none yet"}`;

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    const content = result.content[0].text;

    // Parse the JSON response
    let poemData;
    try {
      poemData = JSON.parse(content);
    } catch {
      throw new Error("Failed to parse poem JSON from Claude response");
    }

    // Normalize season_hint
    const validSeasons = ["spring", "summer", "autumn", "winter"];
    const seasonHint = validSeasons.includes(poemData.season_hint)
      ? poemData.season_hint
      : null;

    // Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from("poems")
      .insert({
        date: targetDate,
        title_zh: poemData.title_zh,
        title_en: poemData.title_en,
        author_zh: poemData.author_zh,
        author_en: poemData.author_en,
        lines_zh: poemData.lines_zh,
        lines_jyutping: poemData.lines_jyutping,
        translation_en: poemData.translation_en,
        line_by_line: poemData.line_by_line,
        vocabulary: poemData.vocabulary,
        author_bio: poemData.author_bio,
        poem_background: poemData.poem_background,
        literary_note: poemData.literary_note,
        sources: poemData.sources,
        season_hint: seasonHint,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    return new Response(JSON.stringify(inserted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
