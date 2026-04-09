import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DAY_KEYS = ["thu", "fri", "sat", "sun", "mon", "tue", "wed"];

const SYSTEM_PROMPT = `You are the engine behind a weekly poetry app for a Cantonese reader at an intermediate level with Traditional Chinese characters. Each Thursday you serve one classic Tang Dynasty (唐朝) poem that she lives with for the whole week.

Your audience is a single person — speak to her warmly, like a friend leaving a small gift on her desk each Thursday morning.

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
- For each line in line_by_line, include a "words" array that breaks the line into individual characters or natural compounds, each with its literal meaning. This helps the reader see how Classical Chinese constructs meaning — e.g. 春眠不覺曉 → spring / sleep / not / perceive / dawn. Keep meanings terse (1-3 words each).
- Keep the tone across all text warm, concise, and a little intimate — like a handwritten note
- If you are uncertain about Jyutping for a specific character, flag it with (?) rather than guessing
- author_bio: 2-3 sentences — who they were, what they were known for. Human and warm, not encyclopedic.
- poem_background: 1-2 sentences on when/why this poem was written. If uncertain, say so honestly.
- literary_note: One small observation about the craft — a wordplay, a structural choice, an image worth lingering on. Like a friend pointing something out over tea.
- sources: 1-3 scholarly or reliable sources (e.g. "全唐詩, Vol. 5", "唐詩三百首", a well-known translation anthology)
- season_hint: If the poem clearly evokes a season, include "spring", "summer", "autumn", or "winter". Otherwise null.
- image_prompts: An array of exactly 7 prompts for traditional Chinese ink wash paintings (水墨畫) that EVOLVE across the week (Thursday through Wednesday). Each prompt describes the SAME scene from the poem but with subtle changes that suggest the passage of time. For example:
  - A plum blossom branch: Day 1 has tight buds → Day 3 one flower opens → Day 5 petals begin to fall → Day 7 bare branch with petals scattered below
  - A mountain river scene: Day 1 still morning water → Day 3 light rain begins → Day 5 mist rises → Day 7 clearing sky reflected in water
  - A moonlit scene: Day 1 crescent moon → Day 3 half moon → Day 5 nearly full → Day 7 full moon
  The evolution should feel natural and poetic, not dramatic. Style: traditional Chinese brush painting on rice paper, monochrome ink wash, minimal, lots of empty space, contemplative, Song/Tang dynasty aesthetic. No text or characters in the images.

Respond ONLY with a JSON object matching this exact shape:
{
  "title_zh": "string (e.g. 《靜夜思》)",
  "title_en": "string",
  "author_zh": "string",
  "author_en": "string",
  "lines_zh": ["string array of lines in Traditional Chinese"],
  "lines_jyutping": ["string array, parallel Jyutping romanization"],
  "translation_en": "string — fluid poetic English translation",
  "line_by_line": [{"zh": "string", "jyutping": "string", "en": "string (poetic translation)", "words": [{"char": "string (one character or compound)", "jyutping": "string", "meaning": "string (literal English)"}]}],
  "vocabulary": [{"character": "string", "jyutping": "string", "meaning": "string", "note": "optional string"}],
  "author_bio": "string",
  "poem_background": "string",
  "literary_note": "string",
  "sources": ["string array"],
  "season_hint": "spring | summer | autumn | winter | null",
  "image_prompts": ["7 strings — evolving ink wash painting prompts, Thursday through Wednesday"]
}

No markdown fences, no preamble. Just the JSON object.`;

function getSeason(dateStr: string): string {
  const month = new Date(dateStr + "T00:00:00").getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getThursday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const offset = (day - 4 + 7) % 7;
  d.setDate(d.getDate() - offset);
  return d.toISOString().split("T")[0];
}

function getDayIndex(dateStr: string, thursdayStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const t = new Date(thursdayStr + "T00:00:00");
  return Math.round((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

async function generateImage(prompt: string, runwayKey: string): Promise<string | null> {
  try {
    const createRes = await fetch("https://api.dev.runwayml.com/v1/text_to_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${runwayKey}`,
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        promptText: prompt,
        model: "gen4_image",
        ratio: "1080:1920",
      }),
    });

    if (!createRes.ok) {
      console.error("Runway create error:", await createRes.text());
      return null;
    }

    const task = await createRes.json();
    const taskId = task.id;

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const pollRes = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
        headers: {
          "Authorization": `Bearer ${runwayKey}`,
          "X-Runway-Version": "2024-11-06",
        },
      });

      if (!pollRes.ok) continue;

      const status = await pollRes.json();

      if (status.status === "SUCCEEDED" && status.output?.length > 0) {
        return status.output[0];
      }

      if (status.status === "FAILED") {
        console.error("Runway generation failed:", status);
        return null;
      }
    }

    console.error("Runway generation timed out");
    return null;
  } catch (err) {
    console.error("Runway error:", err);
    return null;
  }
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
    const thursday = getThursday(targetDate);
    const dayIndex = getDayIndex(targetDate, thursday);
    const dayKey = DAY_KEYS[dayIndex] || "thu";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const runwayKey = Deno.env.get("RUNWAYML_API_SECRET")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if poem already exists for this week's Thursday
    const { data: existing } = await supabase
      .from("poems")
      .select("*")
      .eq("date", thursday)
      .single();

    if (existing) {
      // Poem exists — check if today's image variant exists
      const dailyImages = existing.daily_images || {};

      if (!dailyImages[dayKey] && existing.image_prompts?.[dayIndex]) {
        // Generate today's image variant
        const imageUrl = await generateImage(existing.image_prompts[dayIndex], runwayKey);
        if (imageUrl) {
          dailyImages[dayKey] = imageUrl;
          await supabase
            .from("poems")
            .update({ daily_images: dailyImages })
            .eq("id", existing.id);
          existing.daily_images = dailyImages;
        }
      }

      return new Response(JSON.stringify({ ...existing, _today_day_key: dayKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No poem for this week — generate one
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

    const userMessage = `Today is ${targetDate} (Thursday). Serve this week's poem.

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
        max_tokens: 4096,
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

    let poemData;
    try {
      poemData = JSON.parse(content);
    } catch {
      throw new Error("Failed to parse poem JSON from Claude response");
    }

    const validSeasons = ["spring", "summer", "autumn", "winter"];
    const seasonHint = validSeasons.includes(poemData.season_hint)
      ? poemData.season_hint
      : null;

    // Generate Thursday's image (day 0)
    const imagePrompts = Array.isArray(poemData.image_prompts) ? poemData.image_prompts : [];
    const thursdayImage = imagePrompts[0]
      ? await generateImage(imagePrompts[0], runwayKey)
      : null;

    const dailyImages: Record<string, string> = {};
    if (thursdayImage) {
      dailyImages.thu = thursdayImage;
    }

    // Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from("poems")
      .insert({
        date: thursday,
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
        image_prompts: imagePrompts,
        daily_images: dailyImages,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    return new Response(JSON.stringify({ ...inserted, _today_day_key: dayKey }), {
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
