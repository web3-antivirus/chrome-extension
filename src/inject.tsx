import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import PageInject from 'pages/inject';
import 'assets/scss/global.scss';
import { addFontsToInjectPage } from 'helpers/fonts.helpers';

const app = document.createElement('div');
app.setAttribute('id', 'web3-antivirus-host');

document.body.appendChild(app);

const extensionRoot = document.getElementById('web3-antivirus-host');
if (extensionRoot) {
  try {
    extensionRoot.attachShadow({ mode: 'open' });
  } catch (error) {
    console.log('');
  }
  // Create the shadow root
  const { shadowRoot } = extensionRoot;

  if (shadowRoot) {
    let div = shadowRoot.getElementById('web3-antivirus');
    if (!div) {
      div = document.createElement('div');
      div.setAttribute('id', 'web3-antivirus');
      div.setAttribute('class', 'light-ext');

      shadowRoot.appendChild(div);

      const link = document.createElement('link');
      const stylesLink = browser.runtime?.getURL('static/css/inject.css');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', stylesLink);
      shadowRoot.appendChild(link);
      ReactDOM.render(<PageInject />, div);
    }
  }
}
addFontsToInjectPage();
