-- Week of 2026-10-15: the stored poem is Du Fu's 《登高》, but it was saved
-- under the wrong title (《天淨沙·秋思》 is Ma Zhiyuan's Yuan-dynasty song)
-- and is missing its opening couplet. This restores the title and prepends
-- the two missing lines everywhere the poem's lines appear.
-- Guarded on the 6-line state, so running it twice does nothing.

update poems set
  title_zh = '《登高》',
  title_en = 'Climbing the Heights',
  lines_zh = array['風急天高猿嘯哀，', '渚清沙白鳥飛迴。'] || lines_zh,
  lines_jyutping = array[
    'fung1 gap1 tin1 gou1 jyun4 siu3 oi1,',
    'zyu2 cing1 saa1 baak6 niu5 fei1 wui4.'
  ] || lines_jyutping,
  line_by_line = '[
    {"zh": "風急天高猿嘯哀，",
     "jyutping": "fung1 gap1 tin1 gou1 jyun4 siu3 oi1,",
     "en": "The wind is sharp, the sky is high, the gibbons cry their grief;",
     "words": [
       {"char": "風", "jyutping": "fung1", "meaning": "wind"},
       {"char": "急", "jyutping": "gap1", "meaning": "swift, fierce"},
       {"char": "天", "jyutping": "tin1", "meaning": "sky"},
       {"char": "高", "jyutping": "gou1", "meaning": "high"},
       {"char": "猿", "jyutping": "jyun4", "meaning": "gibbons"},
       {"char": "嘯", "jyutping": "siu3", "meaning": "howl"},
       {"char": "哀", "jyutping": "oi1", "meaning": "mournful"}
     ]},
    {"zh": "渚清沙白鳥飛迴。",
     "jyutping": "zyu2 cing1 saa1 baak6 niu5 fei1 wui4.",
     "en": "over the clear islet and white sand, birds wheel and circle back.",
     "words": [
       {"char": "渚", "jyutping": "zyu2", "meaning": "islet"},
       {"char": "清", "jyutping": "cing1", "meaning": "clear"},
       {"char": "沙", "jyutping": "saa1", "meaning": "sand"},
       {"char": "白", "jyutping": "baak6", "meaning": "white"},
       {"char": "鳥", "jyutping": "niu5", "meaning": "birds"},
       {"char": "飛", "jyutping": "fei1", "meaning": "fly"},
       {"char": "迴", "jyutping": "wui4", "meaning": "circle back"}
     ]}
  ]'::jsonb || line_by_line,
  translation_en = E'The wind is sharp, the sky is high, the gibbons cry their grief;\nover the clear islet and white sand, birds wheel and circle back.\n' || translation_en,
  poem_background = replace(replace(poem_background, '《天淨沙·秋思》', '《登高》'), '天淨沙·秋思', '登高'),
  literary_note   = replace(replace(literary_note,   '《天淨沙·秋思》', '《登高》'), '天淨沙·秋思', '登高'),
  author_bio      = replace(replace(author_bio,      '《天淨沙·秋思》', '《登高》'), '天淨沙·秋思', '登高')
where date = '2026-10-15'
  and array_length(lines_zh, 1) = 6;

-- Check the result: expect 8 / 8 / 8 and the new title.
select title_zh, title_en,
       array_length(lines_zh, 1)       as zh_lines,
       array_length(lines_jyutping, 1) as jp_lines,
       jsonb_array_length(line_by_line) as lbl_lines,
       translation_en, poem_background
from poems where date = '2026-10-15';
