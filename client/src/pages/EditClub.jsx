import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Alert from "../components/Alert";

const EditClub = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);

  const params = useParams();
  const id = params.id;

  const [club, setClub] = useState(null);

  // State for button disabled if making sign up request
  const [isLoading, setIsLoading] = useState(true);

  // State for response errors
  const [errors, setErrors] = useState([]);

  // State for input errors
  const [error, setError] = useState({
    club: "",
    brand: ""
  });

  // State for input
  const [input, setInput] = useState({
    club: "",
    brand: ""
  });

  // State for edit club alert after submit
  const [show, setShow] = useState(false);

  // State for alert message
  const [message, setMessage] = useState("");

  // State for nav to
  const [navTo, setNavTo] = useState("");

  //   // GET club and set club state
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const encodedCredentials = btoa(
          `${authUser.email}:${authUser.password}`
        );

        // fetch options
        const options = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        };

        // send request to get club
        const response = await fetch(
          `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
          options
        );

        if (response.status === 200) {
          const club = await response.json();
          setClub(club);

          setInput({
            club: club.club,
            brand: club.brand
          });

          setIsLoading(false);
        } else if (response.status === 401) {
          navigate("/signin");
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchClub();
    // eslint-disable-next-line
  }, []);

  // update club in database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    // fetch options
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`
      },
      body: JSON.stringify({
        updateName: {
          club: input.club,
          brand: input.brand
        },

        user: authUser._id
      })
    };

    try {
      // send request to update club
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
        options
      );

      // if club updated display alert message to user
      // on alert close nav to /clubs
      if (response.status === 200) {
        setErrors([]);
        setInput({
          club: "",
          brand: "",
          totalDistance: "",
          totalCarry: ""
        });
        setMessage("Success! Club Updated");
        setNavTo("/clubs");
        setShow(true);
      }
      // if not success lets just display a alert message to user
      // with error message description
      else if (response.status === 400) {
        setMessage("Bad Reqeust");
      } else if (response.status === 401) {
        setMessage("Unauthorized");
      } else if (response.status === 403) {
        setMessage("Forbidden");
      } else if (response.status === 404) {
        setMessage("Club Not Found");
      } else if (response.status === 500) {
        setMessage("Server Error");
      }
      setIsLoading(false);
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

        default:
          break;
      }

      return stateObj;
    });
  };

  const isEditClubDisabled = () => {
    if (isLoading === true) {
      return true;
    }
    if (!error.club && !error.brand && input.club && input.brand) {
      return false;
    }
    return true;
  };

  // Go to club page
  const navigateBack = () => {
    navigate(`/clubs/${id}`);
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-10 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">
            Edit Club
          </h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            {club && (
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

                <button
                  type="submit"
                  disabled={isEditClubDisabled()}
                  onClick={handleSubmit}
                  className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                  Update
                </button>
                <button
                  onClick={navigateBack}
                  className="mt-4 w-full btn bg-gray-500 text-dark-500 py-3 rounded-md hover:bg-gray-600">
                  Cancel
                </button>

                {errors.length > 0 &&
                  errors.map((error, index) => {
                    return (
                      <p
                        key={index}
                        className="text-pink-400 text-sm pt-1 pr-1">
                        {error}
                      </p>
                    );
                  })}
                <div className="flex w-full justify-center items-center pt-4"></div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Alert show={show} setShow={setShow} message={message} navTo={navTo} />
    </>
  );
};

export default EditClub;
