import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";

const SignUp = () => {
  const navigate = useNavigate();
  const { authUser, actions } = useContext(UserContext);
  const emailInputRef = useRef(null);

  const [isLoading, setIsloading] = useState(false);
  const [serverError, setServerError] = useState([]);
  const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });
  const [input, setInput] = useState({ email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    if (authUser) navigate("/clubs");
  });

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    validateInput(e);
  };

  const createUser = async (e) => {
    const user = { email: input.email, password: input.confirmPassword };

    e.preventDefault();
    setIsloading(true);

    try {
      const response = await Fetch.create("/user", user, null);
      if (response.status === 201) handleUserCreated(user);
      else handleCreateUserError(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUserError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
    setIsloading(false);
  };

  const handleUserCreated = async (user) => {
    setServerError([]);
    await actions.signIn(user);
    setIsloading(false);
    navigate("/clubs");
  };

  const isAnyFormInputEmpty = () => {
    if (input.email && input.password && input.confirmPassword) return false;
    return true;
  };

  const isFormErrors = () => {
    if (error.email && error.password && error.confirmPassword) return true;
    return false;
  };

  const isSignUpButtonDisabled = () => {
    if (isLoading) return true;
    if (isFormErrors()) return true;
    if (isAnyFormInputEmpty()) return true;
    return false;
  };

  const navigateToSignIn = () => {
    navigate("/signin");
  };

  const validateInput = (e) => {
    let { name, value } = e.target;

    // Don't show errors if input is empty and blur effect triggered.
    if (name === "email" && value === "") return;
    if (name === "password" && value === "") return;
    if (name === "confirmPassword" && value === "") return;

    setError((prev) => {
      const error = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            error[name] = "Please enter Email Address.";
          }
          // eslint-disable-next-line
          if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            error[name] = "Please enter valid Email Address";
          }
          break;

        case "password":
          if (!value) {
            error[name] = "Please enter Password.";
          }
          if (value.length < 6 && value.length > 0) {
            error[name] = "Password must be at least 6 characters long.";
          }
          if (input.confirmPassword && value !== input.confirmPassword) {
            error["confirmPassword"] = "Password and Confirm Password do not match.";
          } else {
            error["confirmPassword"] = "";
          }
          break;

        case "confirmPassword":
          if (!value) {
            error[name] = "Please enter Confirm Password.";
          } else if (input.password && value !== input.password) {
            error[name] = "Password and Confirm Password do not match.";
          }
          break;

        default:
          break;
      }

      return error;
    });
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">Create Account</h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="email" className="text-lg mr-1">
                    Email Address
                  </label>
                  {error.email.length === 0 && input.email.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  ref={emailInputRef}
                  name="email"
                  type="text"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  className={`${
                    error.email
                      ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.email}
                />
              </div>
              <div className="flex items-center pt-1 pl-1">
                {error.email && <p className="h-full text-pink-400 text-xs pr-1">{error.email}</p>}
              </div>
              <div className="pt-5">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="password" className="text-lg mr-1">
                    Password
                  </label>
                  {error.password.length === 0 && input.password.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  name="password"
                  type="password"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  className={`${
                    error.password
                      ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.password}
                />
              </div>
              <div className="flex items-center pt-1 pl-1">
                {error.password && (
                  <p className="h-full text-pink-400 text-xs pr-1">{error.password}</p>
                )}
              </div>
              <div className="pt-5">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="confirmPassword" className="text-lg mr-1">
                    Confirm Password
                  </label>
                  {error.confirmPassword.length === 0 && input.confirmPassword.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  className={`${
                    error.confirmPassword
                      ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.confirmPassword}
                />
              </div>
              <div className="flex items-center pt-1 pl-1">
                {error.confirmPassword && (
                  <p className="h-full text-pink-400 text-xs pr-1">{error.confirmPassword}</p>
                )}
              </div>
              <button
                disabled={isSignUpButtonDisabled()}
                onClick={createUser}
                type={"submit"}
                className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Sign Up
              </button>
              {serverError && <p className="text-pink-400 text-sm pt-1 pr-1">{serverError}</p>}
              <div className="flex w-full justify-center items-center pt-4">
                <p className="text-gray-600 pr-2">Already have an account?</p>
                <button
                  onClick={navigateToSignIn}
                  type={"button"}
                  className="text-sm  py-3 rounded-md text-gray-400 hover:text-gray-200">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
