import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { getAverageFairwaysPerRound, isNumeric, getDate } from "../helpers";
import Fetch from "../helpers/fetch";
import ChartSection from "../components/ChartSection";
import Container from "../components/Container";
import H1 from "../components/HeadingOne";
import H2 from "../components/HeadingTwo";
import Main from "../components/Main";
import Button from "../components/Button";
import Header from "../components/Header";
import List from "../components/List";
import Spinner from "../components/Spinner";
import InputLabel from "../components/InputLabel";
import InputField from "../components/InputField";
import ServerError from "../components/ServerError";
import InputError from "../components/InputError";
import InputWrapper from "../components/InputWrapper";
import FormCard from "../components/FormCard";
import StatsList from "../components/StatsList";
import FairwayItem from "../components/FairwayItem";

const Fairways = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [fairwaysPerRound, setFairwaysPerRound] = useState("");
  const [fairwayData, setFairwayData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [fairwayStats, setFairwayStats] = useState([]);

  useEffect(() => {
    const getAllFairways = async () => {
      setIsLoading(true);
      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get("/fairways", null, encodedCredentials);

        if (response.status === 200) {
          handleGetFairwaysSuccess(response);
        } else {
          handleGetFairwaysError(response);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllFairways();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (fairwayData.length > 20) {
      setChartData(fairwayData.slice(fairwayData.length - 20, fairwayData.length));
    } else {
      setChartData(fairwayData);
    }
  }, [fairwayData]);

  const onInputChange = (e) => {
    const { value } = e.target;
    validateInput(e);
    setFairwaysPerRound(value);
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

    if (+value > 100) {
      setError("Please enter a number less than 100");
      return;
    }

    if (+value < 0) {
      setError("Please enter a number greater than 0");
      return;
    }
    setError("");
  };

  const handleGetFairwaysError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  const lastThirtyFairways = (fairwaysData) => {
    return fairwaysData.slice(fairwaysData.length - 30, fairwaysData.length);
  };

  const handleGetFairwaysSuccess = async (response) => {
    const fairwaysData = await response.json();
    console.log(fairwaysData);
    setFairwayData(fairwaysData);
    setChartData(lastThirtyFairways(fairwaysData));
    if (fairwaysData.length !== 0) {
      const avgFairways = getAverageFairwaysPerRound(fairwaysData);
      setFairwayStats([
        { label: "Avg Fairways Hit", stat: `${avgFairways}%` },
        { label: "Total Rounds", stat: fairwaysData.length }
      ]);
    } else {
      setFairwayStats([
        { label: "Avg Fairways Hit", stat: 0 },
        { label: "Total Rounds", stat: fairwaysData.length }
      ]);
    }
  };

  const handleCreateRoundOfFairwaysError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleCreateRoundOfFairwaysSuccess = async (response, params) => {
    const { fairwayId } = await response.json();

    setFairwayData((prev) => {
      const updatedFairways = [
        ...prev,
        {
          fairways: params.fairways,
          dateCreated: params.dateCreated,
          user: authUser._id,
          _id: fairwayId
        }
      ];
      const avgFairways = getAverageFairwaysPerRound(updatedFairways);
      setFairwayStats([
        { label: "Avg Fairways Hit", stat: `${avgFairways}%` },
        { label: "Total Rounds", stat: updatedFairways.length }
      ]);

      return updatedFairways;
    });
    setFairwaysPerRound("");
  };

  const createRoundsOfFairways = async (e) => {
    e.preventDefault();
    const isDisabled = isAddRoundDisabled();
    if (isDisabled) return;
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const dateCreated = getDate();
    const fairways = +fairwaysPerRound;
    const params = { fairways, dateCreated, user: authUser._id };

    try {
      const response = await Fetch.create("/fairways", params, encodedCredentials);
      console.log(response);
      if (response.status === 201) {
        handleCreateRoundOfFairwaysSuccess(response, params);
      } else {
        handleCreateRoundOfFairwaysError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFairwaySuccess = (id) => {
    setFairwayData((prev) => {
      let fairways = [...prev];

      fairways = fairways.filter((item) => {
        return item._id !== id;
      });

      const avgFairways = getAverageFairwaysPerRound(fairways);
      if (fairways.length !== 0) {
        setFairwayStats([
          { label: "Avg Fairways Hit", stat: `${avgFairways}%` },
          { label: "Total Rounds", stat: fairways.length }
        ]);
      } else {
        setFairwayStats([
          { label: "Avg Fairways Hit", stat: 0 },
          { label: "Total Rounds", stat: fairways.length }
        ]);
      }

      return fairways;
    });
  };
  const handleDeleteFairwayError = async (response) => {
    const { err } = await response.json();
    setError(err.message);
  };

  const handleDeleteFairway = async (id) => {
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
      const response = await Fetch.remove(`/fairways/${id}`, null, encodedCredentials);
      console.log(response);

      if (response.status === 204) {
        handleDeleteFairwaySuccess(id);
      } else {
        handleDeleteFairwayError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAddRoundDisabled = () => {
    if (error) return true;
    if (!fairwaysPerRound) {
      setError("Please enter a number");
      return true;
    }
    return false;
  };

  const formFields = [
    {
      name: "fairwaysPerRound",
      label: "Percent Of Fairways In Regulation (18 Holes)",
      onChange: onInputChange,
      innerRef: null,
      value: fairwaysPerRound,
      type: "text"
    }
  ];

  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Fairways In Regulation</H1>
          </Header>
          {isLoading && <Spinner isLoading={isLoading} text={"Loading Stats"} />}

          {!isLoading && (
            <>
              <H2>Stats</H2>
              <div className="flex flex-wrap">
                <ChartSection
                  dataPoint={"fairways"}
                  label={"% Fairways In Regulation"}
                  chartData={chartData}
                  min={0}
                  max={100}
                />
                <StatsList styles={"flex flex-wrap self-start gap-3 mt-8"} stats={fairwayStats} />
              </div>
              <H2 styles={"mt-10"}>Add Round</H2>
              <FormCard>
                {formFields.map((item, index) => {
                  return (
                    <InputWrapper key={index}>
                      <InputLabel htmlFor={item.name} className="mb-1 ml-1 mr-1 inline-block">
                        {item.label}
                      </InputLabel>
                      <InputField
                        name={item.name}
                        type={item.type}
                        value={item.value}
                        onChange={onInputChange}>
                        {item.value}
                      </InputField>
                      {error || fairwaysPerRound !== "" ? <InputError>{error}</InputError> : <></>}
                    </InputWrapper>
                  );
                })}
                {serverError && <ServerError>{serverError}</ServerError>}
                <Button color="teal" styles="mt-7 mb-3 w-full" onClick={createRoundsOfFairways}>
                  Add Round
                </Button>
              </FormCard>
              <H2 styles={"mt-10"}>Rounds</H2>
              <List>
                {fairwayData.map((round) => {
                  return (
                    <FairwayItem
                      key={uuidv4()}
                      round={round}
                      handleDeleteFairway={handleDeleteFairway}
                    />
                  );
                })}
              </List>
            </>
          )}
        </Container>
      </Main>
    </>
  );
};

export default Fairways;
