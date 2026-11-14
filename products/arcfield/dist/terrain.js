const canvas = document.querySelector('#tiles');
const context = canvas.getContext('2d');
const note = document.querySelector('#edge-note');

function polygon(points, fill, stroke) {
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  context.stroke();
}

function draw(mode) {
  const split = mode === 'split';
  const project = (x, z, height) => [225 + 142 * x + 125 * z, 98 + 34 * x - 53 * z + height];
  const quad = (x, height) => [project(x, 0, height), project(x + 1, 0, height), project(x + 1, 1, height), project(x, 1, height)];
  const upper = quad(0, 0);
  const lower = quad(1, split ? 76 : 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(-70, 51);
  polygon(lower, '#22334a', '#7794b8');
  if (split) polygon([upper[1], lower[0], lower[3], upper[2]], '#385c8d', '#8ab4ff');
  polygon(upper, '#2d4665', '#8ab4ff');
  for (const [x, y] of [...upper, ...lower]) {
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.fillStyle = '#d7e7ff';
    context.fill();
  }
  context.restore();
  const description = split
    ? 'One tile sits higher. A sheer face fills the gap along the shared edge.'
    : 'The two tiles meet at the same height along the shared edge.';
  canvas.setAttribute('aria-label', description);
  note.textContent = description;
}

if (context) {
  const controls = document.querySelector('#edge-controls');
  const options = controls.querySelectorAll('button');
  for (const option of options) {
    option.addEventListener('click', () => {
      for (const button of options) button.setAttribute('aria-pressed', String(button === option));
      draw(option.dataset.edge);
    });
  }
  draw(controls.querySelector('[aria-pressed="true"]').dataset.edge);
  controls.hidden = false;
}

const copy = document.querySelector('#copy');
if (navigator.clipboard) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#capture-command').textContent);
      copy.textContent = 'Copied';
      status.textContent = 'Command copied.';
    } catch {
      status.textContent = 'Copy failed. Select the command and copy it manually.';
    }
  });
}
