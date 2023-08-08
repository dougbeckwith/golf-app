import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import H1 from "../components/HeadingOne";
import FormFooter from "../components/FormFooter";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import SpinnerServerSleeping from "../components/SpinnerServerSleeping";
import FormCard from "../components/FormCard";
import InputWrapper from "../components/InputWrapper";
import FormContainer from "../components/FormContainer";

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
    <FormContainer>
      <H1>Club Stats</H1>
      <FormCard>
        {isLoading ? (
          <SpinnerServerSleeping isLoading={isLoading} text={"Signing In"}>
            Please allow 30 seconds to Sign In.
          </SpinnerServerSleeping>
        ) : (
          <>
            {formFields.map((item, index) => {
              return (
                <InputWrapper key={index}>
                  <InputLabel htmlFor={item.name} className="mb-1 ml-1">
                    {item.label}
                  </InputLabel>
                  <InputField
                    name={item.name}
                    type={item.type}
                    value={input[item.name]}
                    onChange={onInputChange}
                    innerRef={item.innerRef}></InputField>
                </InputWrapper>
              );
            })}
            {serverError && <ServerError>{serverError}</ServerError>}
            {isSignUpButtonDisabled() ? (
              <Button
                styles="mt-7 w-full cursor-default hover:bg-blue-300"
                color={"blue"}
                onClick={handleSignIn}
                disabled={true}>
                Sign in
              </Button>
            ) : (
              <Button styles="mt-7 w-full" color={"blue"} onClick={handleSignIn}>
                Sign in
              </Button>
            )}

            <FormFooter text={"Need an account?"} to={"/signup"}>
              Sign Up
            </FormFooter>
          </>
        )}
      </FormCard>
    </FormContainer>
  );
};

export default SignIn;
