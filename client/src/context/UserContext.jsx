import { createContext } from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import Fetch from "../helpers/fetch";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const cookie = Cookies.get("authenticatedUser");

  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  const handleSignInSuccess = async (response) => {
    const { user } = await response.json();
    Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
    setAuthUser(user);
  };

  const signIn = async (credentials) => {
    const encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);

    try {
      const response = await Fetch.get("/user", null, encodedCredentials);
      if (response.status === 200) {
        await handleSignInSuccess(response);
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.log(error);
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
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
