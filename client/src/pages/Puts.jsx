import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { getAveragePutsPerRound, isNumeric, getDate } from "../helpers";
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
import PutItem from "../components/PutItem";

const Puts = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [putsPerRound, setPutsPerRound] = useState("");
  const [putData, setPutData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [putStats, setPutStats] = useState([]);

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

    if (+value < 0) {
      setError("Please enter 0 or more puts");
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

  const lastThirtyPuts = (putsData) => {
    return putsData.slice(putsData.length - 30, putsData.length);
  };

  const handleGetPutsSuccess = async (response) => {
    const putsData = await response.json();
    console.log(putsData);
    setPutData(putsData);
    setChartData(lastThirtyPuts(putsData));
    if (putsData.length !== 0) {
      const avgPuts = getAveragePutsPerRound(putsData);
      setPutStats([
        { label: "Avg Puts", stat: avgPuts },
        { label: "Total Rounds", stat: putsData.length }
      ]);
    } else {
      setPutStats([
        { label: "Avg Puts", stat: 0 },
        { label: "Total Rounds", stat: putsData.length }
      ]);
    }
  };

  const handleCreateRoundOfPutsError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
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
      setPutStats([
        { label: "Avg Puts", stat: averagePuts },
        { label: "Total Rounds", stat: updatedPuts.length }
      ]);

      return updatedPuts;
    });
    setPutsPerRound("");
  };

  const createRoundsOfPuts = async (e) => {
    e.preventDefault();
    const isDisabled = isAddRoundDisabled();
    if (isDisabled) return;

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

      const averagePuts = getAveragePutsPerRound(puts);
      if (puts.length !== 0) {
        setPutStats([
          { label: "Avg Puts", stat: averagePuts },
          { label: "Total Rounds", stat: puts.length }
        ]);
      } else {
        setPutStats([
          { label: "Avg Puts", stat: 0 },
          { label: "Total Rounds", stat: puts.length }
        ]);
      }

      // setAvgPutsPerRound(averagePuts);

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
    if (!putsPerRound) {
      setError("Please enter a number");
      return true;
    }
    return false;
  };

  const formFields = [
    {
      name: "putsPerRound",
      label: "Total Number Of Puts (18 Holes)",
      onChange: onInputChange,
      innerRef: null,
      value: putsPerRound,
      type: "text"
    }
  ];

  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Putting</H1>
          </Header>
          {isLoading && <Spinner isLoading={isLoading} text={"Loading Puts"} />}

          {!isLoading && (
            <>
              <H2>Stats</H2>
              <div className="flex align- flex-wrap ">
                <ChartSection
                  dataPoint={"puts"}
                  label={"Puts Per Round"}
                  chartData={chartData}
                  max={50}
                />
                <StatsList styles={"self-start xl:mx-auto xl:gap-10 mt-5"} stats={putStats} />
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
                      {error || putsPerRound !== "" ? <InputError>{error}</InputError> : <></>}
                    </InputWrapper>
                  );
                })}
                {serverError && <ServerError>{serverError}</ServerError>}
                <Button color="teal" styles="mt-7 mb-3 w-full" onClick={createRoundsOfPuts}>
                  Add Round
                </Button>
              </FormCard>
              <H2 styles={"mt-10"}>Rounds</H2>
              <List>
                {putData.map((round) => {
                  return <PutItem key={uuidv4()} round={round} handleDeletePut={handleDeletePut} />;
                })}
              </List>
            </>
          )}
        </Container>
      </Main>
    </>
  );
};

export default Puts;
