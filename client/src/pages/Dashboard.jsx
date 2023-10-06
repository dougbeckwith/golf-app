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
import StatsList from "../components/StatsList";

import {
  getAverageGreensPerRound,
  getAveragePutsPerRound,
  getAverageFairwaysPerRound
} from "../helpers";
import GoalList from "../components/GoalList";

const Dashboard = () => {
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    {
      label: "Puts Per Round",
      stat: 0
    },
    {
      label: "Avg Fairways",
      stat: 0
    },
    {
      label: "Avg Greens",
      stat: 0
    }
  ]);

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
    setStats((prevStats) => {
      const newStats = [...prevStats];
      newStats[2] = {
        label: "Avg Greens",
        stat: `${averageGreensHit}%`
      };
      return newStats;
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
    setStats((prevStats) => {
      const newStats = [...prevStats];
      newStats[0] = {
        label: "Avg Puts",
        stat: averagePutsPerRound
      };
      return newStats;
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
    setStats((prevStats) => {
      const newStats = [...prevStats];
      newStats[1] = {
        label: "Avg Fairways",
        stat: `${averageFairwaysPerRound}%`
      };
      return newStats;
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

  const handleGetGoalDataSuccess = async (response) => {
    console.log(response);
    const goalsData = await response.json();

    console.log(goalsData);
    if (goalsData.length === 0) {
      setGoals(null);
    } else {
      setGoals([
        { puts: goalsData.puts, label: "Puts" },
        { fairways: goalsData.fairways, label: "Fairways" },
        { greens: goalsData.greens, label: "Greens" }
      ]);
    }
  };

  const getGoalData = async () => {
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const response = await Fetch.get("/goals", null, encodedCredentials);
    if (response.status === 200) {
      await handleGetGoalDataSuccess(response);
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
        await getGoalData();

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
              <StatsList styles={"flex flex-wrap self-start gap-3 mt-8"} stats={stats} />
              <Header>
                <H2>Goals</H2>
                {goals && (
                  <Link to="/goals/edit" className="ml-auto">
                    <Button color={"blue"}>Edit Goals</Button>
                  </Link>
                )}
              </Header>
              {goals ? (
                <GoalList
                  styles={"flex flex-wrap self-start gap-3 mt-8"}
                  goals={goals}
                  stats={stats}
                />
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
