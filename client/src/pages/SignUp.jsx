import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // State for errors array if any
  const [errors, setErrors] = useState([]);

  // State for email
  const [email, setEmail] = useState("");
  // State for email validation
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailInputBorderWarning, setEmailInputBorderWarning] = useState(false);

  // State for password
  const [password, setPassword] = useState("");
  // State for password validation
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordSixCharactersLong, setIsPasswordSixCharactersLong] =
    useState(false);
  const [passwordInputBorderWarning, setPasswordInputBorderWarning] =
    useState(false);

  // State for confirm password
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bothPasswords, setBothPasswords] = useState({});

  const [
    confirmIsPasswordMatchingPasswordInputBorderWarning,
    setConfirmIsPasswordMatchingPasswordInputBorderWarning
  ] = useState(false);

  const [isPasswordMatching, setIsPasswordMatching] = useState(false);

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false);

  // State for email input
  const emailInputRef = useRef(null);

  useEffect(() => {
    // On component load focus email input
    emailInputRef.current.focus();
  }, []);

  // useEffect(() => {
  //   console.log(" re render");
  // }, [password, confirmPassword]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
    setErrors([]);
  };

  const handleEmailBlur = (e) => {
    validateEmail(e.target.value);
  };

  const handlePasswordBlur = (e) => {
    validatePassword(e.target.value);
  };

  const handleConfirmPasswordBlur = (e) => {
    validateConfirmPassword(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
    setErrors([]);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validateConfirmPassword(e.target.value);
  };

  const validatePassword = async (password) => {
    console.log("password validate (password)", password);
    console.log("password validate (confirmPassword)", confirmPassword);

    if (password.length >= 6) {
      setIsPasswordSixCharactersLong(true);
      setPasswordInputBorderWarning(false);
      setIsPasswordValid(true);
    } else {
      setIsPasswordSixCharactersLong(false);
      setPasswordInputBorderWarning(true);
    }
    if (confirmPassword.length > 0) {
      console.log("in here confirm password:", confirmPassword);
      validateConfirmPassword(confirmPassword);
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    console.log("confirm password validate (password):", password);
    console.log("confirm password validate (confirmPassword)", confirmPassword);
    if (confirmPassword === password) {
      console.log("passwords match");
      setConfirmIsPasswordMatchingPasswordInputBorderWarning(false);
      setIsPasswordMatching(true);
    } else {
      console.log("passwords dont match");
      setConfirmIsPasswordMatchingPasswordInputBorderWarning(true);
      setIsPasswordMatching(false);
    }
  };

  const validateEmail = (email) => {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      console.log("validate email ");
      setIsEmailValid(true);
      setEmailInputBorderWarning(false);
    } else {
      setIsEmailValid(false);
      setEmailInputBorderWarning(true);
    }
  };

  const validateForm = () => {
    if (isPasswordMatching && isEmailValid && isPasswordValid) {
      return true;
    } else {
      return false;
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
    // validatePassword(password);
    // validateEmail(email);
    const isFormValid = validateForm();
    if (isFormValid) {
      // send form data
      console.log("sending create acccount form data");
      console.log("password", password);
      console.log("email", email);
    } else {
      updateErrors();
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
                <div className="pb-1 pl-1">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                </div>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="text"
                  onBlur={(e) => handleEmailBlur(e)}
                  onChange={(e) => handleEmailChange(e)}
                  className={
                    emailInputBorderWarning
                      ? "bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-pink-400"
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none ${
                          email.length === 0 || !isEmailValid
                            ? "border-dark-200 focus:border-blue-400"
                            : "border-pink-400 focus:border-pink-400"
                        } ${
                          isEmailValid &&
                          "border-green-500 focus:border-green-500"
                        } `
                  }
                  placeholder="Enter Email Address"
                  value={email}
                />
              </div>

              <div>
                <div className="flex items-center pt-1 pl-1">
                  {" "}
                  <p className="h-full text-gray-600 text-xs pr-1">
                    Enter a valid email
                  </p>
                  {isEmailValid && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
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
                  onBlur={(e) => handlePasswordBlur(e)}
                  onChange={(e) => handlePasswordChange(e)}
                  className={
                    passwordInputBorderWarning
                      ? "bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-pink-400 "
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2  border-dark-200 focus:outline-none ${
                          password.length === 0 || !isPasswordValid
                            ? "border-dark-200 focus:border-blue-400"
                            : "border-pink-400 focus:border-pink-400"
                        } ${
                          isPasswordValid &&
                          "border-green-500 focus:border-green-500"
                        } `
                  }
                  placeholder="Enter Password"
                  value={password}
                />
              </div>

              <div>
                <div className="flex items-center pt-1 pl-1">
                  {" "}
                  <p className="h-full text-gray-600 text-xs pr-1">
                    At least 6 characters long
                  </p>
                  {isPasswordSixCharactersLong && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
              </div>

              <div className="pt-5">
                <div className="pb-1 pl-1">
                  <label htmlFor="confirmPassword" className="text-lg">
                    Confirm Password
                  </label>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  onBlur={(e) => handleConfirmPasswordBlur(e)}
                  onChange={(e) => handleConfirmPasswordChange(e)}
                  className={
                    confirmIsPasswordMatchingPasswordInputBorderWarning
                      ? "bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-pink-400 "
                      : `bg-dark-200 placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2  border-dark-200 focus:outline-none ${
                          confirmPassword.length === 0 && !isPasswordMatching
                            ? "border-dark-200 focus:border-blue-400"
                            : "border-pink-400 focus:border-pink-400"
                        } ${
                          isPasswordMatching &&
                          isPasswordValid &&
                          confirmPassword.length !== 0
                            ? "border-green-500 focus:border-green-500"
                            : ""
                        } `
                  }
                  placeholder="Enter Confirm Password"
                  value={confirmPassword}
                />
              </div>

              <div>
                <div className="flex items-center pt-1 pl-1">
                  {" "}
                  <p className="h-full text-gray-600 text-xs pr-1">
                    Passswords must match
                  </p>
                  {isPasswordMatching && confirmPassword.length !== 0 ? (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={(e) => handleSubmit(e)}
                type={"submit"}
                className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
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
