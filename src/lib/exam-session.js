// Persistence for an in-progress mock exam, so an accidental reload doesn't
// silently throw the attempt away — the exam screen can offer to resume.
//
// A session is { ids, answers, current, startedAt }. The countdown keeps running
// off `startedAt` (wall clock), so a reload never gifts extra time. All access is
// SSR-guarded since Gatsby builds pages without a window.
import { examSessionKey } from "./keys";
import { EXAM } from "./exam";

function save(category, session) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(examSessionKey(category), JSON.stringify(session));
    } catch (e) {
        // storage full / unavailable — resume is a nicety, not critical
    }
}

// Returns a valid session or null (absent, unreadable, or empty).
function load(category) {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(examSessionKey(category));
        if (!raw) return null;
        const s = JSON.parse(raw);
        if (!s || !Array.isArray(s.ids) || !s.ids.length || !s.startedAt) return null;
        return s;
    } catch (e) {
        return null;
    }
}

function clear(category) {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(examSessionKey(category));
    } catch (e) {
        // ignore
    }
}

// Seconds left for a saved session, given the exam time limit. May be <= 0.
function remainingFor(session, now = Date.now()) {
    return EXAM.timeLimitMin * 60 - Math.floor((now - session.startedAt) / 1000);
}

export { save, load, clear, remainingFor };
