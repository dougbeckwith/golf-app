import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { GiGolfTee } from "react-icons/gi";
import Chart from "../components/Chart";
import PutList from "../components/PutList";
import PutItem from "../components/PutItem";
import { getAveragePutsPerRound, isNumeric } from "../helpers";

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
      try {
        let putsData = [];

        const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

        const options = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        };

        const response = await fetch(`${process.env.REACT_APP_URL}/puts`, options);

        if (response.status === 200) {
          putsData = await response.json();
          console.log(putsData);
          setPutData(putsData);
          setChartData(putsData.slice(putsData.length - 30, putsData.length));
        } else if (response.status === 401) {
          navigate("/signin");
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }

        if (putsData.length !== 0) {
          setAvgPutsPerRound(getAveragePutsPerRound(putsData));
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllPuts();

    // eslint-disable-next-line
  }, []);

  const handleCreateRoundOfPuts = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    let dateCreated = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`
      },
      body: JSON.stringify({
        puts: +putsPerRound,
        dateCreated,
        user: authUser._id
      })
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/puts`, options);

      if (response.status === 201) {
        const { putId } = await response.json();

        setPutData((prev) => {
          const puts = [
            ...prev,
            {
              puts: +putsPerRound,
              dateCreated,
              user: authUser._id,
              _id: putId
            }
          ];
          const average = getAveragePutsPerRound(puts);
          setAvgPutsPerRound(average);
          return puts;
        });
        setPutsPerRound("");
      } else if (response.status === 400) {
        const { errors } = await response.json();
        setError(errors[0]);
      } else if (response.status === 500) {
        setError("Server Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    setPutsPerRound(value);
    validateInput(e);
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

  const handleDeletePut = async (id) => {
    console.log(id);
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${encodedCredentials}`
        }
      };

      const response = await fetch(`${process.env.REACT_APP_URL}/puts/${id}`, options);
      console.log(response);

      if (response.status === 204) {
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
      } else {
        setError("Server Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAddRoundDisabled = () => {
    //to do disable button if
  };

  return (
    <>
      <div className="w-full bg-dark-500 text-gray-500 min-h-screen max-h-min ">
        <div className="container m-auto xl:pt-16 px-3">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <div className="flex md:flex-row flex-col md:items-center pt-3 pb-5 w-full">
                <h1 className="text-gray-400 text-2xl font-semibold">Puts</h1>
              </div>
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
                <form className="mb-2 flex flex-col py-5 px-6 rounded-md bg-dark-300">
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
                    onClick={handleCreateRoundOfPuts}
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
