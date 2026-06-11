// Light/dark theme. The actual class is set before paint by the inline script in
// gatsby-ssr.js (to avoid a flash); these helpers drive the runtime toggle.
const KEY = 'theme';

function getStored() {
    try {
        return localStorage.getItem(KEY); // 'light' | 'dark' | null (follow system)
    } catch (e) {
        return null;
    }
}

function systemPrefersDark() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
}

function isDark() {
    const stored = getStored();
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return systemPrefersDark();
}

function applyDark(dark) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', dark);
}

function setTheme(value) {
    try {
        localStorage.setItem(KEY, value);
    } catch (e) {
        // ignore
    }
    applyDark(value === 'dark');
}

function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    setTheme(next);
    return next;
}

export { isDark, setTheme, toggleTheme, systemPrefersDark };
