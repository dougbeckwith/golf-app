import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Clubs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getHandicapData = async () => {
      try {
        console.log("get handicap data");
      } catch (err) {
        console.log(err);
      }
    };

    getHandicapData();

    // eslint-disable-next-line
  }, []);

  const handleClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  return (
    <>
      <div className="px-5 lg:px-0 md:pt-7 w-full bg-dark-500 min-h-screen max-h-min">
        <div className="container m-auto">
          <div className="pb-10 ">
            <h1 className="text-gray-400 text-center mx-auto max-w-4xl font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Coming Soon!
            </h1>
            <h1 className="text-gray-500 text-center mx-auto max-w-4xl font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Add scores to track your handicap.
            </h1>
          </div>

          <div className="w-full flex items-center mb-3 ">
            {/* <h1 className="text-gray-400 text-2xl font-semibold">Handicap</h1>
            <div className="ml-auto">
              <Link to="/handicap/new">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-blue-400 hover:bg-blue-300 ">
                  Add Score
                </button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clubs;
