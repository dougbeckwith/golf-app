import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getAverageDistance } from "../helpers";
import List from "../components/List";
import ShotItem from "../components/ShotItem";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import H2 from "../components/HeadingTwo";
import Loader from "../components/Spinner";
import Main from "../components/Main";
import Container from "../components/Container";
import H1 from "../components/HeadingOne";
import Button from "../components/Button";
import Header from "../components/Header";
import ButtonSmall from "../components/ButtonSmall";
import Spinner from "../components/Spinner";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import InputError from "../components/InputError";
import InputWrapper from "../components/InputWrapper";
import FormCard from "../components/FormCard";
import StatsList from "../components/StatsList";

const Club = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const { authUser } = useContext(UserContext);
  const [club, setClub] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [encodedCredentials, setEncodedCredentials] = useState("");
  const [error, setError] = useState({ totalCarry: "", totalDistance: "" });
  const [shot, setShot] = useState({ totalCarry: "", totalDistance: "" });
  const [clubStats, setClubStats] = useState([{}]);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setEncodedCredentials(btoa(`${authUser.email}:${authUser.password}`));
  }, [authUser.email, authUser.password]);

  const handleError = async (response) => {
    const { err } = await response.json();
    alert(err.message);
  };

  const handleAddShotError = async (response) => {
    const { err } = await response.json();
    setServerError(err);
  };

  const handleGetClubSuccess = async (response) => {
    const club = await response.json();
    setClub(club);
    updateClubStats(club);
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
      try {
        setIsLoading(true);
        const credentialsEncoded = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get(`/clubs/${id}`, null, credentialsEncoded);

        if (response.status === 200) {
          await handleGetClubSuccess(response);
        } else {
          handleGetClubError(response);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/error");
      }
    };

    getClub();
    // eslint-disable-next-line
  }, []);

  const updateClubStats = (club) => {
    const avgCarry = getAverageDistance(club, "totalCarry");
    const avgDist = getAverageDistance(club, "totalDistance");
    setClubStats([
      { label: "Avg Total Distance", stat: avgDist },
      { label: "Avg Carry Distance", stat: avgCarry },
      { label: "Total Shots", stat: club.shots.length }
    ]);
  };

  const handleAddShotSuccess = async (response) => {
    const { shotId } = await response.json();
    setShot({ totalCarry: "", totalDistance: "" });
    setClub((prevClub) => {
      const club = { ...prevClub, shots: [...prevClub.shots, { ...shot, _id: shotId }] };
      updateClubStats(club);
      return club;
    });
  };

  const handleAddShot = async (e) => {
    e.preventDefault();
    const isDisabled = isAddShotDisabled();
    if (isDisabled) return;
    try {
      const response = await Fetch.create(`/clubs/${id}/shots`, { ...shot }, encodedCredentials);
      if (response.status === 201) handleAddShotSuccess(response);
      else handleAddShotError(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteSuccess = () => {
    navigate("/clubs");
  };

  const handleDeleteClub = async () => {
    try {
      const response = await Fetch.remove(`/clubs/${id}`, null, encodedCredentials);
      if (response.status === 204) handleDeleteSuccess(response);
      else handleError(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setShot((prev) => ({ ...prev, [name]: value }));

    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    console.log(name, value);

    if (value === "" && name === "totalDistance") {
      setError((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    if (value === "" && name === "totalCarry") {
      setError((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
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

  const isAddShotDisabled = () => {
    if (isLoading) return true;
    if (error.totalDistance || error.totalCarry) return true;
    if (!shot.totalCarry && !shot.totalDistance) {
      setError((prevError) => {
        let error = { ...prevError };
        error.totalDistance = "Please enter a total distance";
        error.totalCarry = "Please enter a total carry distance";
        return error;
      });
      return true;
    }
    if (!shot.totalDistance) {
      setError((prevError) => {
        let error = { ...prevError };
        error.totalDistance = "Please enter a total distance";
        return error;
      });
      return true;
    }
    if (!shot.totalCarry) {
      setError((prevError) => {
        let error = { ...prevError };
        error.totalCarry = "Please enter a total carry distance";
        return error;
      });
      return true;
    }
    return false;
  };

  const formFields = [
    {
      name: "totalDistance",
      label: "Total Distance ( Yards )",
      onChange: onInputChange,
      innerRef: null,
      value: shot.totalDistance,
      type: "text"
    },
    {
      name: "totalCarry",
      label: "Total Carry Distance ( Yards )",
      onChange: onInputChange,
      innerRef: null,
      value: shot.totalCarry,
      type: "text"
    }
  ];
  return (
    <>
      <Main>
        <Container>
          {isLoading ? (
            <Loader isLoading={isLoading} text={"Loading Club"} />
          ) : (
            <>
              <Header>
                <H1 className={"mr-2"}>
                  {club.name} {"-"} {club.brand}
                </H1>
                <div className="sm:ml-auto flex gap-2 mt-2 sm:mt-0">
                  <Link to={`/clubs/${id}/edit`}>
                    <ButtonSmall color={"blue"}>Edit Club</ButtonSmall>
                  </Link>
                  <ButtonSmall color={"red"} onClick={handleDeleteClub} styles={"inline"}>
                    Delete Club
                  </ButtonSmall>
                </div>
              </Header>
              {isLoading && <Spinner isLoading={isLoading} text={"Loading Data"} />}

              {!isLoading && (
                <>
                  <H2>Stats</H2>
                  <StatsList stats={clubStats} />
                  <H2 styles={"mt-10"}>Add Shots</H2>
                  <FormCard>
                    {formFields.map((item, index) => {
                      return (
                        <InputWrapper key={index}>
                          <InputLabel htmlFor={item.name} className="mb-1 ml-1 mr-1 inline-block">
                            {item.label}
                          </InputLabel>
                          <InputField
                            name={item.name}
                            type={item.type}
                            value={shot[item.name]}
                            onChange={onInputChange}>
                            {shot[item.name]}
                          </InputField>
                          {error || shot[item.name] !== "" ? (
                            <InputError>{error[item.name]}</InputError>
                          ) : (
                            <></>
                          )}
                        </InputWrapper>
                      );
                    })}
                    {serverError && <ServerError>{serverError}</ServerError>}
                    <Button color="teal" styles="mt-7 mb-3 w-full" onClick={handleAddShot}>
                      Add Shot
                    </Button>
                  </FormCard>
                  <H2 styles={"mt-10"}>Shots</H2>
                  <List>
                    {club.shots.map((shot) => {
                      return (
                        <ShotItem
                          key={uuidv4()}
                          setClub={setClub}
                          shot={shot}
                          club={club}
                          updateClubStats={updateClubStats}
                        />
                      );
                    })}
                  </List>
                </>
              )}
            </>
          )}
        </Container>
      </Main>
    </>
  );
};

export default Club;
