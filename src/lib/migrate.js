// One-time, idempotent localStorage migrations.
// All persisted state lives in the browser with no backend, so schema changes
// must upgrade existing users' data in place rather than discard it.
const SCHEMA_VERSION = 1;
const VERSION_KEY = 'schemaVersion';

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

    try {
        // v1: the old homepage ran Category B at postfix="" → progress was stored
        // under "state". The new structure reads "state_cat_b"; recover that progress.
        if (current < 1) {
            const orphan = localStorage.getItem('state');
            if (orphan && !localStorage.getItem('state_cat_b')) {
                localStorage.setItem('state_cat_b', orphan);
            }
        }

        localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
    } catch (e) {
        console.error('Migration failed', e);
    }
}

export { runMigrations, SCHEMA_VERSION };
