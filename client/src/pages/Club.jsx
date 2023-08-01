import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiGolfTee } from "react-icons/gi";
import { getAverageDistance } from "../helpers";
import ShotList from "../components/ShotList";
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
import Card from "../components/Card";
import ButtonSmall from "../components/ButtonSmall";
import StatsSection from "../components/StatsSection";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import InputError from "../components/InputError";
import InputWrapper from "../components/InputWrapper";

const Club = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const { authUser } = useContext(UserContext);
  const [club, setClub] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [avgTotalCarry, setAvgCarryDistance] = useState("");
  const [avgTotalDistance, setAvgTotalDistance] = useState("");
  const [encodedCredentials, setEncodedCredentials] = useState("");
  const [error, setError] = useState({ totalCarry: "", totalDistance: "" });
  const [shot, setShot] = useState({ totalCarry: "", totalDistance: "" });
  const [clubStats, setClubStats] = useState([{}]);

  useEffect(() => {
    setEncodedCredentials(btoa(`${authUser.email}:${authUser.password}`));
  }, [authUser.email, authUser.password]);

  const handleError = async (response) => {
    const { err } = await response.json();
    alert(err.message);
  };

  const handleGetClubSuccess = async (response) => {
    const club = await response.json();
    setClub(club);
    updateClubStats(club);
    setIsLoading(false);
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
        const credentialsEncoded = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get(`/clubs/${id}`, null, credentialsEncoded);

        if (response.status === 200) handleGetClubSuccess(response);
        else handleGetClubError(response);
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
    setAvgCarryDistance(avgCarry);
    setAvgTotalDistance(avgDist);
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
    try {
      const response = await Fetch.create(`/clubs/${id}/shots`, { ...shot }, encodedCredentials);
      if (response.status === 201) handleAddShotSuccess(response);
      else handleError(response);
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
    if (!shot.totalDistance && !shot.totalCarry) return true;
    return false;
  };

  // const formFields = [
  //   {
  //     name: "shot",
  //     label: "Shot",
  //     onChange: onInputChange,
  //     innerRef: null,
  //     value: input.shot,
  //     type: "text"
  //   }
  // ];

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
              <H2>Stats</H2>
              <ul className="flex gap-2 flex-wrap mt-2 mb-6">
                {clubStats.map((stat, index) => {
                  console.log(stat);
                  return (
                    <StatCard
                      key={index}
                      iconColor="#d1d5db"
                      title={stat.label}
                      value={stat.stat}
                    />
                  );
                })}
              </ul>
              <Header>
                <H2 styles={"mt-10"}>Shots</H2>
                <ButtonSmall styles={"ml-10"} color={"teal"}>
                  Add Shot
                </ButtonSmall>
              </Header>

              {isLoading && <Spinner isLoading={isLoading} text={"Loading Clubs"} />}
              {!isLoading && (
                <>
                  <Card>
                    <form>
                      <InputWrapper>
                        <InputLabel htmlFor={"shot"} className="mb-1 ml-1 mr-1 inline-block">
                          Shot
                        </InputLabel>

                        <InputField
                          name="shot"
                          type="text"
                          value={input.shot}
                          onChange={onInputChange}>
                          {shot.shot}
                        </InputField>
                        {error.shot && <InputError>{error.shot}</InputError>}
                      </InputWrapper>

                      {serverError && <ServerError>{serverError}</ServerError>}
                      <Button
                        color="teal"
                        styles="mt-7 w-full"
                        onClick={handleAddShot}
                        disabled={isAddShotDisabled()}>
                        Add Shot
                      </Button>
                      {/* <div className="pb-1 pl-1 flex items-center">
                    <label htmlFor="totalCarry" className="text-lg mr-1">
                      Total Carry{" "}
                      <span className="text-xs">
                        (<span className="ml-[2px] mr-[2px]">yards</span>)
                      </span>
                    </label>
                  </div>
                  <input
                    name="totalCarry"
                    value={shot.totalCarry}
                    onChange={onInputChange}
                    className={`${
                      error.totalCarry
                        ? `bg-dark-200   w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
                        : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
                    }`}
                  />
                  <div className="flex items-center pt-1 pl-1">
                    {error.totalCarry && (
                      <p className="h-full text-red-100 text-xs pr-1">{error.totalCarry}</p>
                    )}
                  </div>
                  <div className="pb-1 pl-1 flex items-center">
                    <label htmlFor="totalDistance" className="text-lg mr-1">
                      Total Distance{" "}
                      <span className="text-xs">
                        (<span className="ml-[2px] mr-[2px]">yards</span>)
                      </span>
                    </label>
                  </div>
                  <input
                    name="totalDistance"
                    value={shot.totalDistance}
                    onChange={onInputChange}
                    className={`${
                      error.totalDistance
                        ? `bg-dark-200   w-full p-3 rounded-md border-2 border-red-100 focus:outline-none focus:border-blue-100`
                        : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-100`
                    }`}
                  />
                  <div className="flex items-center pt-1 pl-1 pb-4">
                    {error.totalDistance && (
                      <p className="h-full text-red-100 text-xs pr-1">{error.totalDistance}</p>
                    )}
                  </div>
                  <button
                    disabled={isAddShotDisabled()}
                    type="submit"
                    onClick={handleAddShot}
                    className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-100 bg-blue-100 hover:bg-blue-200 ">
                    Add Shot
                  </button> */}
                    </form>
                  </Card>
                  <ShotList>
                    {club.shots.map((shot) => {
                      return (
                        <ShotItem
                          key={uuidv4()}
                          setClub={setClub}
                          shot={shot}
                          club={club}
                          updateClubStats={updateClubStats}
                          setAvgCarryDistance={setAvgCarryDistance}
                          setAvgTotalDistance={setAvgTotalDistance}
                        />
                      );
                    })}
                  </ShotList>
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
