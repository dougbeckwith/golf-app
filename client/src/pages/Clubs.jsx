import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ClubItem from "../components/ClubItem";
import ClubList from "../components/ClubList";
import { sortClubsByDistance } from "../helpers";
import UserContext from "../context/UserContext";

const Clubs = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);

  const [clubs, setClubs] = useState([]);
  const [longestTotalDistance, setlongestTotalDistance] = useState(0);
  // TO DO
  // Add longest Carry Distance state
  // Give option to user to filter by carry or total
  // Change what is displayed to user based on filter selection

  useEffect(() => {
    const getAllClubData = async () => {
      try {
        const encodedCredentials = btoa(
          `${authUser.email}:${authUser.password}`
        );

        const options = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        };

        const response = await fetch(
          `${process.env.REACT_APP_CYCLIC_URL}/clubs`,
          options
        );
        if (response.status === 200) {
          const clubs = await response.json();
          if (clubs.length !== 0) {
            const sortedClubs = sortClubsByDistance(clubs, "totalDistance");
            let longestTotalDistance = sortedClubs[0].averageDistance;
            setlongestTotalDistance(longestTotalDistance);
            setClubs(sortedClubs);
          }
        } else {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllClubData();

    // eslint-disable-next-line
  }, []);

  const handleClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  return (
    <>
      <div className="px-5 lg:px-3 md:pt-7 w-full bg-dark-500 ">
        <div className="container  m-auto">
          <div className="w-full flex items-center mb-3 ">
            <h1 className="text-gray-400 text-2xl font-semibold">
              Club Distances
            </h1>
            <div className="ml-auto">
              <Link to="/clubs/new">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-blue-400 hover:bg-blue-300 ">
                  Add Club
                </button>
              </Link>
            </div>
          </div>
          {clubs && clubs.length !== 0 ? (
            <select name="clubs" id="clubs">
              <option value="carry">Carry</option>
              <option value="total">Total</option>
            </select>
          ) : (
            <></>
          )}

          {clubs && clubs.length !== 0 ? (
            <ClubList>
              {clubs.map((club) => (
                <ClubItem
                  key={uuidv4()}
                  club={club}
                  handleClick={handleClick}
                  longestTotalDistance={longestTotalDistance}
                />
              ))}
            </ClubList>
          ) : (
            <div className="pb-10">
              <h1 className="text-gray-500 pt-5 text-center mx-auto max-w-4xl font-display text-xl  md:text-2xl font-medium tracking-tight  ">
                Start by adding clubs to track.
              </h1>
              <p className="text-gray-500 pt-5 text-center mx-auto max-w-4xl font-display text-xl  md:text-xl font-medium tracking-tight ">
                Record each shot you make to track your average total and carry
                distance.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Clubs;
