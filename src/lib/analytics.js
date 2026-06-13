// Thin wrapper over gtag custom events (gatsby-plugin-google-gtag provides
// window.gtag and already tracks pageviews). Events are for product questions
// pageviews can't answer: do users finish onboarding, exams, reviews?
function track(name, params = {}) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
}

export { track };
