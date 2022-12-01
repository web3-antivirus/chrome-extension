export const addFontsToInjectPage = (): void => {
  const style = document.createElement('style');

  if (chrome.runtime) {
    style.textContent = `
      @font-face {
        font-display: swap;
        font-family: 'Averta';
        font-style: normal;
        font-weight: 400;
        src: url(${chrome.runtime.getURL('/static/media/Averta-Cyrillic-Regular.3de58cdb.woff2')}) format('woff2');
      }
      @font-face {
        font-display: swap;
        font-family: 'Averta';
        font-style: normal;
        font-weight: 600;
        src: url('${chrome.runtime.getURL('/static/media/Averta-Cyrillic-SemiBold.b7572ea9.woff2')}') format('woff2');
      }
      @font-face {
        font-display: swap;
        font-family: 'Averta';
        font-style: normal;
        font-weight: 800;
        src: url('${chrome.runtime.getURL('/static/media/Averta-Cyrillic-ExtraBold.2962aa99.woff2')}') format('woff2');
      }
  `;
  }

  document.head.appendChild(style);
};
