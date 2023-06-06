import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Landing = () => {
  const navigate = useNavigate();

  const { authUser, actions } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAwake, setIsServerAwake] = useState(false);

  useEffect(() => {
    const startBackend = async () => {
      try {
        // send request right away to wake up server
        await fetch(`${process.env.REACT_APP_CYCLIC_URL}`);
        setIsServerAwake(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (authUser) {
      setIsServerAwake(true);
    } else {
      startBackend();
    }
    // eslint-disable-next-line
  }, []);

  const handleDemoSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = {
      email: "demouser@gmail.com",
      password: "password"
    };

    try {
      if (!isServerAwake) {
        alert(
          "Waiting for server to wake up. Please allow 30-45 seconds to sign in."
        );
      }

      const { user, errors } = await actions.signIn(credentials);

      if (user) {
        navigate("/clubs");
      } else if (errors) {
        alert(errors);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isButtonDisabled = () => {
    if (isLoading) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="bg-dark-500 h-screen flex justify-center items-center">
      <div className="pt-20 pb-16 text-center text-gray-400 lg:pt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl md:7xl">
          Golf stats{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none">
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative text-blue-400">made simple</span>
          </span>{" "}
          for golfers.
        </h1>
        <p className="pt-10 mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-500">
          Play the game your way. Easily track your golf data to remove strokes
          from your game. Dive deep into your golf game.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          {authUser ? (
            <Link to="/clubs">
              <button className="px-4 py-2 md:px-7 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300">
                Home Page
              </button>
            </Link>
          ) : (
            <>
              <div className="flex gap-2 md:gap-6">
                <Link to="/signin">
                  <button
                    disabled={isButtonDisabled()}
                    className="px-4 py-2 md:px-7 text-sm font-medium rounded-md shadow-sm text-dark-400 bg-gray-500 hover:bg-gray-400">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    disabled={isButtonDisabled()}
                    className="px-4 py-2 md:px-7 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300">
                    Sign Up
                  </button>
                </Link>{" "}
              </div>
            </>
          )}
        </div>
        {!authUser && (
          <>
            <p className="pt-10 pb-3 mx-auto max-w-2xl text-lg tracking-tight text-gray-500">
              Warning server may be sleeping and may take some time to sign in.
              After 30-45 seconds it will take you to the demo account.
            </p>
            <Link to="/clubs">
              <button
                disabled={isButtonDisabled()}
                onClick={handleDemoSignIn}
                className="px-4 py-2 md:px-7 text-sm font-medium rounded-md shadow-sm text-dark-400 bg-gray-500 hover:bg-gray-400">
                Try Demo
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Landing;
