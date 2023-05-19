import { useContext } from "react";
import UserContext from "../context/UserContext";

import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { authUser } = useContext(UserContext);

  const location = useLocation();

  if (authUser) {
    // Lets authed user access the child components
    // it will check which child component matchs the route
    // and return that component.
    return <Outlet />;
  } else {
    // pass navigate the state prop. Anything provided to the state
    // prop will be accessible through locations state prop.
    // this will let us use the pathname the user tried to navigate too
    return <Navigate to="/signin" state={{ from: location.pathname }} />;
  }
};

export default PrivateRoute;
