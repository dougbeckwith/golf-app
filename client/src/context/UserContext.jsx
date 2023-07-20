import { createContext } from "react";
import { useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const cookie = Cookies.get("authenticatedUser");

  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  const signIn = async (credentials) => {
    const encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);

    const options = {
      method: "GET",
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/user`, options);

      if (response.status === 200) {
        const { user } = await response.json();
        Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
        setAuthUser(user);
        return { user };
      } else {
        const { serverError } = await response.json();
        return serverError;
      }
    } catch (error) {
      console.log(error);
      return { serverError: "OTHER ERROR" };
    }
  };

  const signOut = () => {
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        actions: {
          signIn: signIn,
          signOut: signOut
        }
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
