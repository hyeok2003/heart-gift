const giftButton = document.querySelector("#giftButton");
const hero = document.querySelector("#hero");
const heartStage = document.querySelector("#heartStage");
const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function burst(amount = 70) {
  const colors = ["#e74868", "#ff8ea2", "#ffd09e", "#ffffff"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.47;

  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 7;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      life: 1,
      decay: 0.008 + Math.random() * 0.009,
    });
  }

  cancelAnimationFrame(animationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.13;
    particle.vx *= 0.99;
    particle.rotation += particle.rotationSpeed;
    particle.life -= particle.decay;

    ctx.save();
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.62);
    ctx.restore();
  });

  if (particles.length) animationId = requestAnimationFrame(animateConfetti);
  else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function sprinkleHearts(amount = 16) {
  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.style.left = `${12 + Math.random() * 76}%`;
    heart.style.bottom = `${-10 - Math.random() * 15}px`;
    heart.style.fontSize = `${12 + Math.random() * 23}px`;
    heart.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
    heart.style.setProperty("--rotate", `${-40 + Math.random() * 80}deg`);
    heart.style.animationDelay = `${Math.random() * 0.45}s`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

giftButton.addEventListener("click", () => {
  giftButton.setAttribute("aria-expanded", "true");
  burst(90);
  sprinkleHearts(22);
  hero.classList.add("opened");

  window.setTimeout(() => {
    heartStage.hidden = false;
    heartStage.classList.add("reveal");
    heartStage.scrollIntoView({ behavior: "smooth", block: "start" });
    hero.hidden = true;
    document.title = "정현에게 ♥";
  }, 650);
}, { once: true });

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
