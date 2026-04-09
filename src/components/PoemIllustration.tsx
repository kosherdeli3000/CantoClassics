const ILLUSTRATIONS: Record<string, string> = {
  plum_blossom: `
    <circle cx="70" cy="80" r="8" fill="none" stroke-width="0.8"/>
    <circle cx="66" cy="76" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="74" cy="76" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="70" cy="72" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="67" cy="82" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="73" cy="82" r="2" fill="currentColor" opacity="0.3"/>
    <circle cx="30" cy="50" r="6" fill="none" stroke-width="0.7"/>
    <circle cx="27" cy="47" r="1.5" fill="currentColor" opacity="0.3"/>
    <circle cx="33" cy="47" r="1.5" fill="currentColor" opacity="0.3"/>
    <circle cx="30" cy="44" r="1.5" fill="currentColor" opacity="0.3"/>
    <circle cx="85" cy="35" r="5" fill="none" stroke-width="0.6"/>
    <path d="M20 95 Q45 70 70 80 Q80 60 95 45" fill="none" stroke-width="0.6"/>
    <path d="M30 50 Q40 55 70 80" fill="none" stroke-width="0.5"/>
  `,
  rain: `
    <line x1="15" y1="10" x2="12" y2="35" stroke-width="0.5"/>
    <line x1="30" y1="5" x2="27" y2="40" stroke-width="0.5"/>
    <line x1="50" y1="8" x2="47" y2="50" stroke-width="0.5"/>
    <line x1="70" y1="3" x2="67" y2="38" stroke-width="0.5"/>
    <line x1="85" y1="12" x2="82" y2="55" stroke-width="0.5"/>
    <line x1="40" y1="30" x2="37" y2="65" stroke-width="0.4"/>
    <line x1="60" y1="25" x2="57" y2="70" stroke-width="0.4"/>
    <line x1="20" y1="50" x2="17" y2="80" stroke-width="0.4"/>
    <line x1="75" y1="45" x2="72" y2="85" stroke-width="0.4"/>
    <line x1="45" y1="60" x2="42" y2="95" stroke-width="0.3"/>
    <line x1="90" y1="55" x2="87" y2="90" stroke-width="0.3"/>
  `,
  moon: `
    <circle cx="75" cy="25" r="18" fill="none" stroke-width="0.8"/>
    <circle cx="82" cy="20" r="15" fill="var(--color-parchment, #FAF6F0)" stroke="none"/>
    <circle cx="30" cy="70" r="1" fill="currentColor" opacity="0.3"/>
    <circle cx="55" cy="45" r="0.8" fill="currentColor" opacity="0.25"/>
    <circle cx="15" cy="30" r="0.8" fill="currentColor" opacity="0.2"/>
    <circle cx="45" cy="15" r="0.6" fill="currentColor" opacity="0.2"/>
    <circle cx="90" cy="65" r="0.7" fill="currentColor" opacity="0.2"/>
    <circle cx="20" cy="85" r="0.6" fill="currentColor" opacity="0.15"/>
  `,
  mountains: `
    <path d="M0 90 L25 45 L40 65 L60 30 L80 60 L100 40 L100 90 Z" fill="none" stroke-width="0.7"/>
    <path d="M0 95 L20 70 L35 80 L55 55 L75 75 L100 60 L100 95 Z" fill="none" stroke-width="0.5"/>
    <path d="M60 30 L58 28 M60 30 L62 28" stroke-width="0.4"/>
  `,
  willow: `
    <path d="M20 5 Q18 30 15 60 Q12 75 10 95" fill="none" stroke-width="0.6"/>
    <path d="M20 5 Q25 35 22 55 Q20 70 18 90" fill="none" stroke-width="0.5"/>
    <path d="M20 20 Q10 40 5 55" fill="none" stroke-width="0.4"/>
    <path d="M20 25 Q30 45 28 60" fill="none" stroke-width="0.4"/>
    <path d="M19 35 Q8 55 3 70" fill="none" stroke-width="0.3"/>
    <path d="M21 40 Q32 60 30 80" fill="none" stroke-width="0.3"/>
    <path d="M18 50 Q12 65 8 85" fill="none" stroke-width="0.3"/>
  `,
  river: `
    <path d="M0 60 Q25 55 50 58 Q75 61 100 55" fill="none" stroke-width="0.6"/>
    <path d="M0 68 Q30 63 55 66 Q80 69 100 64" fill="none" stroke-width="0.5"/>
    <path d="M0 76 Q20 72 45 74 Q70 76 100 72" fill="none" stroke-width="0.4"/>
    <path d="M10 64 Q12 63 14 64" fill="none" stroke-width="0.3"/>
    <path d="M40 62 Q42 61 44 62" fill="none" stroke-width="0.3"/>
    <path d="M70 66 Q72 65 74 66" fill="none" stroke-width="0.3"/>
  `,
  snow: `
    <circle cx="20" cy="15" r="1.2" fill="currentColor" opacity="0.15"/>
    <circle cx="45" cy="25" r="1" fill="currentColor" opacity="0.12"/>
    <circle cx="75" cy="10" r="1.3" fill="currentColor" opacity="0.15"/>
    <circle cx="10" cy="45" r="0.8" fill="currentColor" opacity="0.1"/>
    <circle cx="55" cy="50" r="1.1" fill="currentColor" opacity="0.12"/>
    <circle cx="85" cy="40" r="0.9" fill="currentColor" opacity="0.1"/>
    <circle cx="30" cy="70" r="1" fill="currentColor" opacity="0.1"/>
    <circle cx="65" cy="75" r="1.2" fill="currentColor" opacity="0.12"/>
    <circle cx="90" cy="70" r="0.8" fill="currentColor" opacity="0.08"/>
    <circle cx="15" cy="90" r="0.9" fill="currentColor" opacity="0.08"/>
    <circle cx="50" cy="88" r="1.1" fill="currentColor" opacity="0.1"/>
    <circle cx="80" cy="92" r="0.7" fill="currentColor" opacity="0.08"/>
  `,
  clouds: `
    <path d="M15 30 Q20 22 30 25 Q35 18 45 22 Q52 17 58 24 Q65 22 68 30 Q60 32 50 30 Q40 33 30 31 Z" fill="none" stroke-width="0.6"/>
    <path d="M55 60 Q60 53 68 56 Q73 50 80 53 Q86 49 90 55 Q85 58 78 56 Q70 59 62 57 Z" fill="none" stroke-width="0.5"/>
    <path d="M5 70 Q10 64 18 66 Q22 60 30 63 Q25 68 18 67 Z" fill="none" stroke-width="0.4"/>
  `,
  chrysanthemum: `
    <circle cx="70" cy="65" r="4" fill="none" stroke-width="0.6"/>
    <ellipse cx="70" cy="55" rx="2" ry="6" fill="none" stroke-width="0.5"/>
    <ellipse cx="70" cy="75" rx="2" ry="6" fill="none" stroke-width="0.5"/>
    <ellipse cx="60" cy="65" rx="6" ry="2" fill="none" stroke-width="0.5"/>
    <ellipse cx="80" cy="65" rx="6" ry="2" fill="none" stroke-width="0.5"/>
    <ellipse cx="63" cy="58" rx="2" ry="5" fill="none" stroke-width="0.4" transform="rotate(45 63 58)"/>
    <ellipse cx="77" cy="58" rx="2" ry="5" fill="none" stroke-width="0.4" transform="rotate(-45 77 58)"/>
    <ellipse cx="63" cy="72" rx="2" ry="5" fill="none" stroke-width="0.4" transform="rotate(-45 63 72)"/>
    <ellipse cx="77" cy="72" rx="2" ry="5" fill="none" stroke-width="0.4" transform="rotate(45 77 72)"/>
    <path d="M70 78 Q68 90 65 98" fill="none" stroke-width="0.5"/>
    <path d="M66 85 Q60 88 55 87" fill="none" stroke-width="0.4"/>
  `,
  bamboo: `
    <line x1="80" y1="5" x2="80" y2="95" stroke-width="0.8"/>
    <line x1="80" y1="25" x2="80" y2="25.5" stroke-width="1.5"/>
    <line x1="80" y1="55" x2="80" y2="55.5" stroke-width="1.5"/>
    <line x1="80" y1="80" x2="80" y2="80.5" stroke-width="1.5"/>
    <path d="M80 25 Q90 18 95 10" fill="none" stroke-width="0.5"/>
    <path d="M80 25 Q92 22 98 18" fill="none" stroke-width="0.5"/>
    <path d="M80 55 Q70 48 65 40" fill="none" stroke-width="0.5"/>
    <path d="M80 55 Q68 50 62 45" fill="none" stroke-width="0.5"/>
    <path d="M80 80 Q90 75 96 68" fill="none" stroke-width="0.4"/>
  `,
  geese: `
    <path d="M20 30 Q25 25 30 28" fill="none" stroke-width="0.7"/>
    <path d="M20 30 Q25 35 30 32" fill="none" stroke-width="0.7"/>
    <path d="M35 25 Q40 20 45 23" fill="none" stroke-width="0.6"/>
    <path d="M35 25 Q40 30 45 27" fill="none" stroke-width="0.6"/>
    <path d="M28 38 Q33 33 38 36" fill="none" stroke-width="0.5"/>
    <path d="M28 38 Q33 43 38 40" fill="none" stroke-width="0.5"/>
    <path d="M48 20 Q53 15 58 18" fill="none" stroke-width="0.5"/>
    <path d="M48 20 Q53 25 58 22" fill="none" stroke-width="0.5"/>
    <path d="M42 33 Q47 28 52 31" fill="none" stroke-width="0.4"/>
    <path d="M42 33 Q47 38 52 35" fill="none" stroke-width="0.4"/>
  `,
  lotus: `
    <ellipse cx="50" cy="70" rx="8" ry="12" fill="none" stroke-width="0.6"/>
    <ellipse cx="42" cy="72" rx="7" ry="11" fill="none" stroke-width="0.5"/>
    <ellipse cx="58" cy="72" rx="7" ry="11" fill="none" stroke-width="0.5"/>
    <circle cx="50" cy="68" r="3" fill="none" stroke-width="0.4"/>
    <path d="M50 82 Q50 90 50 95" fill="none" stroke-width="0.6"/>
    <ellipse cx="35" cy="90" rx="18" ry="4" fill="none" stroke-width="0.4"/>
    <ellipse cx="65" cy="92" rx="15" ry="3" fill="none" stroke-width="0.3"/>
  `,
  pine: `
    <line x1="25" y1="30" x2="25" y2="95" stroke-width="0.8"/>
    <path d="M25 30 Q15 35 10 32 Q18 38 25 40" fill="none" stroke-width="0.5"/>
    <path d="M25 30 Q35 35 40 32 Q32 38 25 40" fill="none" stroke-width="0.5"/>
    <path d="M25 45 Q13 50 8 47 Q16 53 25 55" fill="none" stroke-width="0.5"/>
    <path d="M25 45 Q37 50 42 47 Q34 53 25 55" fill="none" stroke-width="0.5"/>
    <path d="M25 60 Q10 66 5 62 Q14 68 25 70" fill="none" stroke-width="0.4"/>
    <path d="M25 60 Q40 66 45 62 Q36 68 25 70" fill="none" stroke-width="0.4"/>
  `,
  stars: `
    <circle cx="20" cy="15" r="1" fill="currentColor" opacity="0.2"/>
    <circle cx="50" cy="10" r="0.8" fill="currentColor" opacity="0.15"/>
    <circle cx="80" cy="20" r="1.2" fill="currentColor" opacity="0.2"/>
    <circle cx="35" cy="30" r="0.6" fill="currentColor" opacity="0.12"/>
    <circle cx="65" cy="35" r="0.9" fill="currentColor" opacity="0.15"/>
    <circle cx="10" cy="40" r="0.7" fill="currentColor" opacity="0.1"/>
    <circle cx="90" cy="45" r="0.8" fill="currentColor" opacity="0.12"/>
    <circle cx="45" cy="55" r="0.5" fill="currentColor" opacity="0.1"/>
    <circle cx="75" cy="60" r="0.7" fill="currentColor" opacity="0.1"/>
    <circle cx="25" cy="50" r="1" fill="currentColor" opacity="0.15"/>
    <path d="M50 10 L50.3 8.5 L51 10 L50.3 11 Z" fill="currentColor" opacity="0.15"/>
    <path d="M80 20 L80.4 18 L81 20 L80.4 21.5 Z" fill="currentColor" opacity="0.18"/>
  `,
  mist: `
    <path d="M0 40 Q15 36 30 40 Q45 44 60 40 Q75 36 100 40" fill="none" stroke-width="0.5" opacity="0.6"/>
    <path d="M0 55 Q20 51 40 55 Q60 59 80 55 Q90 52 100 55" fill="none" stroke-width="0.4" opacity="0.5"/>
    <path d="M0 70 Q25 66 50 70 Q75 74 100 70" fill="none" stroke-width="0.4" opacity="0.4"/>
    <path d="M10 48 Q30 44 50 48 Q70 52 90 48" fill="none" stroke-width="0.3" opacity="0.35"/>
    <path d="M5 62 Q25 58 45 62 Q65 66 85 62" fill="none" stroke-width="0.3" opacity="0.3"/>
  `,
}

interface Props {
  illustration: string | null
}

export function PoemIllustration({ illustration }: Props) {
  if (!illustration || !ILLUSTRATIONS[illustration]) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full text-warm-gray-light"
        style={{ opacity: 0.12 }}
        stroke="currentColor"
        fill="none"
        dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[illustration] }}
      />
    </div>
  )
}
