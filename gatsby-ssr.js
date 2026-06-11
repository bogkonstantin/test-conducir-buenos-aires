import * as React from "react"

// Set the theme class before the body paints so there's no flash of the wrong
// theme. Kept dependency-free and inlined; mirrors the logic in src/lib/theme.js.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`

export const onRenderBody = ({ setPreBodyComponents }) => {
    setPreBodyComponents([
        React.createElement("script", {
            key: "theme-no-flash",
            dangerouslySetInnerHTML: { __html: themeScript },
        }),
    ])
}
