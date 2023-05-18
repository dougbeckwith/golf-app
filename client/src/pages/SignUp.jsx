import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const SignUp = () => {
  const navigate = useNavigate();
  // User Context
  const userContext = useContext(UserContext);

  // State for response errors
  const [errors, setErrors] = useState([]);

  // State for errors
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // State for input
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false);

  // State for email input
  const emailInputRef = useRef(null);

  useEffect(() => {
    // On component load focus email input
    emailInputRef.current.focus();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter Email Address.";
          }
          if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            stateObj[name] = "Please enter valid Email Address";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          }
          if (value.length < 6 && value.length > 0) {
            stateObj[name] = "Password must be at least 6 characters long.";
          }
          if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password does not match.";
          } else {
            stateObj["confirmPassword"] = "";
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const isSignUpButtonDisabled = () => {
    if (
      !error.email &&
      !error.password &&
      !error.confirmPassword &&
      input.email &&
      input.password &&
      input.confirmPassword
    ) {
      return false;
    } else {
      return true;
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user credentials
    const credentials = {
      email: input.email,
      password: input.confirmPassword
    };

    // fetch options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: input.email,
        password: input.confirmPassword
      })
    };
    try {
      const response = await fetch(`http://localhost:5000/user`, options);
      console.log(response);
      if (response.status === 201) {
        await userContext.actions.signIn(credentials);
        // navigate to clubs eventually
      }
      if (response.status === 400) {
        const { error } = await response.json();
        setErrors(error);
      }
    } catch (error) {
      console.log(error);
    }

    setIsloading(false);
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">
            Create Account
          </h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="email" className="text-lg mr-1">
                    Email
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
                      ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  placeholder="Enter Email Address"
                  value={input.email}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.email && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.email}
                  </p>
                )}
              </div>

              <div className="pt-5">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="password" className="text-lg mr-1">
                    Password
                  </label>
                  {error.password.length === 0 &&
                    input.password.length !== 0 && (
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
                      ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  placeholder="Enter Password"
                  value={input.password}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.password && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.password}
                  </p>
                )}
              </div>

              <div className="pt-5">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="confirmPassword" className="text-lg mr-1">
                    Confirm Password
                  </label>
                  {error.confirmPassword.length === 0 &&
                    input.confirmPassword.length !== 0 && (
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
                      ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  placeholder="Enter Confirm Password"
                  value={input.confirmPassword}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.confirmPassword && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              <button
                disabled={isSignUpButtonDisabled()}
                onClick={handleSubmit}
                type={"submit"}
                className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Sign Up
              </button>
              {errors.length > 0 &&
                errors.map((error, index) => {
                  return (
                    <p key={index} className="text-pink-400 text-sm pt-1 pr-1">
                      {error}
                    </p>
                  );
                })}
              <div className="flex w-full justify-center items-center pt-4">
                <p className="text-gray-600 pr-2">Already have an account?</p>
                <Link to={"/login"}>
                  <button
                    disabled={isLoading}
                    onClick={navigateToLogin}
                    type={"button"}
                    className="text-sm  py-3 rounded-md text-gray-400 hover:text-gray-200">
                    Login
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
