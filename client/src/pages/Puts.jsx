import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { GiGolfTee } from "react-icons/gi";
import Chart from "../components/Chart";
import PutList from "../components/PutList";
import PutItem from "../components/PutItem";
import { getAveragePutsPerRound, isNumeric, getDate } from "../helpers";
import Fetch from "../helpers/fetch";
import BarLoader from "react-spinners/BarLoader";

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

  // Update the chartData when putData changes.
  // Only show up to 20 of the most recent puts on the chart.
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
      <div className="px-5 lg:px-3 md:pt-7 w-full bg-dark-500 ">
        <div className="container m-auto">
          <div className="w-full flex items-center mb-3 ">
            <h1 className="text-gray-400 text-2xl font-semibold">Puts</h1>
          </div>
          {isLoading ? (
            <div className="pb-10">
              <h1 className="text-gray-500 pt-5 mx-auto max-w-4xl font-display text-xl  md:text-2xl font-medium tracking-tight  ">
                Loading Puts
              </h1>
              <div className="pt-5 mx-auto max-w-4xl ">
                <BarLoader
                  color={"#007acc"}
                  loading={isLoading}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col xl:flex-row">
                <div className="w-full min-h-[300px] shrink-0 lg:w-[500px] lg:h-[300px] xl:w-[700px] xl:h-[350px]">
                  <Chart putData={chartData} className={"shrink-0"} />
                </div>
                <div className="w-full flex items-center pb-2  mt-10 xl:mt-0">
                  <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                    <GiGolfTee size={40} color="#d1d5db" />
                  </div>
                  <div className="pl-5">
                    <p className="text-gray-400 text-sm">Average Puts</p>
                    <div className="text-blue-400 text-xl font-bold flex">
                      <span>{averagePutsPerRound}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center pb-2 ">
                  <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                    <GiGolfTee size={40} color="#d1d5db" />
                  </div>
                  <div className="pl-5">
                    <p className="text-gray-400 text-sm">Total Rounds</p>
                    <div className="text-blue-400 text-xl font-bold flex">
                      <span>{putData.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col sm:flex-row xl:mt-10">
                <form className="text-gray-500 mb-2 flex flex-col py-5 px-6 rounded-md bg-dark-300">
                  <div className="pb-1 pl-1 flex items-center">
                    <label htmlFor="totalCarry" className="text-lg mr-1">
                      Total Puts{" "}
                      <span className="text-xs">
                        (<span className="ml-[2px] mr-[2px]">18 Holes</span>)
                      </span>
                    </label>
                  </div>
                  <input
                    name="totalPuts"
                    value={putsPerRound}
                    onBlur={validateInput}
                    onChange={onInputChange}
                    className={`${
                      error
                        ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400 `
                        : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400 `
                    }`}
                  />
                  {error ? (
                    <p className="text-pink-400 text-xs pr-1 my-2">{error}</p>
                  ) : (
                    <p className="text-pink-400 text-xs pr-1 my-2 h-[20px]"></p>
                  )}

                  <button
                    disabled={isAddRoundDisabled()}
                    type="submit"
                    onClick={createRoundsOfPuts}
                    className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 ">
                    Add Round
                  </button>
                </form>
              </div>
              <h1 className="pt-10 text-2xl text-gray-400">Putting Rounds</h1>
              <PutList>
                {putData.map((round) => {
                  return <PutItem key={uuidv4()} round={round} handleDeletePut={handleDeletePut} />;
                })}
              </PutList>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Puts;
