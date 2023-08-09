import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

  const [stats, setStats] = useState({ puts: "", greens: "", fairways: "" });
  const [isLoading, setIsLoading] = useState(true);

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
      return { ...prevStats, greens: averageGreensHit };
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
      return { ...prevStats, puts: averagePutsPerRound };
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
      return { ...prevStats, fairways: averageFairwaysPerRound };
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

  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Dashboard</H1>
          </Header>
          <H2>Stats</H2>
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;
