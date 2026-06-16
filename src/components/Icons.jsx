/**
 * 🌿 Organic Minimalism Icons
 *
 * Abstract blob/liquid shapes with matte ceramic aesthetic.
 * Morandi colors: sage, blush, sky-blue, warm gold.
 * Soft drop-shadow for silicone/ceramic depth.
 */

const V = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' }
const a = (c) => ({ sage: '#8FA88F', blush: '#E2B8AC', sky: '#95AEC0', warm: '#CCB890' }[c])
const u = '#C4BFB5'

let _id = 0
function Shadow({ id, color }) {
  return (
    <defs>
      <filter id={`s-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="3" floodColor={color || '#C4BFB5'} floodOpacity="0.25" />
        <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="1" floodColor="#FFFFFF" floodOpacity="0.5" />
      </filter>
      <filter id={`i-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b"/>
        <feOffset dx="0.5" dy="0.5" result="o"/>
        <feFlood floodColor={color || '#C4BFB5'} floodOpacity="0.3" result="f"/>
        <feComposite in="f" in2="o" operator="in" result="s"/>
        <feComposite in="s" in2="SourceGraphic" operator="atop"/>
      </filter>
    </defs>
  )
}

// ─── Home — organic dome/cave blob ───
export function HomeIcon({ active }) {
  const id = ++_id; const c = active ? a('sage') : u
  return (
    <svg {...V}>
      <Shadow id={id} color={c}/>
      <path
        d="M5.5 18V11.2C5.5 10.3 5.9 9.5 6.5 9L11.3 5.8C11.7 5.5 12.3 5.5 12.7 5.8L17.5 9C18.1 9.5 18.5 10.3 18.5 11.2V18C18.5 19.1 17.6 20 16.5 20H7.5C6.4 20 5.5 19.1 5.5 18Z"
        fill={active ? c : 'none'} fillOpacity={active ? 0.2 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round" strokeLinejoin="round"
        filter={active ? `url(#s-${id})` : undefined}
      />
      {active && (
        <>
          <path d="M10 16C10 14.3 11.3 13 13 13C14.7 13 16 14.3 16 16" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" filter={`url(#i-${id})`}/>
          <circle cx="9" cy="11" r="1.2" fill={c} opacity="0.5"/>
          <circle cx="15" cy="11" r="1.2" fill={c} opacity="0.5"/>
        </>
      )}
    </svg>
  )
}

// ─── Inspiration — organic liquid spark / flower bloom ───
export function SparkIcon({ active }) {
  const id = ++_id; const c = active ? a('sky') : u
  return (
    <svg {...V}>
      <Shadow id={id} color={c}/>
      <path
        d="M12 2C12 2 12.5 5 13 6.5C14 8.5 16 10 18 10.5C19.5 11 20 11.5 20 12C20 12.5 18.5 13 17 13.5C15 14 13.5 15.5 13 17C12.5 18.5 12 22 12 22C12 22 11.5 18.5 11 17C10.5 15.5 9 14 7 13.5C5.5 13 4 12.5 4 12C4 11.5 5.5 11 7 10.5C9 10 10.5 8.5 11 6.5C11.5 5 12 2 12 2Z"
        fill={active ? c : 'none'} fillOpacity={active ? 0.25 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        strokeLinejoin="round"
        filter={active ? `url(#s-${id})` : undefined}
      />
      <circle cx="12" cy="12" r="2.8" fill={c} opacity={active ? 0.4 : 0.3} filter={active ? `url(#i-${id})` : undefined}/>
    </svg>
  )
}

// ─── Diary — organic rounded book / tablet ───
export function BookIcon({ active }) {
  const id = ++_id; const c = active ? a('blush') : u
  return (
    <svg {...V}>
      <Shadow id={id} color={c}/>
      <rect x="4.5" y="3.5" width="15" height="17" rx="5"
        fill={active ? c : 'none'} fillOpacity={active ? 0.15 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        filter={active ? `url(#s-${id})` : undefined}
      />
      <path d="M12 3.5V20.5" stroke={c} strokeWidth="1.3" opacity="0.45"/>
      <path d="M7.5 7.5H10.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
      <path d="M7.5 10.5H10.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
      {active && <path d="M7.5 13.5H10.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>}
    </svg>
  )
}

// ─── Resources — interlocking organic rings / orbit ───
export function NestIcon({ active }) {
  const id = ++_id; const c = active ? a('warm') : u
  return (
    <svg {...V}>
      <Shadow id={id} color={c}/>
      <circle cx="8.5" cy="12" r="5.5"
        fill={active ? c : 'none'} fillOpacity={active ? 0.12 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        filter={active ? `url(#s-${id})` : undefined}
      />
      <circle cx="15.5" cy="12" r="5.5"
        fill={active ? c : 'none'} fillOpacity={active ? 0.12 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        filter={active ? `url(#s-${id})` : undefined}
      />
      <circle cx="12" cy="12" r="2.2" fill={c} opacity={active ? 0.5 : 0.35} filter={active ? `url(#i-${id})` : undefined}/>
    </svg>
  )
}

// ─── Media — organic flowing wave / leaf ───
export function MusicIcon({ active }) {
  const id = ++_id; const c = active ? a('warm') : u
  return (
    <svg {...V}>
      <Shadow id={id} color={c}/>
      <path
        d="M5.5 16C5.5 13.2 7.8 11 10.5 11C13.2 11 15.5 13.2 15.5 16C15.5 18.8 13.2 21 10.5 21C7.8 21 5.5 18.8 5.5 16Z"
        fill={active ? c : 'none'} fillOpacity={active ? 0.18 : 0}
        stroke={c} strokeWidth={active ? 2 : 1.6}
        filter={active ? `url(#s-${id})` : undefined}
      />
      <path d="M15.5 16V4.5L21 2.5V13"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="18.5" cy="13" r="2.8" fill="none" stroke={c} strokeWidth="1.5"/>
      <circle cx="10.5" cy="16" r="2.2" fill={c} opacity={active ? 0.4 : 0.3}/>
    </svg>
  )
}
