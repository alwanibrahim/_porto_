document.addEventListener("DOMContentLoaded", () => {
  // Import Lucide icons
  import("lucide").then((lucide) => {
    lucide.createIcons()
  })

  // Initialize Three.js
  initThreeJS()

  // Handle scroll indicator visibility
  handleScrollIndicator()

  // Handle navbar active state
  handleNavbarActiveState()

  // Handle contact form submission
  handleContactForm()
})

function initThreeJS() {
  // Import Three.js
  import("three").then((THREE) => {
    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // Append renderer to DOM
    document.getElementById("canvas-container").appendChild(renderer.domElement)

    // Create shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        // Colors matching the portfolio theme
        vec3 darkGreen = vec3(0.165, 0.227, 0.176);
        vec3 orange = vec3(0.961, 0.655, 0.259);
        vec3 cream = vec3(0.961, 0.941, 0.902);

        void main() {
          // Create a flowing pattern
          float noise = sin(vUv.x * 10.0 + uTime * 0.2) * sin(vUv.y * 10.0 + uTime * 0.3) * 0.5 + 0.5;

          // Mix colors based on the noise
          vec3 color = mix(darkGreen, mix(darkGreen * 1.2, orange * 0.3, noise * 0.3), noise * 0.15);

          // Add subtle highlights
          if (noise > 0.97) {
            color = mix(color, cream * 0.8, (noise - 0.97) * 20.0);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32)

    // Create mesh
    const mesh = new THREE.Mesh(geometry, shaderMaterial)
    mesh.position.z = -2
    scene.add(mesh)

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      shaderMaterial.uniforms.uTime.value += 0.01
      renderer.render(scene, camera)
    }

    animate()
  })
}

function handleScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = "0"
      scrollIndicator.style.pointerEvents = "none"
    } else {
      scrollIndicator.style.opacity = "1"
      scrollIndicator.style.pointerEvents = "auto"
    }
  })
}

function handleNavbarActiveState() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active")
      }
    })
  })
}

function handleContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value

      // In a real application, you would send this data to a server
      console.log("Form submitted:", { name, email, message })

      // Show success message
      alert("Thank you for your message! I will get back to you soon.")

      // Reset form
      contactForm.reset()
    })
  }
}
