import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import Alert from "../components/Alert";

const AddClub = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false);

  // State for response errors
  const [errors, setErrors] = useState([]);

  // State for input errors
  const [error, setError] = useState({
    club: "",
    brand: "",
    totalDistance: "",
    totalCarry: ""
  });

  // State for input
  const [input, setInput] = useState({
    club: "",
    brand: "",
    totalDistance: "",
    totalCarry: ""
  });

  // State for add club alert after submit
  const [show, setShow] = useState(false);

  // State for alert message
  const [message, setMessage] = useState("");

  // State for nav to
  const [navTo, setNavTo] = useState("");

  // Add club to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    // fetch options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`
      },
      body: JSON.stringify({
        club: input.club,
        brand: input.brand,
        totalDistance: input.totalDistance,
        totalCarry: input.totalCarry,
        shotId: uuidv4(),
        user: authUser._id
      })
    };

    // send request to create club
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs`,
        options
      );

      // if club created display message to user
      if (response.status === 201) {
        setInput({
          club: "",
          brand: "",
          totalDistance: "",
          totalCarry: ""
        });
        setMessage("Success! Club Created");
        setNavTo("/clubs");
        setShow(true);
        setErrors([]);
      }

      // if not success use error object to dispay message to user
      else if (response.status === 400) {
        setMessage("Bad Reqeust");
        setShow(true);
      } else if (response.status === 401) {
        setMessage("Unauthorized");
        setShow(true);
      } else if (response.status === 403) {
        setMessage("Forbidden");
        setShow(true);
      } else if (response.status === 404) {
        setMessage("Club Not Found");
        setShow(true);
      } else if (response.status === 500) {
        setMessage("Server Error");
        setShow(true);
      }
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
        case "club":
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

  const isAddClubDisabled = () => {
    if (isLoading === true) {
      return true;
    }
    if (
      !error.club &&
      !error.brand &&
      input.club &&
      input.brand &&
      input.totalCarry &&
      input.totalDistance
    ) {
      return false;
    }
    return true;
  };

  // Go to club page
  const navigateToClubs = () => {
    navigate("/clubs");
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-10 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-gray-400 text-center pb-4 text-2xl md:text-4xl">
            Add Club
          </h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="club" className="text-lg mr-1">
                    Club
                  </label>
                  {error.club.length === 0 && input.club.length !== 0 && (
                    <IoCheckmarkCircleOutline className={"text-green-500"} />
                  )}
                </div>
                <input
                  name="club"
                  type="text"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  placeholder="7 Iron"
                  className={`${
                    error.club
                      ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600  w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200  placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.club}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.club && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.club}
                  </p>
                )}
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
                      ? `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.brand}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.brand && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.brand}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="totalCarry" className="text-lg mr-1">
                    Total Carry (Yards)
                  </label>
                  {error.totalCarry.length === 0 &&
                    input.totalCarry.length !== 0 && (
                      <IoCheckmarkCircleOutline className={"text-green-500"} />
                    )}
                </div>
                <input
                  name="totalCarry"
                  type="totalCarry"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  placeholder="150"
                  className={`${
                    error.totalCarry
                      ? `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.totalCarry}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.totalCarry && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.totalCarry}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <div className="pb-1 pl-1 flex items-center">
                  <label htmlFor="totalDistance" className="text-lg mr-1">
                    Total Distance (Yards)
                  </label>
                  {error.totalDistance.length === 0 &&
                    input.totalDistance.length !== 0 && (
                      <IoCheckmarkCircleOutline className={"text-green-500"} />
                    )}
                </div>
                <input
                  name="totalDistance"
                  type="totalDistance"
                  onBlur={validateInput}
                  onChange={onInputChange}
                  placeholder="165"
                  className={`${
                    error.totalDistance
                      ? `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                      : `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                  }`}
                  value={input.totalDistance}
                />
              </div>

              <div className="flex items-center pt-1 pl-1">
                {error.totalDistance && (
                  <p className="h-full text-pink-400 text-xs pr-1">
                    {error.totalDistance}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isAddClubDisabled()}
                onClick={handleSubmit}
                className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Add Club
              </button>
              <button
                onClick={navigateToClubs}
                className="mt-4 w-full btn bg-gray-500 text-dark-500 py-3 rounded-md hover:bg-gray-600">
                Cancel
              </button>

              {errors.length > 0 &&
                errors.map((error, index) => {
                  return (
                    <p key={index} className="text-pink-400 text-sm pt-1 pr-1">
                      {error}
                    </p>
                  );
                })}
              <div className="flex w-full justify-center items-center pt-4"></div>
            </form>
          </div>
        </div>
      </div>
      <Alert show={show} setShow={setShow} message={message} navTo={navTo} />
    </>
  );
};

export default AddClub;
