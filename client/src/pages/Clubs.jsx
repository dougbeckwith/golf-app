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
  const [sortedClubs, setSortedClubs] = useState([]);
  const [filterShotsBy, setFilterShotsBy] = useState("totalDistance");
  const [longestShot, setLongestShot] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllClubData = async () => {
      let clubData = [];
      let filterShotsByLocalStorage = false;

      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

        const options = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        };

        const response = await fetch(`${process.env.REACT_APP_URL}/clubs`, options);

        if (response.status === 200) {
          clubData = await response.json();
          console.log(clubData);
          setClubs(clubData);
        } else if (response.status === 401) {
          navigate("/signin");
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
        if (clubData.length === 0) {
          setIsLoading(false);
          return;
        }

        filterShotsByLocalStorage = getFilterShotsByLocalStorage();

        if (filterShotsByLocalStorage) {
          setFilterShotsBy(filterShotsByLocalStorage);
          sortClubs(clubData, filterShotsByLocalStorage);
        } else {
          sortClubs(clubData, filterShotsBy);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllClubData();

    // eslint-disable-next-line
  }, []);

  const getFilterShotsByLocalStorage = () => {
    return JSON.parse(localStorage.getItem("filterBy"));
  };

  const setFilterShotsByLocalStorage = (filterBy) => {
    localStorage.setItem("filterBy", JSON.stringify(filterBy));
  };

  // filters clubs by total or carry distance
  const handleFilterShotsBy = (e) => {
    if (e.target.value === "totalDistance") {
      setFilterShotsBy("totalDistance");
      setFilterShotsByLocalStorage("totalDistance");
    } else {
      setFilterShotsBy("totalCarry");
      setFilterShotsByLocalStorage("totalCarry");
    }
    sortClubs(clubs, e.target.value);
  };

  // sorts clubs by shotType (carryDistance, totalDistance)
  const sortClubs = (clubs, shotType) => {
    if (clubs.length === 0) return;

    const sortedClubs = sortClubsByDistance(clubs, shotType);
    const longestShot = sortedClubs[0].averageDistance;

    setLongestShot(longestShot);
    setSortedClubs(sortedClubs);
  };

  // navigates to club by id
  const handleClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  return (
    <>
      <div className="px-5 lg:px-3 md:pt-7 w-full bg-dark-500 ">
        <div className="container  m-auto">
          <div className="w-full flex items-center mb-3 ">
            <h1 className="text-gray-400 text-2xl font-semibold">Club Distances</h1>
            <div className="ml-auto">
              <Link to="/clubs/new">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-blue-400 hover:bg-blue-300 "
                >
                  Add Club
                </button>
              </Link>
            </div>
          </div>
          {!isLoading && (
            <select
              name="clubs"
              id="clubs"
              onChange={handleFilterShotsBy}
              value={filterShotsBy}
              className="bg-dark-200 text-gray-400 rounded-md px-2 py-[4px] cursor-pointer"
            >
              <option value="totalDistance">Total Distance</option>
              <option value="totalCarry">Carry Distance</option>
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
                  filterShotsBy={filterShotsBy}
                  longestShot={longestShot}
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
                Record each shot you make to track your average total and carry distance.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Clubs;
