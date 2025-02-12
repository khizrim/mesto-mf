import React from 'react';
import {Redirect, Route} from "react-router-dom";

const ProtectedRoute = ({component: Component, ...props}) => {
  return (<Route exact>
    {() => props.loggedIn ? <Component {...props} /> :
      <Redirect to="./signin"/>}
  </Route>)
}

export default ProtectedRoute;
