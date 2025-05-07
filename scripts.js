// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Initialize GSAP and ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // Custom cursor
  const cursorOuter = document.querySelector(".custom-cursor-outer")
  const cursorInner = document.querySelector(".custom-cursor-inner")
  let isHovered = false
  let isClicked = false

  // Only initialize cursor on non-touch devices
  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      gsap.to(cursorOuter, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      })
      gsap.to(cursorInner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.075,
        ease: "power2.out",
      })
    })

    document.addEventListener("mouseenter", () => {
      gsap.to([cursorOuter, cursorInner], {
        opacity: 1,
        duration: 0.3,
      })
    })

    document.addEventListener("mouseleave", () => {
      gsap.to([cursorOuter, cursorInner], {
        opacity: 0,
        duration: 0.3,
      })
    })

    document.addEventListener("mousedown", () => {
      isClicked = true
      gsap.to(cursorOuter, {
        scale: 0.75,
        duration: 0.15,
      })
      gsap.to(cursorInner, {
        scale: 1.5,
        duration: 0.15,
      })
    })

    document.addEventListener("mouseup", () => {
      isClicked = false
      gsap.to(cursorOuter, {
        scale: 1,
        duration: 0.15,
      })
      gsap.to(cursorInner, {
        scale: 1,
        duration: 0.15,
      })
    })

    // Handle link and button hovers
    const interactiveElements = document.querySelectorAll("a, button, input, textarea")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        isHovered = true
        gsap.to(cursorOuter, {
          scale: 1.5,
          duration: 0.15,
        })
        gsap.to(cursorInner, {
          scale: 0,
          duration: 0.15,
        })
      })
      el.addEventListener("mouseleave", () => {
        isHovered = false
        gsap.to(cursorOuter, {
          scale: 1,
          duration: 0.15,
        })
        gsap.to(cursorInner, {
          scale: 1,
          duration: 0.15,
        })
      })
    })
  }

  // Particle background
  const canvas = document.getElementById("particle-canvas")
  const ctx = canvas.getContext("2d")

  // Set canvas to full screen
  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  // Create particles
  const particles = []
  const particleCount = 100
  const colors = ["#26C6DA", "#FFD54F", "#FF8A80", "#42A5F5"]

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  // Mouse interaction
  let mouseX = 0
  let mouseY = 0

  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // Animation
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Move particles
      p.x += p.speedX
      p.y += p.speedY

      // Boundary check
      if (p.x > canvas.width) p.x = 0
      if (p.x < 0) p.x = canvas.width
      if (p.y > canvas.height) p.y = 0
      if (p.y < 0) p.y = canvas.height

      // Mouse interaction - particles move away from mouse
      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const angle = Math.atan2(dy, dx)
        const force = (100 - distance) / 1000
        p.speedX += Math.cos(angle) * force
        p.speedY += Math.sin(angle) * force
      }

      // Apply some friction to prevent particles from accelerating infinitely
      p.speedX *= 0.98
      p.speedY *= 0.98

      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()

      // Connect particles with lines if they're close enough
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }

    requestAnimationFrame(animateParticles)
  }

  animateParticles()

  // Create animated shapes for about section
  const animatedShapes = document.querySelector(".animated-shapes")

  // Create shapes
  const shapes = [
    { type: "square", top: "10%", left: "5%", color: "yellow" },
    { type: "circle", top: "70%", left: "15%", color: "cyan" },
    { type: "triangle", top: "30%", right: "10%", color: "red" },
    { type: "diamond", bottom: "15%", right: "20%", color: "blue" },
    { type: "rectangle", top: "50%", left: "80%", color: "yellow" },
    { type: "hexagon", bottom: "30%", left: "40%", color: "red" },
    { type: "square-accent", top: "20%", left: "60%", color: "yellow" },
  ]

  shapes.forEach((shape) => {
    const shapeEl = document.createElement("div")
    shapeEl.className = `shape shape-${shape.type}`

    // Set position and color
    if (shape.top) shapeEl.style.top = shape.top
    if (shape.left) shapeEl.style.left = shape.left
    if (shape.right) shapeEl.style.right = shape.right
    if (shape.bottom) shapeEl.style.bottom = shape.bottom

    // Set color class
    shapeEl.classList.add(`shape-${shape.color}`)

    // Create special shapes
    if (shape.type === "triangle") {
      shapeEl.innerHTML = '<div class="triangle"></div>'
    } else if (shape.type === "hexagon") {
      shapeEl.innerHTML =
        '<div class="hexagon"><div class="hex-top"></div><div class="hex-middle"></div><div class="hex-bottom"></div></div>'
    } else if (shape.type === "square-accent") {
      shapeEl.innerHTML = '<div class="square-with-accent"><div class="accent"></div></div>'
    }

    animatedShapes.appendChild(shapeEl)
  })

  // Animate shapes with GSAP
  const shapeElements = document.querySelectorAll(".shape")

  shapeElements.forEach((shape) => {
    // Random initial position
    gsap.set(shape, {
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    })

    // Animation
    gsap.to(shape, {
      duration: 10 + Math.random() * 20,
      x: Math.random() * 150 - 75,
      y: Math.random() * 150 - 75,
      rotation: Math.random() * 720 - 360,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  })

  // Hero section animations
  gsap.from(".hero-title", {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: "power3.out",
    delay: 0.5,
  })

  gsap.from(".hero-subtitle", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power3.out",
    delay: 0.8,
  })

  gsap.from(".hero-cta", {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power3.out",
    delay: 1.1,
    stagger: 0.2,
  })

  // Projects section animations
  gsap.from(".project-card", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 70%",
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    stagger: 0.2,
  })

  // About section animations
  gsap.from(".about-image-container", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
    },
    duration: 1,
    x: 50,
    opacity: 0,
    ease: "power2.out",
  })

  gsap.from(".about-text", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
    },
    duration: 1,
    x: -50,
    opacity: 0,
    ease: "power2.out",
  })

  // Skills section animations - horizontal slide in
  const skillCards = document.querySelectorAll(".skill-card")

  skillCards.forEach((card) => {
    const index = Number.parseInt(card.getAttribute("data-index"))

    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top bottom-=100",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
      x: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power2.out",
    })
  })

  // Contact section animations
  gsap.from(".contact-form-container", {
    scrollTrigger: {
      trigger: "#contact",
      start: "top 70%",
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out",
  })

  // Initialize Three.js scene
  function initThreeScene() {
    // Create a scene
    const scene = new THREE.Scene()

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // Append to DOM
    const threeContainer = document.createElement("div")
    threeContainer.className = "three-container"
    threeContainer.style.position = "absolute"
    threeContainer.style.top = "0"
    threeContainer.style.left = "0"
    threeContainer.style.width = "100%"
    threeContainer.style.height = "100%"
    threeContainer.style.pointerEvents = "none"
    threeContainer.style.zIndex = "1"
    document.querySelector(".hero").appendChild(threeContainer)
    threeContainer.appendChild(renderer.domElement)

    // Create geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      wireframe: true,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  // Initialize Three.js if available
  if (typeof THREE !== "undefined") {
    initThreeScene()
  }

  // Initialize Zdog illustration
  function initZdog() {
    // Create a new Zdog illustration
    const illustration = new Zdog.Illustration({
      element: ".about-shape-1",
      dragRotate: true,
    })

    // Add shapes
    // Main cube
    const mainBox = new Zdog.Box({
      addTo: illustration,
      width: 60,
      height: 60,
      depth: 60,
      stroke: 4,
      color: "#FFD54F", // yellow
      leftFace: "#26C6DA", // cyan
      rightFace: "#FF8A80", // red
      topFace: "#42A5F5", // blue
      bottomFace: "#26C6DA", // cyan
      frontFace: "#FFD54F", // yellow
      backFace: "#FF8A80", // red
      rotate: { x: Zdog.TAU / 8, y: -Zdog.TAU / 8 },
    })

    // Animation
    function animate() {
      mainBox.rotate.y += 0.01
      illustration.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()
  }

  // Initialize Zdog if available
  if (typeof Zdog !== "undefined") {
    initZdog()
  }

  /* JavaScript required for animation on scroll */
document.addEventListener('DOMContentLoaded', function() {
        const observer=new IntersectionObserver((entries)=> {
                entries.forEach(entry=> {
                        if (entry.isIntersecting) {
                            const cards=document.querySelectorAll('.skill-card');

                            cards.forEach((card, index)=> {
                                    setTimeout(()=> {
                                            card.style.transform='translateY(0)';
                                            card.style.opacity='1';

                                            // Add float animation after appearing
                                            setTimeout(()=> {
                                                    card.style.animation=`float $ {
                                                        3 + (index % 3) * 0.5
                                                    }

                                                    s ease-in-out infinite`;
                                                }

                                                , 600);
                                        }

                                        , index * 100);
                                });

                            observer.unobserve(entry.target);
                        }
                    });
            }

            , {
            threshold: 0.3
        });

    observer.observe(document.querySelector('.skills'));

    // Add subtle movement to background shapes on mouse move
    const skillsSection=document.querySelector('.skills');
    const shapes=document.querySelectorAll('.skills-bg-shape');

    skillsSection.addEventListener('mousemove', (e)=> {
            const x=e.clientX / window.innerWidth;
            const y=e.clientY / window.innerHeight;

            shapes.forEach((shape, index)=> {
                    const factor=(index + 1) * 15;
                    const offsetX=(x - 0.5) * factor;
                    const offsetY=(y - 0.5) * factor;

                    shape.style.transform=`translate($ {
                            offsetX
                        }

                        px, $ {
                            offsetY
                        }

                        px)`;
                });
        });
});
})
