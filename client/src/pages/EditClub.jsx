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
import InputError from "../components/InputError";
import FormCard from "../components/FormCard";
import FormContainer from "../components/FormContainer";
import Spinner from "../components/Spinner";

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
    if (!input.name || !input.brand) return true;
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
    <>
      <FormContainer>
        <H1>Update Club</H1>
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
