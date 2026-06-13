// Lightweight study stats: a daily streak (global) and per-category accuracy.
// Kept small and bounded — no full answer history.

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function dayDiff(fromStr, toStr) {
    return Math.round((Date.parse(toStr) - Date.parse(fromStr)) / 86400000);
}

// ----- daily study streak -----

function getStreak() {
    try {
        const s = JSON.parse(localStorage.getItem('studyStreak'));
        if (s && typeof s.count === 'number') return s;
    } catch (e) {
        // ignore
    }
    return { last: null, count: 0 };
}

// Call once per study session/answer; advances the streak at most once per day.
function recordStudyDay() {
    const today = todayStr();
    const s = getStreak();
    if (s.last === today) return s.count;
    const count = s.last && dayDiff(s.last, today) === 1 ? s.count + 1 : 1;
    try {
        localStorage.setItem('studyStreak', JSON.stringify({ last: today, count }));
    } catch (e) {
        // ignore
    }
    return count;
}

// ----- per-category accuracy -----

const RECENT_CAP = 20;

const { accuracyKey: accKey } = require('./keys');

function getAccuracyRaw(category) {
    try {
        const a = JSON.parse(localStorage.getItem(accKey(category)));
        if (a && typeof a.total === 'number') {
            return { total: a.total, correct: a.correct || 0, recent: Array.isArray(a.recent) ? a.recent : [] };
        }
    } catch (e) {
        // ignore
    }
    return { total: 0, correct: 0, recent: [] };
}

function recordAccuracy(category, correct) {
    const a = getAccuracyRaw(category);
    a.total += 1;
    if (correct) a.correct += 1;
    a.recent = a.recent.concat(correct ? 1 : 0).slice(-RECENT_CAP);
    try {
        localStorage.setItem(accKey(category), JSON.stringify(a));
    } catch (e) {
        // ignore
    }
}

// Overall and recent-window accuracy (null when there's no data yet).
function accuracyStats(category) {
    const a = getAccuracyRaw(category);
    const overall = a.total ? a.correct / a.total : null;
    const recent = a.recent.length ? a.recent.reduce((x, y) => x + y, 0) / a.recent.length : null;
    return { total: a.total, correct: a.correct, overall, recent, recentCount: a.recent.length };
}

module.exports = { recordStudyDay, getStreak, recordAccuracy, accuracyStats };
