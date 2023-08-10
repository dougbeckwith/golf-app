import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Fetch from "../helpers/fetch";
import Spinner from "../components/Spinner";
import Main from "../components/Main";
import Container from "../components/Container";
import H1 from "../components/HeadingOne";
import Button from "../components/Button";
import Header from "../components/Header";
import H2 from "../components/HeadingTwo";
import {
  getAverageGreensPerRound,
  getAveragePutsPerRound,
  getAverageFairwaysPerRound
} from "../helpers";

const Dashboard = () => {
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState(null);

  const handleResponseError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  const handleGetGreensSuccess = async (response) => {
    const greensData = await response.json();

    const averageGreensHit = getAverageGreensPerRound(greensData);
    console.log("avg greens", averageGreensHit);
    setStats((prevStats) => {
      if (prevStats.length) {
        return prevStats.push({ greens: averageGreensHit, label: "Avg Greens Hit" });
      } else {
        return { greens: averageGreensHit, label: "Avg Greens Hit" };
      }
    });
  };

  const getGreensData = async () => {
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const response = await Fetch.get("/greens", null, encodedCredentials);
    if (response.status === 200) {
      await handleGetGreensSuccess(response);
    } else {
      handleResponseError(response);
    }
  };

  const handleGetPutsSuccess = async (response) => {
    const putsData = await response.json();
    const averagePutsPerRound = getAveragePutsPerRound(putsData);
    console.log("avg puts", averagePutsPerRound);
    setStats((prevStats) => {
      if (prevStats.length) {
        return prevStats.push({ stat: averagePutsPerRound, label: "Avg Puts Per Round" });
      } else {
        return { stat: averagePutsPerRound, label: "Avg Puts Per Round" };
      }
    });
  };

  const getPutsData = async () => {
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const response = await Fetch.get("/puts", null, encodedCredentials);
    if (response.status === 200) {
      await handleGetPutsSuccess(response);
    } else {
      handleResponseError(response);
    }
  };

  const handleGetFairwaysSuccess = async (response) => {
    const fairwaysData = await response.json();
    const averageFairwaysPerRound = getAverageFairwaysPerRound(fairwaysData);
    console.log("avg fairways", averageFairwaysPerRound);
    setStats((prevStats) => {
      if (prevStats.length) {
        return prevStats.push({ stat: averageFairwaysPerRound, label: "Avg Fairways Hit" });
      } else {
        return { stat: averageFairwaysPerRound, label: "Avg Fairways Hit" };
      }
    });
  };

  const getFairwaysData = async () => {
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const response = await Fetch.get("/fairways", null, encodedCredentials);
    if (response.status === 200) {
      await handleGetFairwaysSuccess(response);
    } else {
      handleResponseError(response);
    }
  };

  useEffect(() => {
    const getAllStats = async () => {
      setIsLoading(true);

      try {
        await getGreensData();
        await getPutsData();
        await getFairwaysData();

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        navigate("/error");
      }
    };

    getAllStats();

    // eslint-disable-next-line
  }, []);
  // goals
  // Add goals page
  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Dashboard</H1>
          </Header>

          {isLoading ? (
            <Spinner isLoading={isLoading} text={"Loading Stats"} />
          ) : (
            <>
              <H2>Stats</H2>
              {stats && <p>{}</p>}
              <H2>Goals</H2>
              {goals ? (
                <p>Goals</p>
              ) : (
                <div className="flex bg-dark-200 mt-5 lg:mt-10 pb-5 rounded-md flex-col justify-center items-center">
                  <h1 className="text-gray-200 mb-2  pt-2 text-center mx-auto max-w-4xl font-display text-sm lg:text-lg  md:text-xl font-medium tracking-tight ">
                    Start adding some goals to improve your golf game.
                  </h1>
                  <Link to="/goals/new">
                    <Button color={"blue"}>Add Goals</Button>
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

export default Dashboard;
