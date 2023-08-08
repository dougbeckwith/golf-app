import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Fetch from "../helpers/fetch";
import UserContext from "../context/UserContext";
import H1 from "../components/HeadingOne";
import AccountFooter from "../components/FormFooter";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import ServerSleep from "../components/SpinnerServerSleeping";
import InputError from "../components/InputError";
import FormCard from "../components/FormCard";
import InputWrapper from "../components/InputWrapper";
import FormContainer from "../components/FormContainer";

const SignUp = () => {
  const navigate = useNavigate();
  const { authUser, actions } = useContext(UserContext);
  const emailInputRef = useRef(null);

  const [isLoading, setIsloading] = useState(false);
  const [serverError, setServerError] = useState("");
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
    setServerError("");
    setInput((prev) => ({ ...prev, [name]: value }));
    validateInput(e);
  };

  const createUser = async (e) => {
    const user = { email: input.email, password: input.confirmPassword };

    e.preventDefault();
    setIsloading(true);

    try {
      const response = await Fetch.create("/user", user, null);
      if (response.status === 201) {
        handleUserCreated(user);
      } else {
        handleCreateUserError(response);
      }
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUserError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleUserCreated = async (user) => {
    setServerError("");
    await actions.signIn(user);
    navigate("/clubs");
  };

  const isAnyFormInputEmpty = () => {
    if (!input.email || !input.password || !input.confirmPassword) return true;
    return false;
  };

  const isFormErrors = () => {
    if (error.email || error.password || error.confirmPassword) return true;
    return false;
  };

  const isSignUpButtonDisabled = () => {
    if (isLoading) return true;
    if (isFormErrors()) return true;
    if (isAnyFormInputEmpty()) return true;
    if (serverError) return true;
    return false;
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

  const isInputValid = (item) => {
    if (error[item.name].length === 0 && input[item.name].length !== 0 && !serverError) {
      return true;
    }
    return false;
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
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      onChange: onInputChange,
      innerRef: null,
      value: input.confirmPassword,
      type: "password"
    }
  ];
  return (
    <FormContainer>
      <H1>Club Stats</H1>
      {isLoading ? (
        <ServerSleep isLoading={isLoading} text={"Signing Up"}>
          Please allow 30 seconds to Sign Up.
        </ServerSleep>
      ) : (
        <FormCard>
          {formFields.map((item, index) => {
            return (
              <InputWrapper key={index}>
                <InputLabel htmlFor={item.name} className="mb-1 ml-1 mr-1 inline-block">
                  {item.label}
                </InputLabel>
                {isInputValid(item) && (
                  <IoCheckmarkCircleOutline className={"text-green-100 inline-block"} />
                )}
                <InputField
                  name={item.name}
                  type={item.type}
                  value={input[item.name]}
                  onChange={onInputChange}
                  innerRef={item.innerRef}>
                  {input[item.name]}
                </InputField>
                {error && input[item.name] !== "" && <InputError>{error[item.name]}</InputError>}
              </InputWrapper>
            );
          })}
          {serverError && <ServerError>{serverError}</ServerError>}
          {isSignUpButtonDisabled() ? (
            <Button
              color="blue"
              styles="mt-7 w-full cursor-default hover:bg-blue-300"
              onClick={createUser}
              disabled={true}>
              Sign Up
            </Button>
          ) : (
            <Button color="blue" styles="mt-7 w-full" onClick={createUser}>
              Sign Up
            </Button>
          )}

          <AccountFooter text={"Already have an account?"} to={"/signin"}>
            Sign In
          </AccountFooter>
        </FormCard>
      )}
    </FormContainer>
  );
};

export default SignUp;
