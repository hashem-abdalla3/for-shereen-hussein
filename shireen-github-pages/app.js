const encouragements = [
  'Take a breath… you are closer than you think.',
  'Today’s effort will become tomorrow’s pride. I see how hard you are trying.',
  'One small step today is enough. Just keep going.',
  'You do not have to be strong all the time… just remember that you are not alone.',
  'I believe in you, even in the moments when you forget to believe in yourself.',
];

const expectedPasswordHash = 'd54123de468bd42ea00dafbd777f85fe5fa1ff6404d9838c007953c25c92a1c5';

async function hash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function unlockPage() {
  document.body.classList.remove('locked');
  document.querySelector('#login-shell').hidden = true;
  sessionStorage.setItem('shireen-access', 'open');
}

if (sessionStorage.getItem('shireen-access') === 'open') unlockPage();

document.querySelector('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const passwordInput = document.querySelector('#password');
  const error = document.querySelector('#form-error');
  if (await hash(passwordInput.value) === expectedPasswordHash) {
    unlockPage();
  } else {
    error.hidden = false;
    passwordInput.select();
  }
});

let encouragementIndex = 0;
const reminderButton = document.querySelector('#reminder-button');
const encouragement = document.querySelector('#encouragement');

reminderButton.addEventListener('click', () => {
  encouragementIndex = (encouragementIndex + 1) % encouragements.length;
  encouragement.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
  encouragement.textContent = encouragements[encouragementIndex];
});

function nextBirthday(now) {
  let birthday = new Date(now.getFullYear(), 9, 3, 0, 0, 0, 0);
  const endOfBirthday = new Date(now.getFullYear(), 9, 3, 23, 59, 59, 999);
  if (now > endOfBirthday) birthday = new Date(now.getFullYear() + 1, 9, 3, 0, 0, 0, 0);
  return birthday;
}

function updateCountdown() {
  const now = new Date();
  const isBirthday = now.getMonth() === 9 && now.getDate() === 3;
  if (isBirthday) {
    document.querySelector('#birthday-title').textContent = 'Today is your day, Shereen Hussein 🤍';
    document.querySelector('#birthday-copy').textContent = 'I wish you a year that brings peace to your heart, success worthy of your effort, and days as beautiful as your smile.';
    document.querySelector('#countdown').hidden = true;
    return;
  }

  const difference = Math.max(0, nextBirthday(now).getTime() - now.getTime());
  const values = {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
  for (const [key, value] of Object.entries(values)) {
    document.querySelector(`#${key}`).textContent = String(value).padStart(2, '0');
  }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
