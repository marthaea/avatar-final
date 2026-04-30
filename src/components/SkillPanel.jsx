export default function SkillPanel({ skill, index, total }) {
  if (!skill) return null

  return (
    <div
      key={skill.id}
      style={{
        position: 'fixed', top: '50%', right: '2.5rem',
        transform: 'translateY(-48%)',
        width: 'min(370px, 34vw)',
        zIndex: 30, pointerEvents: 'none',
        paddingTop: '58px',
        animation: 'fadeSlideIn 0.45s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }}
    >
      {/* Ghost symbol */}
      <div style={{
        position: 'absolute', top: '2rem', right: '-0.5rem',
        fontFamily: 'var(--font-mono)', fontSize: '7rem',
        color: 'rgba(255,184,0,0.05)', lineHeight: 1, userSelect: 'none',
      }}>{skill.symbol}</div>

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
          textShadow: '0 0 40px rgba(255,184,0,0.25)',
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
              background: 'rgba(8,4,1,0.82)',
              border: '1px solid rgba(255,184,0,0.1)',
              borderLeft: `3px solid ${project.color}`,
              borderRadius: '3px', padding: '0.65rem 0.85rem',
              backdropFilter: 'blur(10px)',
              position: 'relative', overflow: 'hidden',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(20,10,2,0.95)'
              e.currentTarget.style.borderColor = 'rgba(255,184,0,0.32)'
              e.currentTarget.style.transform = 'translateX(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(8,4,1,0.82)'
              e.currentTarget.style.borderColor = 'rgba(255,184,0,0.1)'
              e.currentTarget.style.transform = 'translateX(0)'
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
