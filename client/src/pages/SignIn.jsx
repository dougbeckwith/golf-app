import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import BarLoader from "react-spinners/BarLoader";

const SignIn = () => {
  const navigate = useNavigate();
  const { authUser, actions } = useContext(UserContext);
  const emailInputRef = useRef(null);

  const [serverError, setServerError] = useState("");
  const [input, setInput] = useState({ email: "", password: "" });
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (authUser) navigate("/clubs");
  });

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsloading(true);

    const credentials = { email: input.email, password: input.password };

    try {
      const response = await actions.signIn(credentials);
      if (response.status === 200) {
        handleSignInSuccess();
      } else {
        handleSignInError(response);
      }
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleSignInSuccess = () => {
    setServerError("");
    navigate("/clubs");
  };

  const isAnyFormInputsEmpty = () => {
    if (input.email && input.password) return false;
    return true;
  };

  const isSignUpButtonDisabled = () => {
    if (isLoading) return true;
    if (isAnyFormInputsEmpty()) return true;
    return false;
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  return (
    <>
      <div className="h-screen bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">Sign In</h2>

          <div className="sm:bg-dark-400 px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            {isLoading ? (
              <div className="pb-10">
                <h1 className="text-gray-500 pt-5 pb-2 mx-auto max-w-4xl font-display text-xl  md:text-2xl font-medium tracking-tight  ">
                  Signing In
                </h1>
                <p>Please allow 30 seconds to Sign In.</p>
                <p>Server may be asleep.</p>
                <div className="pt-5 mx-auto max-w-4xl ">
                  <BarLoader
                    color={"#007acc"}
                    loading={isLoading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              </div>
            ) : (
              <form>
                <div>
                  <div className="pb-1 pl-1">
                    <label htmlFor="email" className="text-lg">
                      Email Address
                    </label>
                  </div>
                  <input
                    ref={emailInputRef}
                    name="email"
                    type="text"
                    onChange={onInputChange}
                    className={`bg-dark-200  text-gray-300  w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400`}
                    value={input.email}
                  />
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
                    className="bg-dark-200  text-gray-300  w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400"
                    value={input.password}
                  />
                </div>
                {serverError && <p className="text-pink-400 text-sm">{serverError}</p>}
                <button
                  disabled={isSignUpButtonDisabled()}
                  onClick={handleSignIn}
                  type={"submit"}
                  className="mt-4 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                  Sign in to account
                </button>
                <div className="flex w-full justify-center items-center pt-4">
                  <p className="text-gray-500 pr-2">Need an account?</p>
                  <button
                    type={"button"}
                    onClick={navigateToSignUp}
                    className="text-sm py-3 rounded-md text-gray-400 hover:text-gray-200">
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
