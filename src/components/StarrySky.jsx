import { useEffect, useRef } from 'react'

/**
 * 🌠 Meteor Shower Sky — visible on cream background.
 * Uses deep indigo/blue-purple + warm gold meteors that contrast with #F4F1EC.
 */
export default function StarrySky() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let id, stars = [], meteors = []

    function resize() {
      c.width = window.innerWidth
      c.height = window.innerHeight
      stars = Array.from({ length: Math.min(Math.floor(c.width * c.height / 3500), 280) }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: 0.4 + Math.random() * 2.2,
        base: 0.1 + Math.random() * 0.5,
        speed: 1 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        // Stars get subtle blue or gold tint
        hue: Math.random() < 0.3 ? 'gold' : 'blue',
      }))
    }

    function spawn() {
      meteors.push({
        x: Math.random() * c.width * 1.3,
        y: Math.random() * c.height * 0.35,
        len: 70 + Math.random() * 180,
        spd: 4 + Math.random() * 9,
        life: 0, maxLife: 45 + Math.random() * 55,
        delay: Math.random() * 150,
        thick: 0.8 + Math.random() * 2.4,
        angle: -20 + Math.random() * 24,
        // Mix of deep indigo and warm gold — both visible on cream
        color: Math.random() < 0.55 ? 'indigo' : 'gold',
      })
      if (meteors.length > 10) meteors.shift()
    }

    function star(s, t) {
      const tw = Math.sin(t * s.speed + s.phase)
      const op = Math.max(0.04, Math.min(0.9, s.base + tw * 0.35))

      if (s.hue === 'gold') {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0, `rgba(200,170,130,${op})`)
        g.addColorStop(0.5, `rgba(180,150,100,${op * 0.4})`)
        g.addColorStop(1, 'rgba(200,170,130,0)')
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      } else {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0, `rgba(140,155,190,${op})`)
        g.addColorStop(0.5, `rgba(120,135,170,${op * 0.4})`)
        g.addColorStop(1, 'rgba(140,155,190,0)')
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      }
      if (op > 0.3) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, op)})`; ctx.fill()
      }
    }

    function meteor(m) {
      if (m.delay > 0) return
      const p = m.life / m.maxLife
      const alpha = p < 0.08 ? p / 0.08 : p > 0.55 ? (1 - p) / 0.45 : 1
      const rad = (m.angle * Math.PI) / 180
      const dx = Math.cos(rad), dy = Math.sin(rad)
      const hx = m.x - m.life * m.spd * dx * 1.5
      const hy = m.y - m.life * m.spd * dy * 1.5
      const tx = hx + dx * m.len, ty = hy + dy * m.len

      const g = ctx.createLinearGradient(hx, hy, tx, ty)

      if (m.color === 'gold') {
        // Warm gold/amber — visible on cream
        g.addColorStop(0, `rgba(180,140,80,${alpha * 0.9})`)
        g.addColorStop(0.2, `rgba(160,120,60,${alpha * 0.5})`)
        g.addColorStop(0.5, `rgba(140,100,40,${alpha * 0.2})`)
        g.addColorStop(1, 'rgba(160,120,60,0)')
      } else {
        // Deep indigo/blue — visible on cream
        g.addColorStop(0, `rgba(80,90,160,${alpha * 0.9})`)
        g.addColorStop(0.2, `rgba(60,70,140,${alpha * 0.55})`)
        g.addColorStop(0.5, `rgba(40,50,120,${alpha * 0.2})`)
        g.addColorStop(1, 'rgba(60,70,140,0)')
      }

      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty)
      ctx.strokeStyle = g; ctx.lineWidth = m.thick; ctx.lineCap = 'round'; ctx.stroke()

      // Head glow
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, m.thick * 3)
      hg.addColorStop(0, `rgba(255,255,255,${alpha * 0.7})`)
      hg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath(); ctx.arc(hx, hy, m.thick * 3, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill()
    }

    let timer = 0, interval = 50

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height)
      const t = Date.now() / 1000
      stars.forEach(s => star(s, t))
      meteors.forEach(m => { if (m.delay > 0) m.delay--; else { m.life++; if (m.life < m.maxLife) meteor(m) } })
      timer++
      if (timer > interval) {
        timer = 0; interval = 35 + Math.random() * 65
        spawn()
        if (Math.random() < 0.5) setTimeout(spawn, 70 + Math.random() * 250)
        if (Math.random() < 0.25) setTimeout(spawn, 300 + Math.random() * 400)
      }
      meteors = meteors.filter(m => m.life < m.maxLife && m.delay < 250)
      id = requestAnimationFrame(draw)
    }

    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="starry-sky" aria-hidden="true" />
}
