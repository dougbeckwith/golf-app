import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext";
import { GiGolfTee } from "react-icons/gi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Chart from "../components/Chart";
import PutList from "../components/PutList";
import PutItem from "../components/PutItem";
import { getDummyDataPuts, getAveragePutsPerRound } from "../helpers";

const Puts = () => {
  const navigate = useNavigate();

  const { authUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [putsPerRound, setPutsPerRound] = useState("");
  const [averagePutsPerRound, setAvgPutsPerRound] = useState([]);
  const [putData, setPutData] = useState([]);

  const [error, setError] = useState({
    totalPuts: ""
  });

  useEffect(() => {
    const rounds = getDummyDataPuts();
    setPutData(rounds);
    setAvgPutsPerRound(getAveragePutsPerRound(rounds));

    const getAllPuts = async () => {
      try {
        let putsData = [];

        const encodedCredentials = btoa(
          `${authUser.email}:${authUser.password}`
        );

        const options = {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        };

        const response = await fetch(
          `${process.env.REACT_APP_CYCLIC_URL}/puts`,
          options
        );

        if (response.status === 200) {
          // set puts state here
        } else if (response.status === 401) {
          navigate("/signin");
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
        if (putsData.length === 0) {
          setIsLoading(false);
          return;
        } else {
          // calcuate average puts per round
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getAllPuts();

    // eslint-disable-next-line
  }, []);

  const hanldeCreateRoundOfPuts = async (e) => {
    e.preventDefault();

    const putId = uuidv4();
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

    let date = new Date().toLocaleDateString("en-US", {
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
        round: { puts: putsPerRound, dateCreated: date }
      })
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/puts`,
        options
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    setPutsPerRound(value);
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;

    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };
      switch (name) {
        case "putsPerRound":
          if (!value) {
            stateObj[name] = "Please enter a number of puts.";
          }
          if (!/^\d+$/.test(value)) {
            stateObj[name] = "Please enter a valid number.";
          }
          if (+value >= 100) {
            stateObj[name] = "Please enter a number less than 100.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  return (
    <>
      <div className="w-full bg-dark-500 text-gray-500 min-h-screen max-h-min ">
        <div className="container m-auto pt-4 xl:pt-16 px-3 sm:px-0">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <div className="flex md:flex-row flex-col items-center pt-3 pb-5 w-full">
                <div className="flex items-center pb-2 text-gray-400">
                  <h1 className="text-gray-400 text-2xl font-semibold">
                    Putting
                  </h1>
                </div>
              </div>
              <Chart putData={putData} className="w-[500px]" />
              <div className="pt-10">
                <div className="w-full flex flex-col sm:flex-row">
                  <form className=" min-w-[400px] mb-2  flex flex-col py-5 px-6 rounded-md bg-dark-300">
                    <div className="pb-1 pl-1 flex items-center">
                      <label htmlFor="totalCarry" className="text-lg mr-1">
                        Total Puts{" "}
                        <span className="text-xs">
                          (<span className="ml-[2px] mr-[2px]">18 Holes</span>)
                        </span>
                      </label>
                      {error.totalPuts.length === 0 && putsPerRound !== "" && (
                        <IoCheckmarkCircleOutline
                          className={"text-green-500"}
                        />
                      )}
                    </div>
                    <input
                      name="putsPerRound"
                      value={putsPerRound}
                      onBlur={validateInput}
                      onChange={onInputChange}
                      className={`${
                        error.totalPuts
                          ? `bg-dark-200   w-full p-3 rounded-md border-2 border-pink-400 focus:outline-none focus:border-blue-400`
                          : `bg-dark-200   w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400`
                      }`}
                    />
                    <div className="flex items-center pt-1 pl-1">
                      {error.totalPuts && (
                        <p className="h-full text-pink-400 text-xs pr-1">
                          {error.totalPuts}
                        </p>
                      )}
                    </div>

                    <button
                      // disabled={isAddShotDisabled()}
                      type="submit"
                      onClick={hanldeCreateRoundOfPuts}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 ">
                      Add Round
                    </button>
                  </form>
                  <div className="w-full flex items-center pb-2 lg:justify-center ">
                    <div className="w-[75px] h-[75px]  flex justify-center items-center rounded-md">
                      <GiGolfTee size={40} color="#d1d5db" />
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-400 text-sm">
                        Avg Puts Per Round
                      </p>
                      <div className="text-blue-400 text-xl font-bold flex">
                        <span>{averagePutsPerRound}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="pt-10 text-2xl text-gray-400">Putting Rounds</h1>
                {isLoading ? (
                  <div>Loading Puts</div>
                ) : (
                  <PutList>
                    {putData.map((round) => {
                      return <PutItem key={uuidv4()} round={round} />;
                    })}
                  </PutList>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* <Alert show={show} setShow={setShow} message={message} navTo={navTo} /> */}
    </>
  );
};

export default Puts;
