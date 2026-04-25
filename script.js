/* ─── BUBBLES BACKGROUND ─── */
const canvas = document.getElementById('bubble-canvas');
const ctx = canvas.getContext('2d');
let W, H, bubbles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = document.body.scrollHeight;
}

function makeBubble() {
  const r = Math.random() * 48 + 14;
  return {
    x: Math.random() * W,
    y: H + r + Math.random() * 200,
    r,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(Math.random() * 0.5 + 0.2),
    alpha: Math.random() * 0.3 + 0.04,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.01 + 0.005
  };
}

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < 38; i++) {
    const b = makeBubble();
    b.y = Math.random() * H;
    bubbles.push(b);
  }
}

function drawBubble(b) {
  b.phase += b.speed;
  b.x += Math.sin(b.phase) * 0.6 + b.vx;
  b.y += b.vy;

  if (b.y < -b.r * 2) {
    Object.assign(b, makeBubble());
  }

  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

  const g = ctx.createRadialGradient(
    b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.05,
    b.x, b.y, b.r
  );
  g.addColorStop(0, `rgba(232, 201, 168, ${b.alpha * 1.4})`);
  g.addColorStop(0.6, `rgba(200, 133, 74, ${b.alpha * 0.5})`);
  g.addColorStop(1, `rgba(200, 133, 74, 0)`);

  ctx.fillStyle = g;
  ctx.fill();

  ctx.strokeStyle = `rgba(200, 133, 74, ${b.alpha * 0.7})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${b.alpha * 1.2})`;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  bubbles.forEach(drawBubble);
  requestAnimationFrame(animate);
}

resize();
initBubbles();
animate();

window.addEventListener('resize', () => {
  resize();
  initBubbles();
});

new ResizeObserver(() => {
  resize();
}).observe(document.body);


document.getElementById('pfp-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = document.getElementById('pfp-img');
    img.src = ev.target.result;
    img.style.display = 'block';
    document.getElementById('pfp-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

let projects = [

];

function openModal() {
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');

  ['p-title','p-tag','p-desc','p-stack','p-link'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

function addProject() {
  const title = document.getElementById('p-title').value.trim();
  if (!title) {
    document.getElementById('p-title').focus();
    return;
  }

  const proj = {
    title,
    tag: document.getElementById('p-tag').value.trim() || 'Cyber/Data Project',
    desc: document.getElementById('p-desc').value.trim() || 'Security or analytics focused project.',
    stack: document.getElementById('p-stack').value.split(',').map(s => s.trim()).filter(Boolean),
    link: document.getElementById('p-link').value.trim()
  };

  projects.push(proj);
  renderProjects();
  closeModal();
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  projects.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const stacks = p.stack.map(s => `<span class="stack-dot">${s}</span>`).join('');

    const linkBtn = p.link
      ? `<a href="${p.link}" target="_blank" class="project-link">↗</a>`
      : `<button class="project-link" style="opacity:0.3" disabled>↗</button>`;

    card.innerHTML = `
      <span class="project-tag">${p.tag}</span>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-footer">
        <div class="project-stack">${stacks}</div>
        ${linkBtn}
      </div>
    `;

    grid.appendChild(card);
  });

  const addCard = document.createElement('div');
  addCard.className = 'project-card add-card';
  addCard.onclick = openModal;

  addCard.innerHTML = `
    <div class="add-icon">+</div>
    <div>
      <strong>Add another project</strong>
      <p>Keep building your cyber/data portfolio</p>
    </div>
  `;

  grid.appendChild(addCard);
}



const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section, #projects .inner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});


document.addEventListener('DOMContentLoaded', renderProjects);