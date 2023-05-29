import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiGolfTee } from "react-icons/gi";
import { getAverageDistance } from "../helpers";
import ShotList from "../components/ShotList";
import ShotItem from "../components/ShotItem";
import UserContext from "../context/UserContext";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const Club = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [club, setClub] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // State for response errors
  // const [errors, setErrors] = useState([]);

  // State for errors add shot form
  const [error, setError] = useState({
    totalCarry: "",
    totalDistance: ""
  });

  // State for shot add shot form
  const [shot, setShot] = useState({
    totalCarry: "",
    totalDistance: ""
  });

  const [avgTotalCarry, setAvgTotalCarry] = useState("");
  const [avgTotalDistance, setAvgTotalDistance] = useState("");

  const { authUser } = useContext(UserContext);

  // Navigate to clubs page
  const navigateToClubs = () => {
    navigate("/clubs");
  };

  // GET club and set club state
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
          setAvgTotalCarry(getAverageDistance(club, "totalCarry"));
          setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
          setIsLoading(false);
        }

        if (response.status === 400) {
          navigate("/notfound");
        }

        if (response.status === 401) {
          navigate("/forbidden");
        }

        if (response.status === 500) {
          navigate("/error");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchClub();
    // eslint-disable-next-line
  }, []);

  // UPDATE club (add shot)
  // TODO add alert for adding shot
  const handleAddShot = async (e) => {
    e.preventDefault();
    const shotId = uuidv4();
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    // fetch options
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`
      },
      body: JSON.stringify({
        addShot: true,
        shot: { ...shot, shotId: shotId }
      })
    };

    try {
      // send request to update club (add shot)
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
        options
      );

      // if success update club state to reflect the added shot
      if (response.status === 200) {
        setShot({
          totalCarry: "",
          totalDistance: ""
        });
        setClub((prev) => {
          const club = {
            ...prev,
            shots: [...prev.shots, { ...shot, shotId: shotId }]
          };
          setAvgTotalCarry(getAverageDistance(club, "totalCarry"));
          setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
          return club;
        });
        alert("shot added!");
      }

      if (response.status === 400) {
        alert("Bad request");
      }

      if (response.status === 401) {
        alert("Not Authorized");
      }

      if (response.status === 500) {
        alert("Server Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE club
  const handleDelete = async () => {
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    // fetch options
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    };

    // prompt user on delete
    const answer = prompt(
      "Are you sure you want to delete? enter delete to confirm"
    );

    if (answer === "delete") {
      try {
        // send request to delete club
        const response = await fetch(
          `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
          options
        );

        if (response.status === 204) {
          navigateToClubs();
        }

        if (response.status === 400) {
          alert("Bad request");
        }

        if (response.status === 500) {
          alert("Server Error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // update shot state and validate input
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setShot((prev) => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };

  // validates shot input
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
            console.log(typeof +value);
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

  // controls if add shot buttons is disabled
  const isAddShotDisabled = () => {
    if (isLoading === true) {
      return true;
    }
    if (
      !error.totalDistance &&
      !error.totalCarry &&
      shot.totalDistance &&
      shot.totalCarry
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="w-full bg-dark-400 text-gray-500 min-h-screen max-h-min ">
        <div className="container m-auto pt-4 xl:pt-16 px-3 sm:px-0">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <div className="flex md:flex-row flex-col items-center pt-3 pb-5 w-full">
                <div className="flex items-center pb-2 text-gray-400">
                  <p className="font-semibold text-2xl ">{club.club}</p>
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
                    onClick={handleDelete}
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
                      {error.totalCarry.length === 0 &&
                        shot.totalCarry.length !== 0 && (
                          <IoCheckmarkCircleOutline
                            className={"text-green-500"}
                          />
                        )}
                    </div>

                    <input
                      name="totalCarry"
                      value={shot.totalCarry}
                      onBlur={validateInput}
                      onChange={onInputChange}
                      className={`${
                        error.totalCarry
                          ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                          : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                      }`}
                    />

                    <div className="flex items-center pt-1 pl-1">
                      {error.totalCarry && (
                        <p className="h-full text-pink-400 text-xs pr-1">
                          {error.totalCarry}
                        </p>
                      )}
                    </div>

                    <div className="pb-1 pl-1 flex items-center">
                      <label htmlFor="totalDistance" className="text-lg mr-1">
                        Total Distance{" "}
                        <span className="text-xs">
                          (<span className="ml-[2px] mr-[2px]">yards</span>)
                        </span>
                      </label>
                      {error.totalDistance.length === 0 &&
                        shot.totalDistance.length !== 0 && (
                          <IoCheckmarkCircleOutline
                            className={"text-green-500"}
                          />
                        )}
                    </div>
                    <input
                      name="totalDistance"
                      value={shot.totalDistance}
                      onBlur={validateInput}
                      onChange={onInputChange}
                      className={`${
                        error.totalDistance
                          ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                          : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                      }`}
                    />
                    <div className="flex items-center pt-1 pl-1 pb-4">
                      {error.totalDistance && (
                        <p className="h-full text-pink-400 text-xs pr-1">
                          {error.totalDistance}
                        </p>
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
                      <p className="text-gray-400 text-sm">
                        Avg Carry Distance
                      </p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{avgTotalCarry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex items-center pb-2 lg:justify-center ">
                    <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="#d1d5db" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">
                        Avg Total Distance
                      </p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{avgTotalDistance}</span>
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
                          setAvgTotalCarry={setAvgTotalCarry}
                          setAvgTotalDistance={setAvgTotalDistance}
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
    </>
  );
};

export default Club;
