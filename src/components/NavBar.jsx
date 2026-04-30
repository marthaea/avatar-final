export default function NavBar({ skills, activeIndex, onNavClick }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'stretch',
      height: '58px',
      background: 'rgba(5,3,2,0.88)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(212,168,67,0.15)',
    }}>
      {/* Kente top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'repeating-linear-gradient(90deg,#D4A843 0,#D4A843 10px,#B8431A 10px,#B8431A 18px,#6B3A1F 18px,#6B3A1F 24px,#D4A843 24px,#D4A843 34px,#050302 34px,#050302 42px)',
      }} />

      {/* Logo */}
      <div style={{
        padding: '0 2rem',
        display: 'flex', alignItems: 'center',
        borderRight: '1px solid rgba(212,168,67,0.12)',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: 'var(--gold)',
        }}>MPK</span>
      </div>

      {/* Nav items */}
      <div style={{
        display: 'flex',
        flex: 1,
        alignItems: 'stretch',
        overflowX: 'auto',
      }}>
        {skills.map((skill, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={skill.id}
              onClick={() => onNavClick(i)}
              style={{
                background: 'none',
                border: 'none',
                borderRight: '1px solid rgba(212,168,67,0.08)',
                padding: '0 1.4rem',
                cursor: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                position: 'relative',
                transition: 'background 0.25s',
                background: isActive ? 'rgba(212,168,67,0.07)' : 'transparent',
                flexShrink: 0,
              }}
            >
              {/* Symbol */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: isActive ? 'var(--gold)' : 'var(--muted)',
                transition: 'color 0.3s',
                lineHeight: 1,
              }}>
                {skill.symbol}
              </span>

              {/* Label */}
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--cream)' : 'var(--muted)',
                transition: 'color 0.3s, font-weight 0.2s',
                lineHeight: 1,
              }}>
                {skill.nav}
              </span>

              {/* Active underline */}
              <div style={{
                position: 'absolute', bottom: 0, left: '20%', right: '20%',
                height: '2px',
                background: 'var(--gold)',
                borderRadius: '2px 2px 0 0',
                transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
                transformOrigin: 'center',
              }} />
            </button>
          )
        })}
      </div>

      {/* Status badge */}
      <div style={{
        padding: '0 2rem',
        display: 'flex', alignItems: 'center',
        borderLeft: '1px solid rgba(212,168,67,0.12)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px',
          background: 'rgba(184,67,26,0.15)',
          border: '1px solid rgba(184,67,26,0.35)',
          borderRadius: '20px',
        }}>
          <div style={{
            width: '5px', height: '5px',
            background: '#B8431A',
            borderRadius: '50%',
            animation: 'pulseGold 1.8s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#D4703A',
          }}>
            Available
          </span>
        </div>
      </div>
    </nav>
  )
}
