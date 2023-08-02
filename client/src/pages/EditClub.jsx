import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import H1 from "../components/HeadingOne";
import Button from "../components/Button";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import ServerSleep from "../components/SpinnerServerSleeping";
import InputError from "../components/InputError";
import FormCard from "../components/FormCard";
import FormContainer from "../components/FormContainer";

const EditClub = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);

  const params = useParams();
  const id = params.id;

  const clubInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState({ name: "", brand: "" });
  const [input, setInput] = useState({ name: "", brand: "" });

  const handleGetClubSuccess = async (response) => {
    const club = await response.json();
    setInput({ name: club.name, brand: club.brand });
    clubInputRef.current.focus();
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
    navigate("/clubs");
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
    if (error.name || error.brand) return true;
    if (!input.name && !input.brand) return true;
    return false;
  };

  // Go to club page
  const handleCancel = () => {
    navigate(`/clubs/${id}`);
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
    // <>
    //   <div className="min-h-max bg-dark-500 flex pt-10 sm:pt-10 justify-center text-gray-200">
    //     <div className="container max-w-[600px]">
    //       <h2 className="w-full text-center pb-4 text-lg md:text-2xl">Edit Club</h2>
    //       <div className="sm:bg-dark-400  px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
    //         {club && (
    //           <form>
    //             <div>
    //               <div className="pb-1 pl-1 flex items-center">
    //                 <label htmlFor="name" className="text-lg mr-1">
    //                   Club
    //                 </label>
    //               </div>
    //               <input
    //                 name="name"
    //                 type="text"
    //                 onBlur={validateInput}
    //                 onChange={onInputChange}
    //                 className={`${
    //                   error.name
    //                     ? `bg-dark-200 placeholder-opacity-30 placeholder-gray-600  w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
    //                     : `bg-dark-200  placeholder-opacity-30 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
    //                 }`}
    //                 value={input.name}
    //               />
    //             </div>
    //             <div className="flex items-center pt-1 pl-1">
    //               {error.name && <p className="h-full text-red-100 text-xs pr-1">{error.name}</p>}
    //             </div>
    //             <div className="pt-2">
    //               <div className="pb-1 pl-1 flex items-center">
    //                 <label htmlFor="brand" className="text-lg mr-1">
    //                   Brand
    //                 </label>
    //               </div>
    //               <input
    //                 name="brand"
    //                 type="brand"
    //                 onBlur={validateInput}
    //                 onChange={onInputChange}
    //                 placeholder="TaylorMade"
    //                 className={`${
    //                   error.brand
    //                     ? `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
    //                     : `bg-dark-200 placeholder-gray-600 placeholder-opacity-30 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
    //                 }`}
    //                 value={input.brand}
    //               />
    //             </div>
    //             <div className="flex items-center pt-1 pl-1">
    //               {error.brand && <p className="h-full text-red-100 text-xs pr-1">{error.brand}</p>}
    //             </div>
    //             <button
    //               type="submit"
    //               disabled={isUpdateClubButtonDisabled()}
    //               onClick={handleUpdateClub}
    //               className="mt-10 w-full text-gray-100 bg-blue-100 py-3 rounded-md hover:bg-blue-200">
    //               Update
    //             </button>
    //             <button
    //               onClick={handleNavToClub}
    //               className="mt-4 w-full btn bg-gray-200 text-dark-500 py-3 rounded-md hover:bg-gray-600">
    //               Cancel
    //             </button>
    //             {serverError && <p className="text-red-100 text-sm pt-1 pr-1">{serverError}</p>}
    //             <div className="flex w-full justify-center items-center pt-4"></div>
    //           </form>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <FormContainer>
        <H1>Update Club</H1>
        {isLoading ? (
          <ServerSleep isLoading={isLoading} text={"Signing Up"}>
            Please allow 30 seconds to Sign Up.
          </ServerSleep>
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
              onClick={handleUpdateClub}
              disabled={isUpdateClubButtonDisabled()}>
              Update Club
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

export default EditClub;
