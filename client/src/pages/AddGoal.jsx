import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import H1 from "../components/HeadingOne";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import InputError from "../components/InputError";
import FormCard from "../components/FormCard";
import FormContainer from "../components/FormContainer";
import Spinner from "../components/Spinner";

const AddGoal = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);
  const goalInputRef = useRef(null);
  const [isLoading, setIsloading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState({ puts: "", fairways: "", greens: "" });
  const [input, setInput] = useState({ puts: "", fairways: "", greens: "", user: authUser._id });

  useEffect(() => {
    goalInputRef.current.focus();
  }, []);

  const handleAddGoalError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleAddGoalSuccess = () => {
    setInput({ puts: "", fairways: "", greens: "" });
    setServerError("");
    navigate("/dashboard");
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    try {
      const response = await Fetch.create("/goals", input, encodedCredentials);

      if (response.status === 201) handleAddGoalSuccess();
      else handleAddGoalError(response);

      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;

    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "puts":
          if (!value) {
            stateObj[name] = "Please enter a goal for puts.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number";
          }
          if (+value >= 70) {
            stateObj[name] = "Please enter a number less than 500 yards";
          }
          break;

        case "fairways":
          if (!value) {
            stateObj[name] = "Please enter a goal for fairways.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number";
          }
          if (+value >= 100) {
            stateObj[name] = "Please enter a number less than 101";
          }
          break;

        case "greens":
          if (!value) {
            stateObj[name] = "Please enter a goal for greens.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number";
          }
          if (+value >= 100) {
            stateObj[name] = "Please enter a number less than 101";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const isAddGoalDisabled = () => {
    if (isLoading) return true;
    if (error.puts || error.greens || error.fairways) return true;
    if (!input.puts || !input.greens || !input.fairways) return true;
    return false;
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const formFields = [
    {
      name: "puts",
      label: "Puts Per Round",
      onChange: onInputChange,
      innerRef: goalInputRef,
      value: input.puts,
      type: "text",
      placeHolder: "33"
    },
    {
      name: "greens",
      label: "Greens",
      onChange: onInputChange,
      innerRef: null,
      value: input.greens,
      type: "text",
      placeHolder: "50"
    },
    {
      name: "fairways",
      label: "Fairways",
      onChange: onInputChange,
      innerRef: null,
      value: input.fairways,
      type: "text",
      placeHolder: "50"
    }
  ];

  return (
    <>
      <FormContainer>
        <H1>Add Goals</H1>
        {isLoading ? (
          <Spinner isLoading={isLoading} text={"Loading Data"} />
        ) : (
          <FormCard>
            {formFields.map((item, index) => {
              return (
                <div key={index} className="mt-2">
                  <InputLabel htmlFor={item.name} className="mb-1 ml-1 mr-1 inline-block">
                    {item.label}
                  </InputLabel>
                  <InputField
                    name={item.name}
                    type={item.type}
                    value={input[item.name]}
                    onChange={onInputChange}
                    placeHolder={item.placeHolder}
                    innerRef={item.innerRef}>
                    {input[item.name]}
                  </InputField>
                  {error && <InputError>{error[item.name]}</InputError>}
                </div>
              );
            })}
            {serverError && <ServerError>{serverError}</ServerError>}
            <Button
              color="blue"
              styles="mt-7 w-full"
              onClick={handleAddGoal}
              disabled={isAddGoalDisabled()}>
              Add Goals
            </Button>
            <Button color="gray" styles="mt-4 mb-2 w-full text-dark-200" onClick={handleCancel}>
              Cancel
            </Button>
          </FormCard>
        )}
      </FormContainer>
    </>
  );
};

export default AddGoal;
