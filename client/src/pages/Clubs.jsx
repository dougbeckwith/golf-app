import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ClubItem from "../components/ClubItem";
import ClubList from "../components/ClubList";
import { sortClubsByAvgYards } from "../helpers";
import UserContext from "../context/UserContext";

const Clubs = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);

  const [clubData, setClubData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highestAvgShot, setHighestAvgShot] = useState(0);

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

        const response = await fetch(`http://localhost:5000/clubs`, options);
        if (response.status === 200) {
          const data = await response.json();
          if (data.length !== 0) {
            const sortedData = sortClubsByAvgYards(data);
            let highestAvgShot = sortedData[0].avgYards;
            setHighestAvgShot(highestAvgShot);
            console.log(sortedData);
            setClubData(sortedData);
            setIsLoading(false);
          } else {
            setIsLoading(false);
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
      <div className="px-5 lg:px-0 md:pt-7 w-full bg-dark-400 min-h-screen max-h-min">
        <div className="container m-auto">
          <div className="pb-10  hidden md:block">
            <h1 className="text-gray-500 text-center mx-auto max-w-4xl font-display text-3xl font-medium tracking-tight sm:text-4xl ">
              Add clubs to track your distances.
            </h1>
          </div>

          <div className="w-full flex items-center mb-3 ">
            <h1 className="text-gray-500 text-2xl font-semibold">
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

          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <ClubList>
                {clubData.map((club) => (
                  <ClubItem
                    key={uuidv4()}
                    club={club}
                    handleClick={handleClick}
                    highestAvgShot={highestAvgShot}
                  />
                ))}
              </ClubList>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Clubs;
