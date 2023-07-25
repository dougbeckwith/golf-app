import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import Alert from "../components/Alert";

const EditClub = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);

  const params = useParams();
  const id = params.id;

  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState({ name: "", brand: "" });
  const [input, setInput] = useState({ name: "", brand: "" });

  // State for edit club alert message
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [navTo, setNavTo] = useState("");

  const handleGetClubSuccess = async (response) => {
    const club = await response.json();
    setClub(club);
    setInput({ name: club.name, brand: club.brand });
  };

  const handleGetClubError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 403) {
      navigate("/forbidden");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  useEffect(() => {
    const getClub = async () => {
      setIsLoading(true);
      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get(`/clubs/${id}`, null, encodedCredentials);

        if (response.status === 200) {
          handleGetClubSuccess(response);
        } else {
          handleGetClubError(response);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getClub();
    // eslint-disable-next-line
  }, []);

  const handleUpdateClubSuccess = () => {
    setMessage("Success! Club Updated");
    setNavTo("/clubs");
    setShow(true);
  };

  const handleUpdateClubError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const updatedClub = { name: input.name, brand: input.brand, user: authUser._id };

    try {
      const response = await Fetch.update(`/clubs/${id}`, updatedClub, encodedCredentials);
      console.log(response);

      if (response.status === 200) {
        handleUpdateClubSuccess();
      } else {
        handleUpdateClubError(response);
      }
      setIsLoading(false);
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

        default:
          break;
      }

      return stateObj;
    });
  };

  const isUpdateClubButtonDisabled = () => {
    if (isLoading) return true;
    if (error.name || !error.brand) return true;
    if (!input.name && !input.brand) return true;
    return false;
  };

  // Go to club page
  const handleNavToClub = () => {
    navigate(`/clubs/${id}`);
  };

  return (
    <>
      <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-10 justify-center text-gray-500">
        <div className="container max-w-[600px]">
          <h2 className="w-full text-center pb-4 text-lg md:text-2xl">Edit Club</h2>
          <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            {club && (
              <form>
                <div>
                  <div className="pb-1 pl-1 flex items-center">
                    <label htmlFor="name" className="text-lg mr-1">
                      Club
                    </label>
                  </div>
                  <input
                    name="name"
                    type="text"
                    onBlur={validateInput}
                    onChange={onInputChange}
                    className={`${
                      error.name
                        ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600  w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                        : `bg-dark-200  placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                    }`}
                    value={input.name}
                  />
                </div>
                <div className="flex items-center pt-1 pl-1">
                  {error.name && <p className="h-full text-pink-400 text-xs pr-1">{error.name}</p>}
                </div>
                <div className="pt-2">
                  <div className="pb-1 pl-1 flex items-center">
                    <label htmlFor="brand" className="text-lg mr-1">
                      Brand
                    </label>
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
                    <p className="h-full text-pink-400 text-xs pr-1">{error.brand}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isUpdateClubButtonDisabled()}
                  onClick={handleUpdateClub}
                  className="mt-10 w-full text-gray-400 bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                  Update
                </button>
                <button
                  onClick={handleNavToClub}
                  className="mt-4 w-full btn bg-gray-500 text-dark-500 py-3 rounded-md hover:bg-gray-600">
                  Cancel
                </button>
                {serverError && <p className="text-pink-400 text-sm pt-1 pr-1">{serverError}</p>}
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
