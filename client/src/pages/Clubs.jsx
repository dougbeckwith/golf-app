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
  const [type, setType] = useState("totalDistance");

  const [clubs, setClubs] = useState([]);
  const [sortedClubs, setSortedClubs] = useState([]);
  const [longestTotalDistance, setlongestTotalDistance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

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
          setClubs(clubs);
          // sort clubs by total distance to start
          if (clubs.length !== 0) {
            // check local storage to see if previous type set
            const typeLocalStorage = getTypeLocalStorage();
            if (typeLocalStorage) {
              setType(typeLocalStorage);
              sortClubs(clubs, typeLocalStorage);
            } else {
              sortClubs(clubs, type);
            }
          }
        } else {
          console.log(response);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllClubData();

    // eslint-disable-next-line
  }, []);

  // Get club filter type local storage
  const getTypeLocalStorage = () => {
    const type = JSON.parse(localStorage.getItem("type"));
    console.log(type);
    return type;
  };

  // Update club filter type local storage
  const setTypeLocalStorage = (type) => {
    localStorage.setItem("type", JSON.stringify(type));
  };

  // filters clubs by total or carry distance
  const handleSelectChange = (e) => {
    if (e.target.value === "totalDistance") {
      setType("totalDistance");
      setTypeLocalStorage("totalDistance");
    } else {
      setType("totalCarry");
      setTypeLocalStorage("totalCarry");
    }
    sortClubs(clubs, e.target.value);
  };

  // sorts clubs by type (carryDistance, totalDistance)
  const sortClubs = (clubs, type) => {
    const sortedClubs = sortClubsByDistance(clubs, type);
    let longestTotalDistance = sortedClubs[0].averageDistance;
    setlongestTotalDistance(longestTotalDistance);
    setSortedClubs(sortedClubs);
  };

  // navigates to club by id
  const handleClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  // state for type

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
          {!isLoading && (
            <select
              name="clubs"
              id="clubs"
              onChange={handleSelectChange}
              value={type}
              className="bg-dark-200 text-gray-400 rounded-md px-2 py-[4px] cursor-pointer">
              <option value="totalDistance">Total</option>
              <option value="totalCarry">Carry</option>
            </select>
          )}
          {isLoading && (
            <div className="pb-10">
              <h1 className="text-gray-500 pt-5 text-center mx-auto max-w-4xl font-display text-xl  md:text-2xl font-medium tracking-tight  ">
                Loading Clubs
              </h1>
            </div>
          )}
          {sortedClubs.length !== 0 && (
            <ClubList>
              {sortedClubs.map((club) => (
                <ClubItem
                  key={uuidv4()}
                  club={club}
                  handleClick={handleClick}
                  type={type}
                  longestTotalDistance={longestTotalDistance}
                />
              ))}
            </ClubList>
          )}
          {sortedClubs.length === 0 && !isLoading && (
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
