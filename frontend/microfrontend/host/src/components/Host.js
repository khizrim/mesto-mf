import React, {lazy, Suspense} from "react";
import ReactDOM from "react-dom/client";

import {Route, BrowserRouter, useHistory, Switch} from "react-router-dom";

import * as serviceWorker from '../../serviceWorker';

import {CurrentUserContext} from "../contexts/CurrentUserContext";

import Header from "./Header";
import Footer from "./Footer";

import "../index.css";


const LoginControl = lazy(() => import('auth/LoginControl').catch(() => {
  return {
    default: () => <div className='error'>Component is not available!</div>
  };
}));

const RegisterControl = lazy(() => import('auth/RegisterControl').catch(() => {
  return {
    default: () => <div className='error'>Component is not available!</div>
  };
}));

const Host = ({children}) => {
  const [currentUser, setCurrentUser] = React.useState({});

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/signin");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut}/>
        <Switch>
          <Route path="/signup">
            <Suspense fallback={null}>
              <RegisterControl onRedirect={() => history.push("/signin")}/>
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense fallback={null}>
              <LoginControl/>
            </Suspense>
          </Route>
        </Switch>
        <Footer/>
      </div>
    </CurrentUserContext.Provider>)
};

const rootElement = document.getElementById("app")

if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Host/>
    </BrowserRouter>
  </React.StrictMode>
)

serviceWorker.unregister();

