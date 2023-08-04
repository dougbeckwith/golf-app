import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { getAverageGreensPerRound, isNumeric, getDate } from "../helpers";
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
import GreenItem from "../components/GreenItem";

const Greens = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [greensPerRound, setGreensPerRound] = useState("");
  const [greenData, setGreenData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [greenStats, setGreenStats] = useState([]);

  useEffect(() => {
    const getAllGreens = async () => {
      setIsLoading(true);
      try {
        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
        const response = await Fetch.get("/greens", null, encodedCredentials);

        if (response.status === 200) {
          handleGetGreensSuccess(response);
        } else {
          handleGetGreensError(response);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllGreens();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (greenData.length > 20) {
      setChartData(greenData.slice(greenData.length - 20, greenData.length));
    } else {
      setChartData(greenData);
    }
  }, [greenData]);

  const onInputChange = (e) => {
    const { value } = e.target;
    validateInput(e);
    setGreensPerRound(value);
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

    if (+value > 18) {
      setError("Please enter a number less than 19");
      return;
    }

    if (+value < 0) {
      setError("Please enter a number greater than 0");
      return;
    }
    setError("");
  };

  const handleGetGreensError = (response) => {
    if (response.status === 401) {
      navigate("/signin");
    } else if (response.status === 404) {
      navigate("/notfound");
    } else {
      navigate("/error");
    }
  };

  const lastThirtyGreens = (greensData) => {
    return greensData.slice(greensData.length - 30, greensData.length);
  };

  function roundAndRemoveDecimal(number) {
    // Round the number to two decimal places and convert to a string
    const roundedNumberString = number.toFixed(2);

    // Remove the decimal by converting the string back to an integer
    const roundedNumber = parseInt(roundedNumberString.replace(".", ""));

    return roundedNumber;
  }

  const handleGetGreensSuccess = async (response) => {
    const greensData = await response.json();
    console.log(greensData);
    setGreenData(greensData);
    setChartData(lastThirtyGreens(greensData));
    if (greensData.length !== 0) {
      const avgGreens = getAverageGreensPerRound(greensData);
      const avgPercent = avgGreens / 18;
      const greensPercent = roundAndRemoveDecimal(avgPercent);
      setGreenStats([
        { label: "Avg Greens", stat: avgGreens },
        { label: "Total Rounds", stat: greensData.length },
        { label: "% Greens In Reg", stat: `${greensPercent}%` }
      ]);
    } else {
      setGreenStats([
        { label: "Avg Greens", stat: 0 },
        { label: "Total Rounds", stat: greensData.length },
        { label: "% Greens In Reg", stat: `${0}%` }
      ]);
    }
  };

  const handleCreateRoundOfGreensError = async (response) => {
    const { err } = await response.json();
    setServerError(err.message);
  };

  const handleCreateRoundOfGreensSuccess = async (response, params) => {
    const { greenId } = await response.json();

    setGreenData((prev) => {
      const updatedGreens = [
        ...prev,
        {
          greens: params.greens,
          dateCreated: params.dateCreated,
          user: authUser._id,
          _id: greenId
        }
      ];
      const averageGreens = getAverageGreensPerRound(updatedGreens);
      const avgPercent = averageGreens / 18;
      const greensPercent = roundAndRemoveDecimal(avgPercent);
      setGreenStats([
        { label: "Avg Greens", stat: averageGreens },
        { label: "Total Rounds", stat: updatedGreens.length },
        { label: "% Greens In Reg", stat: `${greensPercent}%` }
      ]);

      return updatedGreens;
    });
    setGreensPerRound("");
  };

  const createRoundsOfGreens = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const dateCreated = getDate();
    const greens = +greensPerRound;
    const params = { greens, dateCreated, user: authUser._id };

    try {
      const response = await Fetch.create("/greens", params, encodedCredentials);
      console.log(response);
      if (response.status === 201) {
        handleCreateRoundOfGreensSuccess(response, params);
      } else {
        handleCreateRoundOfGreensError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGreenSuccess = (id) => {
    setGreenData((prev) => {
      let greens = [...prev];

      greens = greens.filter((item) => {
        return item._id !== id;
      });

      const averageGreens = getAverageGreensPerRound(greens);
      const avgPercent = averageGreens / 18;
      const greensPercent = roundAndRemoveDecimal(avgPercent);
      if (greens.length !== 0) {
        setGreenStats([
          { label: "Avg Greens", stat: averageGreens },
          { label: "Total Rounds", stat: greens.length },
          { label: "% Greens In Reg", stat: `${greensPercent}%` }
        ]);
      } else {
        setGreenStats([
          { label: "Avg Greens", stat: 0 },
          { label: "Total Rounds", stat: greens.length },
          { label: "% Greens In Reg", stat: `${0}%` }
        ]);
      }

      // setAvgPutsPerRound(averageGreens);

      return greens;
    });
  };
  const handleDeleteGreenError = async (response) => {
    const { err } = await response.json();
    setError(err.message);
  };

  const handleDeleteGreen = async (id) => {
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
      const response = await Fetch.remove(`/greens/${id}`, null, encodedCredentials);
      console.log(response);

      if (response.status === 204) {
        handleDeleteGreenSuccess(id);
      } else {
        handleDeleteGreenError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAddRoundDisabled = () => {
    if (error) return true;
    if (!greensPerRound) return true;
    return false;
  };

  const formFields = [
    {
      name: "greensPerRound",
      label: "Greens In Regulation (18 Holes)",
      onChange: onInputChange,
      innerRef: null,
      value: greensPerRound,
      type: "text"
    }
  ];

  return (
    <>
      <Main>
        <Container>
          <Header>
            <H1>Greens In Regulation</H1>
          </Header>
          {isLoading && <Spinner isLoading={isLoading} text={"Loading Greens"} />}

          {!isLoading && (
            <>
              <H2>Stats</H2>
              <div className="flex flex-wrap">
                <ChartSection
                  dataPoint={"greens"}
                  label={"Greens in Reg Per Round"}
                  chartData={chartData}
                  min={0}
                  max={18}
                />
                <StatsList styles={"flex flex-wrap self-start gap-3 mt-8"} stats={greenStats} />
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
                      {error && greensPerRound !== "" && <InputError>{error}</InputError>}
                    </InputWrapper>
                  );
                })}
                {serverError && <ServerError>{serverError}</ServerError>}
                <Button
                  color="teal"
                  styles="mt-7 mb-3 w-full"
                  onClick={createRoundsOfGreens}
                  disabled={isAddRoundDisabled()}>
                  Add Greens
                </Button>
              </FormCard>
              <H2 styles={"mt-10"}>Rounds</H2>
              <List>
                {greenData.map((round) => {
                  return (
                    <GreenItem key={uuidv4()} round={round} handleDeleteGreen={handleDeleteGreen} />
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

export default Greens;
