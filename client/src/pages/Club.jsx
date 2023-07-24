import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiGolfTee } from "react-icons/gi";
import { getAverageDistance } from "../helpers";
import ShotList from "../components/ShotList";
import ShotItem from "../components/ShotItem";
import UserContext from "../context/UserContext";
import Alert from "../components/Alert";
import Fetch from "../helpers/fetch";

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

  // State for alert message
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [navTo, setNavTo] = useState("");

  useEffect(() => {
    setEncodedCredentials(btoa(`${authUser.email}:${authUser.password}`));
  }, [authUser.email, authUser.password]);

  const handleError = async (response) => {
    const { err } = await response.json();
    setMessage(`${err.message}`);
  };

  const handleGetClubSuccess = async (response) => {
    const club = await response.json();
    setClub(club);
    setAvgCarryDistance(getAverageDistance(club, "totalCarry"));
    setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
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

  const handleAddShotSuccess = async (response) => {
    const { shotId } = await response.json();
    setShot({ totalCarry: "", totalDistance: "" });
    setClub((prevClub) => {
      const club = { ...prevClub, shots: [...prevClub.shots, { ...shot, _id: shotId }] };
      setAvgCarryDistance(getAverageDistance(club, "totalCarry"));
      setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
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
    setMessage("Success! Club Deleted");
    setNavTo("/clubs");
    setShow(true);
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

  return (
    <>
      <div className="w-full bg-dark-500 text-gray-500 min-h-screen max-h-min ">
        <div className="container m-auto pt-4 xl:pt-16 px-3 sm:px-0">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <div className="flex md:flex-row flex-col items-center pt-3 pb-5 w-full">
                <div className="flex items-center pb-2 text-gray-400">
                  <p className="font-semibold text-2xl ">{club.name}</p>
                  <span className="px-1 text-2xl md:text-md">-</span>
                  <p className="text-2xl">{club.brand}</p>
                </div>
                <div className="mx-auto md:mx-0 md:ml-auto flex  gap-1">
                  <Link to={`/clubs/${id}/edit`}>
                    <button className=" px-2 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-blue-400 hover:bg-blue-300 ">
                      Edit Club
                    </button>
                  </Link>
                  <button
                    onClick={handleDeleteClub}
                    className="px-2 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-pink-500 hover:bg-pink-400 ">
                    Delete Club
                  </button>
                </div>
              </div>
              <div className="">
                <div className="w-full flex flex-col lg:flex-row">
                  <form className="mb-2 w-full  flex flex-col py-5 px-6 rounded-md bg-dark-300">
                    <div className="pb-1 pl-1 flex items-center">
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
                          ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                          : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                      }`}
                    />
                    <div className="flex items-center pt-1 pl-1">
                      {error.totalCarry && (
                        <p className="h-full text-pink-400 text-xs pr-1">{error.totalCarry}</p>
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
                          ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                          : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                      }`}
                    />
                    <div className="flex items-center pt-1 pl-1 pb-4">
                      {error.totalDistance && (
                        <p className="h-full text-pink-400 text-xs pr-1">{error.totalDistance}</p>
                      )}
                    </div>
                    <button
                      disabled={isAddShotDisabled()}
                      type="submit"
                      onClick={handleAddShot}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 ">
                      Add Shot
                    </button>
                  </form>

                  <div className="w-full flex items-center pb-2 lg:justify-center ">
                    <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="#d1d5db" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">Avg Total Distance</p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{avgTotalDistance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center pb-2 lg:justify-center ">
                    <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="#d1d5db" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">Avg Carry Distance</p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{avgTotalCarry}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center pb-2 lg:justify-center">
                    <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="#d1d5db" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">Total Shots</p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{club.shots.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="pt-10 text-2xl text-gray-200">Shots</h1>
                {isLoading ? (
                  <div>Loading</div>
                ) : (
                  <ShotList>
                    {club.shots.map((shot) => {
                      return (
                        <ShotItem
                          key={uuidv4()}
                          setClub={setClub}
                          shot={shot}
                          club={club}
                          setAvgCarryDistance={setAvgCarryDistance}
                          setAvgTotalDistance={setAvgTotalDistance}
                          setShow={setShow}
                          setMessage={setMessage}
                        />
                      );
                    })}
                  </ShotList>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Alert show={show} setShow={setShow} message={message} navTo={navTo} />
    </>
  );
};

export default Club;
