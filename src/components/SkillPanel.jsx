export default function SkillPanel({ skill, index, total, isNarrow }) {
  if (!skill) return null

  // Narrow screens: the 34vw side column has no room for this content, so it
  // becomes a scrollable bottom sheet instead (fixes overflowing/clipped text
  // and content that was unreachable below the fold on short phones).
  const wrapperStyle = isNarrow
    ? {
        position: 'fixed', left: '0.75rem', right: '0.75rem', bottom: '0.75rem',
        top: 'auto', width: 'auto', maxHeight: '48vh', overflowY: 'auto',
        zIndex: 30, pointerEvents: 'auto', paddingTop: 0,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(232,73,29,0.12)', borderRadius: '14px',
        padding: '1rem 1.1rem 1.2rem',
        boxShadow: '0 -8px 30px rgba(23,19,15,0.12)',
        animation: 'fadeSlideUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }
    : {
        position: 'fixed', top: '50%', right: '2.5rem',
        transform: 'translateY(-48%)',
        width: 'min(370px, 34vw)',
        zIndex: 30, pointerEvents: 'none',
        paddingTop: '58px',
        animation: 'fadeSlideIn 0.45s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }

  return (
    <div key={skill.id} style={wrapperStyle}>
      {/* Ghost symbol — decorative only, skip it in the compact mobile sheet */}
      {!isNarrow && (
        <div style={{
          position: 'absolute', top: '2rem', right: '-0.5rem',
          fontFamily: 'var(--font-mono)', fontSize: '7rem',
          color: 'rgba(232,73,29,0.08)', lineHeight: 1, userSelect: 'none',
        }}>{skill.symbol}</div>
      )}

      {/* Section counter */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '0.58rem',
        letterSpacing: '0.38em', color: 'rgba(255,184,0,0.4)',
        textTransform: 'uppercase', marginBottom: '0.6rem',
        display: 'flex', alignItems: 'center', gap: '0.8rem',
      }}>
        <span>{String(index + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,184,0,0.18)' }} />
      </div>

      {/* ── BOLD main title ── */}
      <h2
        key={`h-${index}`}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          lineHeight: 1.0,
          color: 'var(--cream)',
          marginBottom: '0.3rem',
          animation: 'titleReveal 0.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        }}
      >
        {skill.title}
      </h2>

      {/* Gold divider */}
      <div style={{
        width: '50px', height: '3px', marginBottom: '0.65rem',
        background: 'linear-gradient(to right, var(--gold), var(--terracotta))',
        borderRadius: '2px', boxShadow: '0 0 8px rgba(255,184,0,0.5)',
      }} />

      {/* Tagline */}
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: '0.82rem', fontWeight: 400,
        color: 'var(--gold)', letterSpacing: '0.04em',
        marginBottom: '0.85rem', lineHeight: 1.55,
      }}>
        "{skill.tagline}"
      </p>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.73rem',
        fontWeight: 300, color: 'var(--cream-dim)',
        lineHeight: 1.72, marginBottom: '1.0rem',
      }}>
        {skill.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem', marginBottom: '1.1rem' }}>
        {skill.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.57rem',
            fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--gold)', background: 'rgba(255,184,0,0.1)',
            border: '1px solid rgba(255,184,0,0.25)', borderRadius: '2px',
            padding: '3px 8px',
          }}>{tag}</span>
        ))}
      </div>

      {/* Project cards — clickable */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'all' }}>
        {skill.projects.map((project, pi) => (
          <a
            key={pi}
            href={project.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none', display: 'block',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(232,73,29,0.12)',
              borderLeft: `3px solid ${project.color}`,
              borderRadius: '3px', padding: '0.65rem 0.85rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 14px rgba(23,19,15,0.06)',
              position: 'relative', overflow: 'hidden',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.98)'
              e.currentTarget.style.borderColor = 'rgba(232,73,29,0.32)'
              e.currentTarget.style.transform = 'translateX(-4px)'
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(23,19,15,0.12)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.82)'
              e.currentTarget.style.borderColor = 'rgba(232,73,29,0.12)'
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = '0 2px 14px rgba(23,19,15,0.06)'
            }}
          >
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${project.color}10 0%,transparent 55%)`, pointerEvents:'none' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem', marginBottom:'0.28rem' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--cream)' }}>
                {project.name}
              </span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.5rem', color:project.color, letterSpacing:'0.06em', opacity:0.9, whiteSpace:'nowrap', flexShrink:0, display:'flex', alignItems:'center', gap:'3px' }}>
                {project.stack} <span style={{opacity:0.5}}>↗</span>
              </span>
            </div>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.66rem', fontWeight:300, color:'var(--cream-dim)', lineHeight:1.5 }}>
              {project.desc}
            </p>
          </a>
        ))}
      </div>

      {/* Kente bottom accent */}
      <div style={{
        marginTop: '1rem', height: '3px', opacity: 0.55, borderRadius: '2px',
        background: `repeating-linear-gradient(90deg,${skill.projects[0]?.color??'#FFB800'} 0,${skill.projects[0]?.color??'#FFB800'} 8px,var(--gold) 8px,var(--gold) 14px,transparent 14px,transparent 18px)`,
      }} />
    </div>
  )
}
