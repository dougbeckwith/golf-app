import { createContext } from "react";
import { useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const cookie = Cookies.get("authenticatedUser");

  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  /* sign in method
     returns user if sign in success
     and sets user cookies
     else returns error object 
  */
  const signIn = async (credentials) => {
    const encodedCredentials = btoa(
      `${credentials.email}:${credentials.password}`
    );

    const options = {
      method: "GET",
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/user`,
        options
      );
      if (response.status === 200) {
        const { user } = await response.json();
        Cookies.set("authenticatedUser", JSON.stringify(user), {
          expires: 1
        });
        setAuthUser(user);
        return { user };
      } else if (response.status === 401) {
        const { errors } = await response.json();
        return { errors };
      } else if (response.status === 400) {
        const { errors } = await response.json();
        return { errors };
      } else if (response.status === 500) {
        return { errors: ["Server Error"] };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { errors: ["Server Error"] };
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
