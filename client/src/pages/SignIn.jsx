import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import H1 from "../components/HeadingOne";
import AccountFooter from "../components/AccountFooter";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import ServerSleep from "../components/ServerSleep";

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
        handleSignInError(response, credentials);
      }
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInError = async (response, credentials) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleSignInSuccess = () => {
    setServerError("");
    navigate("/clubs");
    return;
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

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const formFields = [
    {
      name: "email",
      label: "Email Address",
      onChange: onInputChange,
      innerRef: emailInputRef,
      value: input.email,
      type: "email"
    },
    {
      name: "password",
      label: "Password",
      onChange: onInputChange,
      innerRef: null,
      value: input.password,
      type: "password"
    }
  ];

  return (
    <>
      <div className="px-3 mt-5 md:mt-10 w-full flex flex-col justify-center items-center ">
        <H1 className="mb-2 text-blue-300">Club Stats</H1>
        <div className="rounded-md max-w-[400px] sm:mt-5 sm:border-2 sm:border-dark-100  sm:max-w-none w-full sm:w-[450px] sm:px-7 sm:py-3">
          {isLoading ? (
            <ServerSleep isLoading={isLoading} text={"Signing In"}>
              Please allow 30 seconds to Sign In.
            </ServerSleep>
          ) : (
            <form>
              {formFields.map((item, index) => {
                return (
                  <div key={index} className="mt-2">
                    <InputLabel htmlFor={item.name} className="mb-1 ml-1">
                      {item.label}
                    </InputLabel>
                    <InputField
                      name={item.name}
                      type={item.type}
                      value={input[item.name]}
                      onChange={onInputChange}
                      innerRef={item.innerRef}></InputField>
                  </div>
                );
              })}
              {serverError && <ServerError>{serverError}</ServerError>}
              <Button
                styles="mt-7 w-full"
                color={"blue"}
                onClick={handleSignIn}
                disabled={isSignUpButtonDisabled()}>
                Sign in
              </Button>
              <AccountFooter text={"Need an account?"} to={"/signup"}>
                Sign Up
              </AccountFooter>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;
