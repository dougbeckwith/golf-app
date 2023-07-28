import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../context/UserContext";
import { getAveragePutsPerRound, isNumeric, getDate } from "../helpers";
import Fetch from "../helpers/fetch";
import Header from "../components/HeadingOne";
import Loader from "../components/Loader";
import ChartSection from "../components/ChartSection";
import StatsSection from "../components/StatsSection";
import InputForm from "../components/InputForm";
import PuttingRounds from "../components/PuttingRounds";
import Main from "../components/Main";
import Container from "../components/Container";

const Puts = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [putsPerRound, setPutsPerRound] = useState("");
  const [averagePutsPerRound, setAvgPutsPerRound] = useState(0);
  const [putData, setPutData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllPuts = async () => {
      setIsLoading(true);
      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get("/puts", null, encodedCredentials);

        if (response.status === 200) {
          handleGetPutsSuccess(response);
        } else {
          handleGetPutsError(response);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllPuts();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (putData.length > 20) {
      setChartData(putData.slice(putData.length - 20, putData.length));
    } else {
      setChartData(putData);
    }
  }, [putData]);

  const onInputChange = (e) => {
    const { value } = e.target;
    validateInput(e);
    setPutsPerRound(value);
  };

  const validateInput = (e) => {
    let { value } = e.target;
    const isNumber = isNumeric(value);

    if (value === "") {
      setError("");
      return;
    }

    if (!isNumber) {
      setError("Please enter a valid number");
      return;
    }

    if (+value > 70) {
      setError("Please enter a number less than 70");
      return;
    }

    if (+value < 1) {
      setError("Please enter a number greater than 1");
      return;
    }
    setError("");
  };

  const handleGetPutsError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  const handleGetPutsSuccess = async (response) => {
    const putsData = await response.json();
    setPutData(putsData);
    setChartData(putsData.slice(putsData.length - 30, putsData.length));
    if (putsData.length !== 0) {
      setAvgPutsPerRound(getAveragePutsPerRound(putsData));
    }
    console.log(putsData);
  };

  const handleCreateRoundOfPutsError = async (response) => {
    const { err } = await response.json();
    setError(err.message);
  };

  const handleCreateRoundOfPutsSuccess = async (response, params) => {
    const { putId } = await response.json();

    setPutData((prev) => {
      const updatedPuts = [
        ...prev,
        {
          puts: params.puts,
          dateCreated: params.dateCreated,
          user: authUser._id,
          _id: putId
        }
      ];
      const averagePuts = getAveragePutsPerRound(updatedPuts);
      setAvgPutsPerRound(averagePuts);
      return updatedPuts;
    });
    setPutsPerRound("");
  };

  const createRoundsOfPuts = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const dateCreated = getDate();
    const puts = +putsPerRound;
    const params = { puts, dateCreated, user: authUser._id };

    try {
      const response = await Fetch.create("/puts", params, encodedCredentials);
      console.log(response);
      if (response.status === 201) {
        handleCreateRoundOfPutsSuccess(response, params);
      } else {
        handleCreateRoundOfPutsError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePutSuccess = (id) => {
    setPutData((prev) => {
      let puts = [...prev];

      puts = puts.filter((item) => {
        return item._id !== id;
      });

      const average = getAveragePutsPerRound(puts);
      if (puts.length !== 0) {
        setAvgPutsPerRound(average);
      } else {
        setAvgPutsPerRound(0);
      }

      return puts;
    });
  };
  const handleDeletePutError = async (response) => {
    const { err } = await response.json();
    setError(err.message);
  };

  const handleDeletePut = async (id) => {
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
      const response = await Fetch.remove(`/puts/${id}`, null, encodedCredentials);
      console.log(response);

      if (response.status === 204) {
        handleDeletePutSuccess(id);
      } else {
        handleDeletePutError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAddRoundDisabled = () => {
    if (error) return true;
    if (!putsPerRound) return true;
    return false;
  };

  return (
    <>
      <Main>
        <Container>
          <Header>Puts</Header>
          {isLoading && <Loader isLoading={isLoading} text={"Loading Puts"} />}
          {!isLoading && (
            <>
              <div className="flex flex-col xl:flex-row justify-between">
                <ChartSection chartData={chartData} />
                <StatsSection label="Average Puts" value={averagePutsPerRound} />
                <StatsSection label="Total Rounds" value={putData.length} />
              </div>
              <InputForm
                error={error}
                putsPerRound={putsPerRound}
                onInputChange={onInputChange}
                createRoundsOfPuts={createRoundsOfPuts}
                isAddRoundDisabled={isAddRoundDisabled}
                validateInput={validateInput}
              />
              <PuttingRounds putData={putData} handleDeletePut={handleDeletePut} />
            </>
          )}
        </Container>
      </Main>
    </>
  );
};

export default Puts;
