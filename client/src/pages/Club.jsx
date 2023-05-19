import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiGolfTee } from "react-icons/gi";
import { getAverageYards } from "../helpers";
import ShotList from "../components/ShotList";
import ShotItem from "../components/ShotItem";

const Club = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [club, setClub] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [shot, setShot] = useState("");

  // Navigate to clubs page
  const navigateToClubs = () => {
    navigate("/clubs");
  };

  // GET club and set club state
  useEffect(() => {
    const fetchClub = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`
      );
      setClub(response.data);
      setIsLoading(false);
    };
    fetchClub();
    // eslint-disable-next-line
  }, []);

  // DELETE club and navigate to clubs page
  const handleDelete = async () => {
    const answer = prompt(
      "Are you sure you want to delete? enter delete to confirm"
    );
    if (answer === "delete") {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CYCLIC_URL}/api/clubs/${id}`
        );
        if (response.status === 200) {
          navigateToClubs();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // UPDATE club (add shot)
  const handleAddShot = async (e) => {
    e.preventDefault();

    // return if input invalid
    if (shot === "0" || shot === null || shot === "") return;
    try {
      // UPDATE club (add shot)
      const response = await axios.patch(
        `${process.env.REACT_APP_CYCLIC_URL}/api/clubs/${id}`,
        {
          club: club,
          shot: { yards: parseInt(shot), id: uuidv4() }
        }
      );
      if (response.status === 200) {
        setClub(response.data);
        setShot("");
      }
    } catch (err) {
      console.log(err);
    }
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
                  <p className="font-semibold text-2xl ">{club.clubName}</p>
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
                <div className="w-full flex flex-col md:flex-row">
                  <form className="mb-2 w-full  flex flex-col py-5 px-6 rounded-md bg-dark-300">
                    <label htmlFor="shot">Yards</label>
                    <input
                      name="shot"
                      value={shot}
                      onChange={(e) => setShot(e.target.value)}
                      className="text-gray-200 w-full mb-2 bg-dark-100 p-2 rounded placeholder-gray-600 placeholder:opacity-40"
                      type="number"
                      placeholder="150"
                    />
                    <button
                      onClick={handleAddShot}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 ">
                      Add Shot
                    </button>
                  </form>

                  <div className="w-full flex items-center pb-2 md:justify-center ">
                    <div className="w-[75px] h-[75px] bg-blue-400 flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="white" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">Avg Yards</p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{getAverageYards(club)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex items-center pb-2 md:justify-center">
                    <div className="w-[75px] h-[75px] bg-blue-400 flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="white" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">Total Shots</p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{club.totalShots}</span>
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
