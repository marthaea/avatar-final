import { useEffect, useRef, useState, useCallback } from 'react'
import AvatarScene from './components/AvatarScene'
import NavBar from './components/NavBar'
import SkillPanel from './components/SkillPanel'
import { SKILLS } from './data/skills'

// Narrow-viewport layout: the side-by-side fixed panels don't have room to
// breathe below ~700px, so this switches to a stacked/bottom-sheet layout.
function useIsNarrow(breakpoint = 700) {
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setIsNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])
  return isNarrow
}

export default function App() {
  const [activeIndex, setActiveIndex]       = useState(0)
  const [loaded, setLoaded]                 = useState(false)   // first model ready
  const [loadedCount, setLoadedCount]       = useState(0)       // how many done
  const [totalModels, setTotalModels]       = useState(9)
  const [cursorPos, setCursorPos]           = useState({ x: -200, y: -200 })
  const isNarrow   = useIsNarrow()
  const scrollRef  = useRef(null)
  const ticking    = useRef(false)

  // Cursor — skip entirely on touch/coarse-pointer devices (no mouse to track)
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const move = e => setCursorPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // Scroll → index
  const handleScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el) { ticking.current = false; return }
      const progress = Math.min(el.scrollTop / (el.scrollHeight - el.clientHeight), 1)
      const idx = Math.min(Math.floor(progress * totalModels), totalModels - 1)
      setActiveIndex(idx)
      ticking.current = false
    })
  }, [totalModels])

  // Click nav → scroll
  const handleNavClick = useCallback(i => {
    const el = scrollRef.current
    if (!el) return
    const target = ((i + 0.5) / totalModels) * (el.scrollHeight - el.clientHeight)
    el.scrollTo({ top: target, behavior: 'smooth' })
  }, [totalModels])

  // Called by AvatarScene when first model is ready → show site
  const handleLoad = useCallback(total => {
    setTotalModels(total)
    setLoaded(true)
    setLoadedCount(1)
  }, [])

  // Called by AvatarScene as each subsequent model finishes
  const handleProgressUpdate = useCallback((count, total) => {
    setLoadedCount(count)
    setTotalModels(total)
  }, [])

  const currentSkill  = SKILLS[activeIndex] ?? SKILLS[0]
  const totalSections = Math.min(SKILLS.length, totalModels)
  const allLoaded     = loadedCount >= totalModels

  return (
    <>
      {/* Cursors */}
      <div className="cursor-dot"  style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* 3D Canvas */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 65% 70% at 45% 85%, #FFFFFF 0%, #F3EEE4 100%)',
      }}>
        <div className="afro-texture" />
        <AvatarScene
          activeIndex={activeIndex}
          onLoad={handleLoad}
          onProgressUpdate={handleProgressUpdate}
        />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 72% at 42% 52%, transparent 30%, rgba(255,255,255,0.6) 100%)',
        }} />
      </div>

      {/* Giant bg title */}
      <div key={`bgtitle-${activeIndex}`} style={{
        position: 'fixed', bottom: '4vh', left: '50%',
        transform: 'translateX(-50%)', zIndex: 5,
        pointerEvents: 'none', whiteSpace: 'nowrap',
        animation: 'fadeSlideUp 0.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(5rem, 16vw, 14rem)',
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          lineHeight: 0.85, color: 'transparent',
          WebkitTextStroke: '1.5px rgba(232,73,29,0.18)',
          userSelect: 'none',
        }}>
          {currentSkill.titleBig}
        </div>
      </div>

      {/* NavBar */}
      <NavBar
        skills={SKILLS.slice(0, totalSections)}
        activeIndex={activeIndex}
        onNavClick={handleNavClick}
      />

      {/* ── Background loading pill ── */}
      {loaded && !allLoaded && (
        <div style={{
          position: 'fixed', bottom: '1.4rem', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid rgba(255,184,0,0.35)',
          borderRadius: '20px', padding: '6px 16px',
          boxShadow: '0 4px 24px rgba(23,19,15,0.08)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeSlideUp 0.4s ease forwards',
        }}>
          {/* Spinner dot */}
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--gold)',
            animation: 'pulseGold 1.2s ease-in-out infinite',
          }} />
          {/* Mini progress bar */}
          <div style={{
            width: '80px', height: '2px',
            background: 'rgba(255,184,0,0.15)', borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(loadedCount / totalModels) * 100}%`,
              background: 'linear-gradient(to right, var(--terracotta), var(--gold))',
              borderRadius: '2px',
              transition: 'width 0.4s ease',
              boxShadow: '0 0 6px rgba(255,184,0,0.6)',
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            letterSpacing: '0.12em', color: 'var(--gold-dim)',
          }}>
            {loadedCount}/{totalModels} sequences
          </span>
        </div>
      )}

      {/* Scroll driver */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ position: 'fixed', inset: 0, overflowY: 'scroll', zIndex: 10 }}
      >
        <div style={{ height: `${(totalModels + 1) * 100}vh` }} />
      </div>

      {/* Left panel */}
      <div style={{
        position: 'fixed', left: isNarrow ? '1rem' : '2.5rem', top: '50%',
        transform: 'translateY(-50%)', zIndex: 30,
        pointerEvents: 'none', paddingTop: '58px',
      }}>
        {!isNarrow && (
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(4rem, 8vw, 7rem)',
            color: 'rgba(232,73,29,0.1)', lineHeight: 1,
            letterSpacing: '-0.02em', marginBottom: '-1rem', userSelect: 'none',
          }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </div>
        )}

        <div key={`lt-${activeIndex}`} style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.0rem, 1.8vw, 1.4rem)',
            fontWeight: 700, color: 'var(--cream)', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {currentSkill.title}
          </div>
          <div style={{
            width: '40px', height: '2.5px',
            background: 'linear-gradient(to right, var(--gold), var(--terracotta))',
            borderRadius: '2px', marginTop: '0.5rem', marginBottom: '1rem',
            boxShadow: '0 0 8px rgba(255,184,0,0.4)',
          }} />
        </div>

        {/* Step indicators — the nav bar already covers section switching on narrow screens */}
        {!isNarrow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {SKILLS.slice(0, totalSections).map((sk, i) => {
              const isReady = i < loadedCount
              return (
                <div key={sk.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: i === activeIndex ? '28px' : '5px', height: '2px',
                    background: i === activeIndex
                      ? 'var(--gold)'
                      : i < activeIndex
                        ? 'rgba(255,184,0,0.3)'
                        : 'var(--dim)',
                    borderRadius: '2px',
                    transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                    opacity: isReady ? 1 : 0.35,
                  }} />
                  {i === activeIndex && (
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.55rem',
                      fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'var(--gold-dim)', animation: 'fadeSlideUp 0.3s ease forwards',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      {sk.nav}
                      {/* Dim dot if animation not loaded yet */}
                      {!isReady && (
                        <span style={{ fontSize: '0.4rem', opacity: 0.5, color: 'var(--terracotta)' }}>
                          ⏳
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Scroll hint */}
        {!isNarrow && (
          <div style={{
            marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px',
            opacity: activeIndex === 0 ? 0.7 : 0, transition: 'opacity 0.5s ease',
          }}>
            <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, transparent, var(--gold-dim))' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Scroll
            </span>
          </div>
        )}

        {/* Social links */}
        <div style={{ marginTop: isNarrow ? '1.2rem' : '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'marthakp.netlify.app',   url: 'https://marthakp.netlify.app/' },
            { label: 'github.com/marthaea',     url: 'https://github.com/marthaea' },
            { label: 'nexushavenn.netlify.app', url: 'https://nexushavenn.netlify.app/' },
          ].map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                letterSpacing: '0.08em', color: 'var(--gold-dim)',
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                gap: '5px', transition: 'color 0.2s', pointerEvents: 'all',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gold-dim)'}
            >
              <span style={{ opacity: 0.4 }}>→</span>{link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <SkillPanel key={activeIndex} skill={currentSkill} index={activeIndex} total={totalSections} isNarrow={isNarrow} />

      {/* Bottom progress bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '2px', background: 'var(--dim)', zIndex: 40, pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${((activeIndex + 1) / totalSections) * 100}%`,
          background: 'linear-gradient(to right, var(--terracotta), var(--gold))',
          transition: 'width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          boxShadow: '0 0 8px rgba(255,184,0,0.6)',
        }} />
      </div>

      {/* ── Initial loading screen — only until FIRST model is ready ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '2rem',
        transition: 'opacity 0.8s ease, visibility 0.8s ease',
        opacity: loaded ? 0 : 1,
        visibility: loaded ? 'hidden' : 'visible',
      }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,184,0,0.3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '14px', border: '1px solid rgba(232,73,29,0.25)', borderBottom: '2px solid var(--terracotta)', borderRadius: '50%', animation: 'spin 1.7s linear infinite reverse' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--gold)' }}>◈</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
            fontWeight: 700, letterSpacing: '0.2em',
            color: 'var(--gold-dim)', marginBottom: '0.4rem',
          }}>
            MARTHA PRAISE KATUSIIME
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            Preparing your experience…
          </div>
        </div>

        {/* Animated dots instead of a fake progress bar */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'var(--gold)',
              animation: `pulseGold 1.2s ease-in-out ${i * 0.25}s infinite`,
            }} />
          ))}
        </div>

        {/* Kente bottom strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: 'repeating-linear-gradient(90deg,#FFB800 0,#FFB800 12px,#E8491D 12px,#E8491D 22px,#7A3A10 22px,#7A3A10 30px,#FFB800 30px,#FFB800 42px,#FFFFFF 42px,#FFFFFF 52px)',
        }} />
      </div>
    </>
  )
}
