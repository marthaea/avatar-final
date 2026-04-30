import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_PATHS = [
  '/models/model__1_.glb',
  '/models/model__2_.glb',
  '/models/model__3_.glb',
  '/models/model__4_.glb',
  '/models/model__5_.glb',
  '/models/model__6_.glb',
  '/models/model__8_.glb',
  '/models/model__9_.glb',
  '/models/model__10_.glb',
  '/models/model__11_.glb',
]

export const CAM_CONFIGS = [
  { pos: [0,    1.35, 4.0], look: [0,  0.9,  0] }, // Developer
  { pos: [1.8,  1.2,  3.6], look: [0,  1.0,  0] }, // Designer
  { pos: [0,    0.75, 3.2], look: [0,  1.15, 0] }, // Storyteller
  { pos: [-2.0, 1.0,  3.4], look: [0,  1.05, 0] }, // Animator
  { pos: [0,    2.4,  3.8], look: [0,  1.1,  0] }, // Founder
  { pos: [0.6,  1.7,  3.3], look: [0,  1.2,  0] }, // Academic
  { pos: [2.2,  0.9,  3.2], look: [0,  0.95, 0] }, // Artist
  { pos: [-1.2, 1.5,  3.6], look: [0,  1.0,  0] }, // IT Pro
  { pos: [0.8,  0.6,  3.0], look: [0,  1.25, 0] }, // new — low close-up
  { pos: [0,    1.35, 4.2], look: [0,  0.9,  0] }, // Connect
]

export default function AvatarScene({ activeIndex, onLoad, onProgressUpdate }) {
  const containerRef = useRef(null)
  const stateRef = useRef({
    mixer: null,
    actions: new Array(MODEL_PATHS.length).fill(null),
    currentIndex: 0,
    renderer: null,
    animFrameId: null,
    clock: null,
    ring: null,
    outerRing: null,
    particles: null,
    camera: null,
    avatar: null,
    targetCamPos: new THREE.Vector3(0, 1.35, 4.0),
    targetCamLook: new THREE.Vector3(0, 0.9, 0),
    currentCamLook: new THREE.Vector3(0, 0.9, 0),
    loadedCount: 0,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const s = stateRef.current

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    container.appendChild(renderer.domElement)
    s.renderer = renderer

    // ── Scene ─────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050302, 0.055)

    // ── Camera ────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      40, container.clientWidth / container.clientHeight, 0.01, 200
    )
    camera.position.set(0, 1.35, 4.0)
    camera.lookAt(0, 0.9, 0)
    s.camera = camera

    // ── Lighting ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x200E05, 1.5))

    const key = new THREE.DirectionalLight(0xFFD060, 5.0)
    key.position.set(2.5, 5.5, 3)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.1; key.shadow.camera.far = 20
    key.shadow.camera.left = -3; key.shadow.camera.right = 3
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -1
    key.shadow.bias = -0.001
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xFF4500, 1.8)
    fill.position.set(-3.5, 1.5, 1)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xFFBB00, 3.5)
    rim.position.set(-0.5, 3.5, -4)
    scene.add(rim)

    const spot = new THREE.SpotLight(0xFFAA00, 5.0, 7, Math.PI / 9, 0.65, 1.5)
    spot.position.set(0, 6, 0.5)
    spot.target.position.set(0, 0, 0)
    scene.add(spot); scene.add(spot.target)

    const counter = new THREE.PointLight(0x004444, 1.2, 9)
    counter.position.set(0, 2.5, -4)
    scene.add(counter)

    const footLight = new THREE.PointLight(0xFF8800, 2.0, 3)
    footLight.position.set(0, 0.3, 1.5)
    scene.add(footLight)

    // ── Ground ────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4, 72),
      new THREE.MeshStandardMaterial({ color: 0x0D0804, metalness: 0.8, roughness: 0.3 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFAA00, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 80), ringMat)
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002
    scene.add(ring); s.ring = ring

    const midRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.16, 80),
      new THREE.MeshBasicMaterial({ color: 0xFF4500, side: THREE.DoubleSide, transparent: true, opacity: 0.28 })
    )
    midRing.rotation.x = -Math.PI / 2; midRing.position.y = 0.002
    scene.add(midRing); s.outerRing = midRing

    const outerRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(1.9, 1.93, 80),
      new THREE.MeshBasicMaterial({ color: 0xFFBB00, side: THREE.DoubleSide, transparent: true, opacity: 0.10 })
    )
    outerRingMesh.rotation.x = -Math.PI / 2; outerRingMesh.position.y = 0.002
    scene.add(outerRingMesh)

    // ── Particles ─────────────────────────────────────────────────
    const pCount = 90
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    const pPhase = new Float32Array(pCount)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*3.5
      pPos[i*3+1] = Math.random()*4.0
      pPos[i*3+2] = (Math.random()-0.5)*3.5
      pPhase[i]   = Math.random()*Math.PI*2
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xFFCC44, size: 0.022, transparent: true, opacity: 0.7, depthWrite: false,
    }))
    scene.add(particles)
    s.particles = { mesh: particles, positions: pPos, phases: pPhase }

    // ── Render loop ───────────────────────────────────────────────
    s.clock = new THREE.Clock()
    const animate = () => {
      s.animFrameId = requestAnimationFrame(animate)
      const delta = s.clock.getDelta()
      const t = s.clock.elapsedTime

      if (s.mixer) s.mixer.update(delta)

      // Smooth camera lerp
      camera.position.lerp(s.targetCamPos, 0.045)
      s.currentCamLook.lerp(s.targetCamLook, 0.045)
      camera.lookAt(s.currentCamLook)

      // Pulse rings
      if (s.ring) {
        s.ring.material.opacity = 0.45 + Math.sin(t * 1.8) * 0.2
        s.outerRing.material.opacity = 0.14 + Math.sin(t * 1.1 + 1) * 0.08
      }

      // Float particles
      if (s.particles) {
        const { mesh, positions, phases } = s.particles
        for (let i = 0; i < pCount; i++) {
          positions[i*3+1] += 0.0018
          positions[i*3]   += Math.sin(t*0.6 + phases[i]) * 0.0005
          if (positions[i*3+1] > 4.2) positions[i*3+1] = 0
        }
        mesh.geometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── PROGRESSIVE LOADING ───────────────────────────────────────
    // Load model 1 first → show site immediately
    // Then load models 2-9 silently in the background
    const loader = new GLTFLoader()

    const setupAvatar = (gltf) => {
      const avatar = gltf.scene
      const box = new THREE.Box3().setFromObject(avatar)
      const size = box.getSize(new THREE.Vector3())
      const scaleFactor = 2.2 / Math.max(size.x, size.y, size.z)
      const center = box.getCenter(new THREE.Vector3())
      avatar.scale.setScalar(scaleFactor)
      avatar.position.x = -center.x * scaleFactor
      avatar.position.y = -box.min.y * scaleFactor
      avatar.position.z = -center.z * scaleFactor
      avatar.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true; c.receiveShadow = true
          if (c.material) c.material.envMapIntensity = 2.0
        }
      })
      scene.add(avatar)
      s.avatar = avatar

      const mixer = new THREE.AnimationMixer(avatar)
      s.mixer = mixer
      return { mixer, scaleFactor, center, box }
    }

    // Load FIRST model — this unblocks the loading screen
    loader.load(MODEL_PATHS[0], (gltf) => {
      const { mixer } = setupAvatar(gltf)

      if (gltf.animations[0]) {
        const action = mixer.clipAction(gltf.animations[0])
        action.loop = THREE.LoopRepeat
        action.play()
        s.actions[0] = action
      }

      s.loadedCount = 1
      // ✅ Site is now visible — user can start exploring
      if (onLoad) onLoad(MODEL_PATHS.length)
      if (onProgressUpdate) onProgressUpdate(1, MODEL_PATHS.length)

      // Load remaining models one by one in the background (no rush)
      let i = 1
      const loadNext = () => {
        if (i >= MODEL_PATHS.length) return
        const idx = i
        loader.load(MODEL_PATHS[idx], (g) => {
          if (g.animations[0] && s.mixer) {
            const action = s.mixer.clipAction(g.animations[0])
            action.loop = THREE.LoopRepeat
            s.actions[idx] = action
          }
          s.loadedCount = idx + 1
          if (onProgressUpdate) onProgressUpdate(s.loadedCount, MODEL_PATHS.length)
          i++
          // Small delay between each load so we don't hammer the network
          setTimeout(loadNext, 200)
        }, undefined, err => {
          console.warn(`Model ${idx} failed:`, err)
          i++
          setTimeout(loadNext, 200)
        })
      }
      loadNext()

    }, undefined, err => console.error('First model failed:', err))

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(s.animFrameId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  // ── Camera target on section change ───────────────────────────
  useEffect(() => {
    const s = stateRef.current
    const cfg = CAM_CONFIGS[activeIndex] ?? CAM_CONFIGS[0]
    s.targetCamPos.set(...cfg.pos)
    s.targetCamLook.set(...cfg.look)
  }, [activeIndex])

  // ── Crossfade animation ───────────────────────────────────────
  useEffect(() => {
    const s = stateRef.current
    if (activeIndex === s.currentIndex) return
    const from = s.actions[s.currentIndex]
    const to   = s.actions[activeIndex]
    // If target animation not loaded yet, just wait — it'll come
    if (!to) return
    if (from) {
      to.reset().play()
      from.crossFadeTo(to, 0.5, true)
    } else {
      to.reset().play()
    }
    s.currentIndex = activeIndex
  }, [activeIndex])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
}
