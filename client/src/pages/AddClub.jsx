import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Fetch from "../helpers/fetch";
import H1 from "../components/HeadingOne";
import AccountFooter from "../components/FormFooter";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import ServerSleep from "../components/SpinnerServerSleeping";
import InputError from "../components/InputError";

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

  const isInputValid = (item) => {
    if (error[item.name].length === 0 && input[item.name].length !== 0 && !serverError) {
      return true;
    }
    return false;
  };

  const isAddClubDisabled = () => {
    if (isLoading) return true;
    if (error.name || error.brand) return true;
    if (!input.name || !input.brand) return true;
    return false;
  };

  const navigateToClubs = () => {
    navigate("/clubs");
  };

  const formFields = [
    {
      name: "name",
      label: "Club",
      onChange: onInputChange,
      innerRef: clubInputRef,
      value: input.name,
      type: "text"
    },
    {
      name: "brand",
      label: "Brand",
      onChange: onInputChange,
      innerRef: null,
      value: input.brand,
      type: "text"
    }
  ];

  return (
    <>
      {/* <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-10 justify-center text-gray-200">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-gray-100 text-center pb-4 text-2xl md:text-4xl">Add Club</h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="name" className="text-lg mr-1">
                    Club
                  </label>
                  {error.name.length === 0 && input.name.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  name="name"
                  type="text"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  placeholder="7 Iron"
                  className={`${
                    error.name
                      ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600  w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
                      : `bg-dark-200  placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
                  }`}
                  value={input.name}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.name && <p className="h-full text-red-100 text-xs pr-1">{error.name}</p>}
              </div>

              <div className="pt-2">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="brand" className="text-lg mr-1">
                    Brand
                  </label>
                  {error.brand.length === 0 && input.brand.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  name="brand"
                  type="brand"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  placeholder="TaylorMade"
                  className={`${
                    error.brand
                      ? `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
                      : `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
                  }`}
                  value={input.brand}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.brand && <p className="h-full text-red-100 text-xs pr-1">{error.brand}</p>}
              </div>

              <button
                type="submit"
                disabled={isAddClubDisabled()}
                onClick={handleAddClub}
                className="mt-10 w-full text-gray-100 bg-blue-100 py-3 rounded-md hover:bg-blue-200">
                Add Club
              </button>
              <button
                onClick={navigateToClubs}
                className="mt-4 w-full btn bg-gray-200 text-dark-500 py-3 rounded-md hover:bg-gray-600">
                Cancel
              </button>

              {serverError && <p className="text-red-100 text-sm pt-1 pr-1">{error}</p>}

              <div className="flex w-full justify-center items-center pt-4"></div>
            </form>
          </div>
        </div>
      </div> */}
      <div className="px-3 mt-5 md:mt-10 w-full flex flex-col justify-center items-center ">
        <H1>Add Club</H1>
        <div className="rounded-md max-w-[400px] sm:mt-5 sm:border-2 sm:border-dark-100  sm:max-w-none w-full sm:w-[450px] sm:px-7 sm:py-3">
          {isLoading ? (
            <ServerSleep isLoading={isLoading} text={"Signing Up"}>
              Please allow 30 seconds to Sign Up.
            </ServerSleep>
          ) : (
            <form>
              {formFields.map((item, index) => {
                return (
                  <div key={index} className="mt-2">
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
                Sign Up
              </Button>
              <AccountFooter text={"Already have an account?"} to={"/signin"}>
                Sign In
              </AccountFooter>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AddClub;
