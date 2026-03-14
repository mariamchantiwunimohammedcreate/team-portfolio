/* HAMBURGER MENU */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active'); // triggers X animation
});

/* MOTTO TYPE EFFECT */
const mottoText = "Code it. Fix it. Slay it.";
const mottoElement = document.getElementById("motto");
let i = 0;

function typeMotto() {
  if (i < mottoText.length) {
    mottoElement.innerHTML += mottoText.charAt(i);
    i++;
    setTimeout(typeMotto, 70);
  }
}

window.addEventListener("load", typeMotto);

/* NETWORK BACKGROUND */
const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let nodes = [];
const nodeCount = 80;

for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  });
}

function animateNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];

    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ff6ec4";
    ctx.fill();

    for (let j = i + 1; j < nodes.length; j++) {
      let dx = n.x - nodes[j].x;
      let dy = n.y - nodes[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateNetwork);
}
animateNetwork();

/* FLOATING SHAPES */
const shapesContainer = document.querySelector(".floating-shapes");

const shapes = ["circle", "square", "triangle"];
for (let i = 0; i < 18; i++) {
  let shape = document.createElement("div");
  shape.className = "shape " + shapes[Math.floor(Math.random() * shapes.length)];
  shape.style.left = Math.random() * 100 + "%";
  shape.style.top = Math.random() * 100 + "%";
  shape.style.animationDuration = 10 + Math.random() * 20 + "s";
  shapesContainer.appendChild(shape);
}

/* SMOOTH SCROLL FOR HERO BUTTONS & NAV LINKS */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    // Close nav menu on mobile after click
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });
});