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

const AddClub = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);
  const clubInputRef = useRef(null);
  const [isLoading, setIsloading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState({ name: "", brand: "" });
  const [input, setInput] = useState({ name: "", brand: "", user: authUser._id });

  useEffect(() => {
    clubInputRef.current.focus();
  }, []);

  const handleAddClubError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleAddClubSuccess = () => {
    setInput({ name: "", brand: "" });
    setServerError("");
    navigate("/clubs");
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    try {
      const response = await Fetch.create("/clubs", input, encodedCredentials);

      if (response.status === 201) handleAddClubSuccess();
      else handleAddClubError(response);

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
        case "name":
          if (!value) {
            stateObj[name] = "Please enter a club.";
          }
          break;

        case "brand":
          if (!value) {
            stateObj[name] = "Please enter a brand.";
          }
          break;

        case "totalCarry":
          if (!value) {
            stateObj[name] = "Please enter a totalCarry.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number";
          }
          if (+value >= 500) {
            stateObj[name] = "Please enter a number less than 500 yards";
          }
          break;

        case "totalDistance":
          if (!value) {
            stateObj[name] = "Please enter a totalDistance.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number";
          }
          if (+value >= 500) {
            stateObj[name] = "Please enter a number less than 500 yards";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  // Might use this in the future for checking input errors
  // const isInputValid = (item) => {
  //   if (error[item.name].length === 0 && input[item.name].length !== 0 && !serverError) {
  //     return true;
  //   }
  //   return false;
  // };

  const isAddClubDisabled = () => {
    if (isLoading) return true;
    if (error.name || error.brand) return true;
    if (!input.name || !input.brand) return true;
    return false;
  };

  const handleCancel = () => {
    navigate("/clubs");
  };

  const formFields = [
    {
      name: "name",
      label: "Club",
      onChange: onInputChange,
      innerRef: clubInputRef,
      value: input.name,
      type: "text",
      placeHolder: "7 Iron"
    },
    {
      name: "brand",
      label: "Brand",
      onChange: onInputChange,
      innerRef: null,
      value: input.brand,
      type: "text",
      placeHolder: "TaylorMade"
    }
  ];

  return (
    <>
      <FormContainer>
        <H1>Add Club</H1>
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
              onClick={handleAddClub}
              disabled={isAddClubDisabled()}>
              Add Club
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

export default AddClub;
