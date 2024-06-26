import { React } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import store from './app/store';
import RoutesComponent from "./routes/routes";
import { I18nextProvider } from 'react-i18next';
import i18n from './i-18n/i-18n';

import "./index.css";
import PathListener from './components/path-listeners';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <BrowserRouter>
  <I18nextProvider i18n={i18n}>
  <PathListener/>
<RoutesComponent/>
</I18nextProvider>
  </BrowserRouter>
  </Provider>

);









