import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ClubItem from "../components/ClubItem";
import ClubList from "../components/ClubList";
import { sortClubsByDistance } from "../helpers";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import Spinner from "../components/Spinner";
import Main from "../components/Main";
import Container from "../components/Container";
import H1 from "../components/HeadingOne";
import Button from "../components/Button";
import Header from "../components/Header";

const Clubs = () => {
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [filterShotsBy, setFilterShotsBy] = useState("totalDistance");
  const [isLoading, setIsLoading] = useState(true);
  const [longestShot, setLongestShot] = useState(0);
  const [sortedClubs, setSortedClubs] = useState([]);

  const handleLocalStorageSettings = () => {
    const distanceType = getFilterShotsByLocalStorage();
    if (distanceType) {
      setFilterShotsBy(distanceType);
    }
  };

  const handleSortClubs = (clubData) => {
    const distanceType = getFilterShotsByLocalStorage();
    if (distanceType) {
      sortClubs(clubData, distanceType);
    } else {
      sortClubs(clubData, filterShotsBy);
    }
  };

  const handleGetClubsError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  const handleGetClubSuccess = async (response) => {
    const clubData = await response.json();
    setClubs(clubData);
    return clubData;
  };

  useEffect(() => {
    const getAllClubData = async () => {
      setIsLoading(true);
      let clubData = [];

      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

        const response = await Fetch.get("/clubs", null, encodedCredentials);
        if (response.status === 200) {
          clubData = await handleGetClubSuccess(response);
        } else handleGetClubsError(response);
        if (clubData.length === 0) {
          setIsLoading(false);
          return;
        }

        handleLocalStorageSettings(clubData);
        handleSortClubs(clubData);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        navigate("/error");
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
    setSortedClubs(sortedClubs);
    console.log(sortedClubs);

    const longestShot = sortedClubs[0].averageDistance;
    setLongestShot(longestShot);
  };

  const handleClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  const doClubsHaveNoShots = () => {
    if (sortedClubs.length === 0) return true;
    if (sortedClubs[0].shots.length === 0) return true;
    return false;
  };

  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Club Distances</H1>
            <Link to="/clubs/new" className="ml-auto">
              {sortedClubs.length !== 0 && <Button color={"blue"}>Add Club</Button>}
            </Link>
          </Header>
          {!isLoading && !doClubsHaveNoShots() && sortedClubs.length !== 0 && (
            <select
              name="clubs"
              id="clubs"
              onChange={handleFilterShotsBy}
              value={filterShotsBy}
              className="bg-dark-200 border-gray-300 rounded-md px-2 py-[4px] outline-none text-gray-100 border-2 cursor-pointer">
              <option value="totalDistance">Avg Total</option>
              <option value="totalCarry">Avg Carry</option>
            </select>
          )}
          {isLoading && <Spinner isLoading={isLoading} text={"Loading Clubs"} />}
          {!isLoading && (
            <>
              {sortedClubs.length !== 0 ? (
                <>
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
                </>
              ) : (
                <div className="flex bg-dark-200 mt-5 lg:mt-10 pb-5 rounded-md flex-col justify-center items-center">
                  <h1 className="text-gray-200 mb-2  pt-2 text-center mx-auto max-w-4xl font-display text-sm lg:text-lg  md:text-xl font-medium tracking-tight ">
                    Welcome to Golf Stats, get started by adding some clubs.
                  </h1>
                  <Link to="/clubs/new">
                    <Button color={"blue"}>Add Club</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </Container>
      </Main>
    </>
  );
};

export default Clubs;
