const generateBtn = document.getElementById('generate-btn');
const numberSpans = document.querySelectorAll('.number');
const themeToggle = document.getElementById('theme-toggle');
const lastNumbersContainer = document.getElementById('last-numbers');
const statsGrid = document.getElementById('stats-grid');
const form = document.getElementById('partnership-form');
const submitButton = document.getElementById('submit-button');
const statusText = document.getElementById('form-status');

const OFFICIAL_STATS = {
  1: 199, 2: 188, 3: 201, 4: 194, 5: 178, 6: 197, 7: 200, 8: 180, 9: 158, 10: 189,
  11: 190, 12: 204, 13: 202, 14: 193, 15: 191, 16: 194, 17: 202, 18: 191, 19: 189, 20: 197,
  21: 190, 22: 161, 23: 168, 24: 197, 25: 172, 26: 195, 27: 211, 28: 176, 29: 170, 30: 188,
  31: 196, 32: 175, 33: 204, 34: 204, 35: 191, 36: 186, 37: 197, 38: 199, 39: 190, 40: 194,
  41: 165, 42: 178, 43: 197, 44: 185, 45: 193,
};

const OFFICIAL_LAST_RESULT = [8, 10, 15, 20, 29, 31, 41];

function renderStats(data) {
  if (!statsGrid) return;
  statsGrid.innerHTML = '';

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const hotNumbers = entries.slice(0, 10).map((entry) => entry[0]);
  const coldNumbers = entries.slice(-10).map((entry) => entry[0]);

  for (let i = 1; i <= 45; i += 1) {
    const item = document.createElement('div');
    item.className = 'stat-item';

    const ball = document.createElement('div');
    ball.className = 'stat-ball';
    if (hotNumbers.includes(String(i))) ball.classList.add('hot');
    if (coldNumbers.includes(String(i))) ball.classList.add('cold');
    ball.textContent = i;

    const count = document.createElement('div');
    count.className = 'stat-count';
    count.textContent = `${data[i]}x`;

    item.append(ball, count);
    statsGrid.appendChild(item);
  }
}

function renderLastResult(results) {
  if (!lastNumbersContainer) return;
  const spans = lastNumbersContainer.querySelectorAll('span');
  results.forEach((num, index) => {
    if (spans[index]) spans[index].textContent = num;
  });
}

function generateSmartNumbers() {
  const numbers = new Set();
  const sortedEntries = Object.entries(OFFICIAL_STATS).sort((a, b) => b[1] - a[1]);
  const hotPool = sortedEntries.slice(0, 15).map((entry) => Number.parseInt(entry[0], 10));
  const coldPool = sortedEntries.slice(-15).map((entry) => Number.parseInt(entry[0], 10));

  while (numbers.size < 2) numbers.add(hotPool[Math.floor(Math.random() * hotPool.length)]);
  while (numbers.size < 4) numbers.add(coldPool[Math.floor(Math.random() * coldPool.length)]);
  while (numbers.size < 7) numbers.add(Math.floor(Math.random() * 45) + 1);

  return Array.from(numbers).sort((a, b) => a - b);
}

async function animateNumbers() {
  if (!generateBtn || numberSpans.length === 0) return;
  generateBtn.disabled = true;
  const finalNumbers = generateSmartNumbers();

  numberSpans.forEach((span) => {
    span.classList.remove('active');
    span.textContent = '?';
  });

  for (let i = 0; i < numberSpans.length; i += 1) {
    const span = numberSpans[i];
    let rolls = 0;
    const rollInterval = setInterval(() => {
      span.textContent = Math.floor(Math.random() * 45) + 1;
      rolls += 1;
      if (rolls >= 10) {
        clearInterval(rollInterval);
        span.textContent = finalNumbers[i];
        span.classList.add('active');
      }
    }, 50);

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  generateBtn.disabled = false;
}

function initTheme() {
  if (!themeToggle) return;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

async function submitContactForm(event) {
  event.preventDefault();
  if (!form || !submitButton || !statusText) return;

  submitButton.disabled = true;
  statusText.textContent = '문의 내용을 전송하고 있습니다.';

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('submission_failed');

    form.reset();
    statusText.textContent = '문의가 접수되었습니다. 검토 후 회신드리겠습니다.';
  } catch {
    statusText.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    submitButton.disabled = false;
  }
}

if (generateBtn) generateBtn.addEventListener('click', animateNumbers);
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (form) form.addEventListener('submit', submitContactForm);

initTheme();
renderStats(OFFICIAL_STATS);
renderLastResult(OFFICIAL_LAST_RESULT);
