// One-time, idempotent localStorage migrations.
// All persisted state lives in the browser with no backend, so schema changes
// must upgrade existing users' data in place rather than discard it.
const SCHEMA_VERSION = 2;
const VERSION_KEY = 'schemaVersion';

// Build a mastery map { [id]: { m, t } } from a pre-mastery progress object,
// so existing users keep credit for what they had already learned.
// - questions removed from the queue were "memorized" → seed high.
// - questions still queued with a correct-streak → seed proportionally.
// - everything else stays unseen (no record → guess rate).
function masteryFromLegacy(state, now) {
    const mastery = {};
    const total = (state.stat && state.stat.total) || 0;
    const queued = new Set((state.queue || []).map(String));
    const streaks = (state.stat && state.stat.questions) || {};
    for (let i = 0; i < total; i++) {
        const key = String(i);
        if (!queued.has(key)) {
            mastery[key] = { m: 0.95, t: now };
        } else if (Object.prototype.hasOwnProperty.call(streaks, key)) {
            const s = Math.max(0, Math.min(3, streaks[key] | 0));
            mastery[key] = { m: 0.45 + 0.13 * s, t: now };
        }
    }
    return mastery;
}

function runMigrations() {
    if (typeof window === 'undefined') return;

    let current;
    try {
        current = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10) || 0;
    } catch (e) {
        // localStorage unavailable (private mode etc.) — nothing to migrate.
        return;
    }
    if (current >= SCHEMA_VERSION) return;

    const now = Date.now();
    try {
        // v1: the old homepage ran Category B at postfix="" → progress was stored
        // under "state". The new structure reads "state_cat_b"; recover that progress.
        if (current < 1) {
            const orphan = localStorage.getItem('state');
            if (orphan && !localStorage.getItem('state_cat_b')) {
                localStorage.setItem('state_cat_b', orphan);
            }
        }

        // v2: backfill the per-question mastery map from existing queue/streak data.
        if (current < 2) {
            for (const cat of ['a', 'b']) {
                const key = `state_cat_${cat}`;
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (e) {
                    continue;
                }
                if (parsed && !parsed.mastery) {
                    parsed.mastery = masteryFromLegacy(parsed, now);
                    localStorage.setItem(key, JSON.stringify(parsed));
                }
            }
        }

        localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
    } catch (e) {
        console.error('Migration failed', e);
    }
}

// CommonJS so node --test can load it directly (webpack interops fine).
module.exports = { runMigrations, masteryFromLegacy, SCHEMA_VERSION };
