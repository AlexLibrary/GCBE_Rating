export function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  document.getElementById('themeToggle').checked = dark;
  document.getElementById('themeLabel').textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

export function setTheme(dark) {
  applyTheme(dark);
  chrome.storage.local.set({ theme: dark ? 'dark' : 'light' });
}

export function initTheme() {
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('change', () => {
    setTheme(toggle.checked);
  });

  chrome.storage.local.get(['theme'], result => {
    const isDark = result.theme === 'dark';
    applyTheme(isDark);
  });
}
