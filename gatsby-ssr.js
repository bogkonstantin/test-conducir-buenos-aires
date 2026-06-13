import * as React from "react"

// Set the theme class before the body paints so there's no flash of the wrong
// theme. Kept dependency-free and inlined; mirrors the logic in src/lib/theme.js.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`

export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
    setHeadComponents([
        React.createElement("link", {
            key: "gf-preconnect-1",
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
        }),
        React.createElement("link", {
            key: "gf-preconnect-2",
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
        }),
        React.createElement("link", {
            key: "gf-stylesheet",
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap",
        }),
    ])
    setPreBodyComponents([
        React.createElement("script", {
            key: "theme-no-flash",
            dangerouslySetInnerHTML: { __html: themeScript },
        }),
    ])
}
