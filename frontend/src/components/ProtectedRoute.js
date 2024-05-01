import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, children, ...rest }) => {
  return (
    <Route {...rest} 
      render={() => (loggedIn ? children : <Redirect to="/signin" />)}
    />
  );
};

export default ProtectedRoute;
