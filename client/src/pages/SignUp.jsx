import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // State for errors array if any
  const [errors, setErrors] = useState([]);

  // State for email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for password validation
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordLongEnough, setIsPassLongEnough] = useState(false);
  const [
    passwordHasOneUpperCaseOneLowerCase,
    setPasswordHasOneUpperCaseOneLowerCase
  ] = useState(false);
  const [passwordHasOneSpecialCharacter, setPasswordHasOneSpecialCharacter] =
    useState(false);
  const [passwordInputBorderWarning, setPasswordInputBorderWarning] =
    useState(false);

  // State for email validation
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailInputBorderWarning, setEmailInputBorderWarning] = useState(false);

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false);

  // State for email input
  const emailInputRef = useRef(null);

  useEffect(() => {
    // On component load focus email input
    emailInputRef.current.focus();
  }, []);

  const handleEmailChange = (e) => {
    console.log("handle email change");
    setEmail(e.target.value);
    validateEmail(e.target.value);
    setErrors([]);
  };

  const handlePasswordChange = (e) => {
    console.log("handle password change");
    setPassword(e.target.value);
    validatePassword(e.target.value);
    setErrors([]);
  };

  const validatePassword = (password) => {
    console.log("validate");
    if (password.length >= 6) {
      setIsPassLongEnough(true);
    } else {
      setIsPassLongEnough(false);
    }
    if (/^(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordHasOneUpperCaseOneLowerCase(true);
    } else {
      setPasswordHasOneUpperCaseOneLowerCase(false);
    }
    if (/^(?=.*[-+_!@#$%^&*., ?])/.test(password)) {
      setPasswordHasOneSpecialCharacter(true);
    } else {
      setPasswordHasOneSpecialCharacter(false);
    }
    if (
      password.length >= 6 &&
      /^(?=.*[a-z])(?=.*[A-Z])/.test(password) &&
      /^(?=.*[-+_!@#$%^&*., ?])/.test(password)
    ) {
      setIsPasswordValid(true);
      setPasswordInputBorderWarning(false);
    } else {
      setPasswordInputBorderWarning(true);
      setIsPasswordValid(false);
    }
  };

  const validateEmail = (email) => {
    console.log("validate email");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setIsEmailValid(true);
      setEmailInputBorderWarning(false);
    } else {
      setIsEmailValid(false);
      setEmailInputBorderWarning(true);
    }
  };

  const updateErrors = () => {
    if (!isEmailValid && !isPasswordValid) {
      setErrors([
        "Please enter a valid email address",
        "Please enter a valid password"
      ]);
    }
    if (!isEmailValid && isPasswordValid) {
      setErrors(["Please enter a valid email address"]);
    }
    if (isEmailValid && !isPasswordValid) {
      setErrors(["Please enter a valid password"]);
    }
    if (isEmailValid && isPasswordValid) {
      setErrors([]);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validatePassword(password);
    validateEmail(email);
    updateErrors();
    setIsloading(false);
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-400">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">
            Create Account
          </h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1">
                  <label htmlFor="email" className="text-lg text-gray-400">
                    Email
                  </label>
                </div>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="text"
                  onChange={handleEmailChange}
                  className={
                    emailInputBorderWarning
                      ? "bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400 ring-pink-400"
                      : "bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400 ring-blue-400"
                  }
                  placeholder="John@gmail.com"
                  value={email}
                />
              </div>
              <div>
                <div className="flex items-center pt-1 pl-1">
                  {" "}
                  <p className="h-full text-gray-500 text-xs pr-1">
                    Valid email address
                  </p>
                  {isEmailValid && <IoCheckmarkCircleOutline color={"green"} />}
                </div>
              </div>

              <div className="pt-5">
                <div className="pb-1 pl-1">
                  <label htmlFor="password" className="text-lg">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  onChange={handlePasswordChange}
                  className={
                    passwordInputBorderWarning
                      ? "bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400 ring-pink-400"
                      : "bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400 ring-blue-400"
                  }
                  placeholder="Password"
                  value={password}
                />
              </div>

              <div>
                <div className="flex items-center pt-1 pl-1">
                  {" "}
                  <p className="h-full text-gray-500 text-xs pr-1">
                    At least 6 characters long
                  </p>
                  {isPasswordLongEnough && (
                    <IoCheckmarkCircleOutline color={"green"} />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center pl-1">
                  {" "}
                  <p className="h-full text-gray-500 text-xs pr-1">
                    At least 1 uppercase and 1 lowercase character
                  </p>
                  {passwordHasOneUpperCaseOneLowerCase && (
                    <IoCheckmarkCircleOutline color={"green"} />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center pl-1">
                  {" "}
                  <p className="h-full text-gray-500 text-xs pr-1">
                    At least 1 special character !*%^
                  </p>
                  {passwordHasOneSpecialCharacter && (
                    <IoCheckmarkCircleOutline color={"green"} />
                  )}
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={handleSubmit}
                type={"submit"}
                className="mt-10 w-full bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Sign Up
              </button>

              {errors.length > 0 &&
                errors.map((error, index) => {
                  return (
                    <p key={index} className="text-pink-400 text-sm">
                      {error}
                    </p>
                  );
                })}

              <div className="flex w-full justify-center items-center pt-4">
                <p className="text-gray-500 pr-2">Already have an account?</p>
                <Link to={"/login"}>
                  <button
                    disabled={isLoading}
                    onClick={navigateToLogin}
                    type={"button"}
                    className="text-sm py-3 rounded-md text-gray-400 hover:text-gray-200">
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
