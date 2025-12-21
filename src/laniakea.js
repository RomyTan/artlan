// Tambahkan export di paling atas
export function initLaniakea() {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  canvas.style.backgroundColor = '#0a0a0a';

  let particles = [];
  const particleCount = 700;
  const letters = "abcdefghijklmnopqrstuvwxyz";

  class Particle {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random() * 0.2 - 0.1;
      this.vy = Math.random() * 0.2 - 0.1;
      this.life = Math.random() * 100;
    }
    draw() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(183, 171, 152, ${0.3 * (this.life / 100)})`;
      ctx.lineWidth = 1;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 5, this.y + this.vy * 5);
      ctx.stroke();
    }
    update(mouse) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 300) {
        this.vx += dx * 0.00005;
        this.vy += dy * 0.00005;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.1;

      this.vx += 0.001;
      this.vy -= 0.001;

      if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.init();
      }
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function render() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update(mouse);
      p.draw();
    });
    requestAnimationFrame(render);
  }
  render();
}