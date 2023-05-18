import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  // State for response errors
  const [errors, setErrors] = useState([]);

  // State for input
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  // State for errors
  const [error, setError] = useState({
    email: "",
    password: ""
  });

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false);

  const navigateToCreateAccount = () => {
    navigate("/signup");
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Focus input on load
  const inputReference = useRef(null);
  useEffect(() => {
    inputReference.current.focus();
  }, []);

  const isSignInButtonDisabled = () => {
    if (!error.email && !error.password && input.email && input.password) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      email: input.email,
      password: input.password
    };
    try {
      const { user, errors } = await userContext.actions.signIn(credentials);
      if (user) {
        console.log("logged in");
        console.log("user", user);
        setErrors([]);
        // navigate to clubs eventually
      }
      if (errors) {
        console.log("errors", errors);
        setErrors(errors);
      }
    } catch (error) {
      console.log(error);
    }
    setIsloading(false);
  };

  return (
    <>
      <div className="h-screen bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">
            Sign In
          </h2>
          <div className="sm:bg-dark-400 px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                </div>
                <input
                  ref={inputReference}
                  name="email"
                  type="text"
                  onChange={onInputChange}
                  className={`bg-dark-200 placeholder-opacity-30 text-gray-300 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400`}
                  placeholder="John@gmail.com"
                  value={input.email}
                />
                <div className="flex items-center pt-1 pl-1">
                  {error.email && (
                    <p className="h-full text-pink-400 text-xs pr-1">
                      {error.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-2 pb-4">
                <div className="pb-2 pl-1">
                  <label htmlFor="password" className="text-lg">
                    Password
                  </label>
                </div>
                <input
                  name="password"
                  type="password"
                  onChange={onInputChange}
                  className="bg-dark-200 placeholder-opacity-30 text-gray-300 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400"
                  placeholder="Password"
                  value={input.password}
                />
              </div>

              {errors.length > 0 &&
                errors.map((error, index) => {
                  return (
                    <p key={index} className="text-pink-400 text-sm">
                      {error}
                    </p>
                  );
                })}

              <button
                disabled={isSignInButtonDisabled()}
                onClick={handleSubmit}
                type={"submit"}
                className="mt-4 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Sign In
              </button>
              <div className="flex w-full justify-center items-center pt-4">
                <p className="text-gray-500 pr-2">Need an account?</p>
                <button
                  type={"button"}
                  onClick={navigateToCreateAccount}
                  className="text-sm py-3 rounded-md text-gray-400 hover:text-gray-200">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
