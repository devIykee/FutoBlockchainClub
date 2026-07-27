/**
 * Inline script to prevent flash of wrong theme before React hydrates.
 * Must stay free of external imports (inlined into layout).
 */
export function ThemeScript() {
  const code = `(function(){try{var k='fbc_theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var r=document.documentElement;if(t==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');}r.style.colorScheme=t;r.dataset.theme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      // eslint-disable-next-line react/no-danger
    />
  );
}
