import ReactDOM from 'react-dom';
import PageInject from 'pages/inject';
import 'assets/scss/global.scss';
import { addFontsToInjectPage } from 'helpers/fonts.helpers';

const app = document.createElement('div');
document.body.appendChild(app);

addFontsToInjectPage();

ReactDOM.render(<PageInject />, app);
