import React, {lazy, Suspense, useCallback, useEffect} from "react";
import ReactDOM from "react-dom/client";

import {Route, BrowserRouter, useHistory, Switch} from "react-router-dom";

import * as serviceWorker from '../serviceWorker';

import {CurrentUserContext} from "./contexts/CurrentUserContext";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import InfoTooltip from "./components/InfoTooltip";
import Main from "./components/Main";
import Footer from "./components/Footer";

import "./index.css";

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

const PopupWithFormControl = lazy(() => import('shared/PopupWithFormControl').catch(() => {
  return {
    default: () => <div className='error'>Component is not available!</div>
  };
}));

const App = () => {
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  const onTokenCheck = useCallback(event => {
    if (event.detail.email) {
      setEmail(event.detail.email);
      setIsLoggedIn(true);
      history.push("/");
    }
  }, [history]);

  const onTokenUpdate = useCallback(event => {
    const onChange = event.detail.authRequest;
    const email = event.detail.email;

    onChange.then((res) => {
      setIsLoggedIn(true);
      setEmail(email);
      history.push("/");
    }).catch((err) => {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    });
  }, [history]);

  const onSignUp = useCallback(event => {
    const onChange = event.detail.signUpRequest;

    onChange.then((res) => {
      setTooltipStatus("success");
      setIsInfoToolTipOpen(true);
      history.push("/signin");
    }).catch((err) => {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    });
  }, [history])

  const onProfileUpdate = useCallback(event => {
    if (event.detail.profile) {
      setCurrentUser(event.detail.profile);
    }
  }, [])

  useEffect(() => {
    const eventHandlers = [
      {event: 'sign-up', handler: onSignUp},
      {event: "auth-update", handler: onTokenUpdate},
      {event: "auth-check", handler: onTokenCheck},
      {event: 'profile-update', handler: onProfileUpdate},
    ];

    eventHandlers.forEach(({event, handler}) =>
      window.addEventListener(event, handler)
    );

    return () => {
      eventHandlers.forEach(({event, handler}) =>
        window.removeEventListener(event, handler)
      );
    };
  }, [onTokenUpdate]);

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut}/>
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            currentUser={currentUser}
            loggedIn={isLoggedIn}
          />
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
        <PopupWithFormControl title="Вы уверены?" name="remove-card"
                              buttonText="Да"/>
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={() => setIsInfoToolTipOpen(false)}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>)
};

const rootElement = document.getElementById("app")

if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)

serviceWorker.unregister();

