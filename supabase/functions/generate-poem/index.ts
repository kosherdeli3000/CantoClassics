import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Converter } from "https://esm.sh/opencc-js@1.3.1";
import { getJyutpingCandidates } from "https://esm.sh/to-jyutping@3.1.1";

const DAY_KEYS = ["thu", "fri", "sat", "sun", "mon", "tue", "wed"];

const SYSTEM_PROMPT = `You are the engine behind a weekly poetry app for a Cantonese reader at an intermediate level with Traditional Chinese characters. Each Thursday you serve one classic Tang Dynasty (唐朝) poem that she lives with for the whole week.

Your audience is a single person — speak to her warmly, like a friend leaving a small gift on her desk each Thursday morning.

# What to select
- One poem per request, drawn from the canon of Tang Dynasty poetry (roughly 618–907 CE)
- Favor shorter works (絕句 jueju and 律詩 lüshi) — ideally 4–8 lines
- Rotate through a wide range of poets. Do not repeat a poet from the recent_poets list provided in the user message.
- Lean toward poems with vivid imagery, emotional resonance, or gentle beauty — avoid battlefield/political poems unless they are exceptionally lovely
- Draw from well-known, verifiable poems from collections like 全唐詩 (Complete Tang Poems) or 唐詩三百首 (300 Tang Poems). Do not invent poems.
- ALWAYS include the COMPLETE poem. If the canonical version is 8 lines (律詩), include all 8 lines. If 4 lines (絕句), include all 4. Never abridge, summarize, or omit lines from the original. The full poem must appear in lines_zh, lines_jyutping, and line_by_line.
- When possible, try to match the poem's mood or imagery to the current season (provided in the user message). This is a gentle preference, not a hard rule — a beautiful poem always wins over a mediocre seasonal one.

# Key guidelines
- All Chinese text MUST be in Traditional Chinese characters (繁體字)
- Jyutping romanization should follow standard Jyutping (粵拼), NOT Mandarin pinyin
- EVERY Jyutping syllable MUST end with a tone number (1-6) — e.g. "ceon1 min4 bat1 gok3 hiu2", never bare "ceon min bat gok hiu". This applies everywhere Jyutping appears: lines_jyutping, line_by_line.jyutping, every word's jyutping, and vocabulary. A syllable without a tone number is an error.
- Use the standard Cantonese reading, not lazy-initial colloquialisms (e.g. 濃 is "nung4" not "lung4", 你 is "nei5" not "lei5")
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

// ── Post-generation normalization ──────────────────────────────────────────
// The model occasionally slips a Simplified glyph past the "Traditional only"
// instruction (e.g. 樓台 instead of 樓臺) or a non-standard Jyutping reading
// (e.g. the n→l lazy-initial merger 濃 "lung4" instead of "nung4"). This pass
// deterministically repairs both classes before the poem is stored.

// Simplified → Traditional. OpenCC assumes its input is Simplified, so feeding
// it already-Traditional text mangles characters valid in BOTH scripts
// (里→裏, 后→後, 台→臺, 岳→嶽…). We convert character-by-character and SKIP any
// character in this shared/ambiguous set, so only confident Simplified-only
// glyphs are rewritten and genuine Traditional text is left untouched.
const s2tRaw = Converter({ from: "cn", to: "t" });

const SHARED_HAN = new Set([
  "里", "台", "后", "岳", "晒", "松", "谷", "丑", "面", "几", "云", "余",
  "系", "表", "范", "折", "制", "致", "沖", "卜", "仆", "借", "干", "卷",
  "征", "别", "占", "划", "准", "雇", "朱", "涂", "蒙", "升", "周", "姜",
  "漓", "著", "着", "才", "丰", "夸", "舍", "曲", "尽", "向", "咸", "胡",
]);

function s2t(str: string): string {
  if (typeof str !== "string") return str;
  let out = "";
  for (const c of str) {
    const t = s2tRaw(c);
    out += (t !== c && !SHARED_HAN.has(c)) ? t : c;
  }
  return out;
}

const HAN = /\p{Script=Han}/u;

// Lazy-initial romanization slips: the rime is identical and only the initial
// differs by a known merger pair. These are sloppiness, not real polyphones.
const MERGER_PAIRS = [["l", "n"], ["", "ng"]];

function splitInitial(syl: string): { initial: string; rest: string } {
  const m = syl.match(/^(ng|gw|kw|[bpmfdtnlgkhzcsjw])?(.*)$/);
  return { initial: (m && m[1]) || "", rest: (m && m[2]) || syl };
}

function isLazyMerger(a: string, b: string): boolean {
  const A = splitInitial(a);
  const B = splitInitial(b);
  if (A.rest !== B.rest) return false;
  const pair = [A.initial, B.initial].sort();
  return MERGER_PAIRS.some((p) => p[0] === pair[0] && p[1] === pair[1]);
}

type JpChange = { ch: string; from: string; to: string; kind: string };

// Correct a single character's Jyutping against the standard reading.
// Returns the corrected syllable, or null to keep the model's choice.
function correctSyllable(ch: string, jp: string, log: JpChange[]): string | null {
  const cands = getJyutpingCandidates(ch);
  if (!cands.length || !cands[0][1] || !cands[0][1].length) return null; // unknown char
  const readings: string[] = cands[0][1];
  const primary = readings[0];
  if (jp === primary) return null;
  if (readings.includes(jp)) {
    // Valid alternate reading — only normalize a lazy-initial slip of the primary;
    // otherwise it's a genuine contextual polyphone, so keep the model's choice.
    if (isLazyMerger(jp, primary)) {
      log.push({ ch, from: jp, to: primary, kind: "merger" });
      return primary;
    }
    return null;
  }
  // Not a valid reading at all → clear error, snap to the standard reading.
  log.push({ ch, from: jp, to: primary, kind: "invalid" });
  return primary;
}

// Correct the Jyutping of a "word" (single char or compound). Only touches the
// clean case where every element is Han and the syllable count lines up.
function correctWordJp(charStr: string, jpStr: string, log: JpChange[]): string {
  const chars = [...charStr];
  if (!chars.every((c) => HAN.test(c))) return jpStr;
  const toks = jpStr.trim().split(/\s+/);
  if (toks.length !== chars.length) return jpStr;
  return toks.map((t, i) => correctSyllable(chars[i], t, log) ?? t).join(" ");
}

function trailingPunct(zhLine: string): string {
  const last = (zhLine || "").trim().slice(-1);
  if (last === "，" || last === ",") return ",";
  if (last === "。" || last === ".") return ".";
  return "";
}

// deno-lint-ignore no-explicit-any
function normalizePoem(input: any): { poem: any; changes: JpChange[] } {
  const log: JpChange[] = [];
  const p = { ...input };

  // 1) Simplified → Traditional on Chinese-bearing fields.
  for (const f of ["title_zh", "author_zh", "author_bio", "poem_background", "literary_note"]) {
    if (typeof p[f] === "string") p[f] = s2t(p[f]);
  }
  if (Array.isArray(p.lines_zh)) p.lines_zh = p.lines_zh.map((s: string) => s2t(s));
  if (Array.isArray(p.sources)) p.sources = p.sources.map((s: string) => s2t(s));
  if (Array.isArray(p.line_by_line)) {
    // deno-lint-ignore no-explicit-any
    p.line_by_line = p.line_by_line.map((lb: any) => ({
      ...lb,
      zh: typeof lb.zh === "string" ? s2t(lb.zh) : lb.zh,
      words: Array.isArray(lb.words)
        // deno-lint-ignore no-explicit-any
        ? lb.words.map((w: any) => ({ ...w, char: typeof w.char === "string" ? s2t(w.char) : w.char }))
        : lb.words,
    }));
  }
  if (Array.isArray(p.vocabulary)) {
    // deno-lint-ignore no-explicit-any
    p.vocabulary = p.vocabulary.map((v: any) => ({
      ...v,
      character: typeof v.character === "string" ? s2t(v.character) : v.character,
      note: typeof v.note === "string" ? s2t(v.note) : v.note,
    }));
  }

  // 2) Jyutping correction, driven by the per-word readings in line_by_line.
  if (Array.isArray(p.line_by_line)) {
    // deno-lint-ignore no-explicit-any
    p.line_by_line = p.line_by_line.map((lb: any, i: number) => {
      const before = log.length;
      let words = lb.words;
      if (Array.isArray(words)) {
        // deno-lint-ignore no-explicit-any
        words = words.map((w: any) => {
          if (typeof w.char !== "string" || typeof w.jyutping !== "string") return w;
          const fixed = correctWordJp(w.char, w.jyutping, log);
          return fixed === w.jyutping ? w : { ...w, jyutping: fixed };
        });
      }
      let lineJp = lb.jyutping;
      // Regenerate the line-level string only when something on this line changed.
      if (log.length !== before && Array.isArray(words)) {
        // deno-lint-ignore no-explicit-any
        lineJp = words.map((w: any) => w.jyutping).join(" ") +
          trailingPunct(lb.zh || (p.lines_zh || [])[i] || "");
        if (Array.isArray(p.lines_jyutping)) p.lines_jyutping[i] = lineJp;
      }
      return { ...lb, words, jyutping: lineJp };
    });
  }

  // 3) Vocabulary Jyutping (compounds split on spaces).
  if (Array.isArray(p.vocabulary)) {
    // deno-lint-ignore no-explicit-any
    p.vocabulary = p.vocabulary.map((v: any) => {
      if (typeof v.character !== "string" || typeof v.jyutping !== "string") return v;
      const fixed = correctWordJp(v.character, v.jyutping, log);
      return fixed === v.jyutping ? v : { ...v, jyutping: fixed };
    });
  }

  return { poem: p, changes: log };
}

const MAX_ATTEMPTS = 3;

// Compare titles without the 《》 brackets, punctuation, or spacing the model
// sometimes varies between runs.
function normalizeTitle(title: unknown): string {
  if (typeof title !== "string") return "";
  return s2t(title).replace(/[《》〈〉「」\s·・]/g, "");
}

async function callClaude(
  messages: { role: string; content: string }[],
  anthropicKey: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} — ${errorText}`);
  }

  const result = await response.json();
  return result.content[0].text;
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
      .order("date", { ascending: false });

    const recentPoets = [
      ...new Set((recentPoems || []).slice(0, 10).map((p) => p.author_zh)),
    ];
    const allTitles = (recentPoems || []).map((p) => p.title_zh);
    const recentTitles = allTitles.slice(0, 30);

    const season = getSeason(targetDate);

    const userMessage = `Today is ${targetDate} (Thursday). Serve this week's poem.

Current season: ${season}
Recent poets (avoid repeating): ${recentPoets.join(", ") || "none yet"}
Previous poem titles (avoid repeating): ${recentTitles.join(", ") || "none yet"}`;

    // The recent-titles list above is only a hint; the model can (and does)
    // pick the same famous poem again. Check the result against what's
    // already stored and ask again, naming the repeat, if it matches.
    const seenTitles = new Set(allTitles.map(normalizeTitle));
    const messages: { role: string; content: string }[] = [
      { role: "user", content: userMessage },
    ];

    let poemData;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const content = await callClaude(messages, anthropicKey);
      try {
        poemData = JSON.parse(content);
      } catch {
        throw new Error("Failed to parse poem JSON from Claude response");
      }

      if (!seenTitles.has(normalizeTitle(poemData.title_zh))) break;

      console.warn(`Attempt ${attempt + 1}: repeated poem ${poemData.title_zh}`);
      if (attempt === MAX_ATTEMPTS - 1) {
        throw new Error(`Model kept repeating a previous poem (${poemData.title_zh})`);
      }
      messages.push(
        { role: "assistant", content },
        {
          role: "user",
          content: `${poemData.title_zh} has already been served. Choose a different poem that is not in the previous titles list, and respond with the full JSON object again.`,
        },
      );
    }

    // Repair stray Simplified glyphs and non-standard Jyutping before storing.
    const { poem: normalizedPoem, changes } = normalizePoem(poemData);
    poemData = normalizedPoem;
    if (changes.length > 0) {
      console.log(
        `Normalized ${changes.length} issue(s) in "${poemData.title_zh}":`,
        JSON.stringify(changes),
      );
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
