import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AddClub = () => {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [clubBrand, setClubBrand] = useState("");
  const [nameMessage, setNameMessage] = useState(false);
  const [brandMessage, setBrandMessage] = useState(false);

  const { authUser } = useContext(UserContext);

  // Add club to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if inputs are valid
    if (inputValid(clubName) && inputValid(clubBrand)) {
      try {
        // Try to add club to database
        const response = await axios.post(
          `${process.env.REACT_APP_CYCLIC_URL}/clubs`,
          {
            clubName: clubName,
            brand: clubBrand,
            shots: [],
            totalShots: 0,
            user: authUser._id
          }
        );

        if (response.status === 200) {
          // Reset Input fields to empty strings
          setClubName("");
          setClubBrand("");
          navigateToClubs();
        } else if (response.status === 400) {
          console.log(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // Check if input is empty and set error message
  const inputValid = (input) => {
    if (input !== "") {
      return true;
    } else {
      // If input is empty string and matches clubBrand state set error message
      if (input === clubBrand) {
        setBrandMessage(true);
      }
      // If input is empty string and matches clubName state set error message
      if (input === clubName) {
        setNameMessage(true);
      }
      return false;
    }
  };
  // Update name state and remove error message
  const handleNameChange = (e) => {
    setNameMessage(false);
    setClubName(e.target.value);
  };
  // Update brand state and remove error message
  const handleBrandChange = (e) => {
    setBrandMessage(false);
    setClubBrand(e.target.value);
  };
  // Go to club page
  const navigateToClubs = () => {
    navigate("/clubs");
  };

  return (
    <>
      <div className="h-screen bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-400">
        <div className="container max-w-[600px]">
          <div className="sm:bg-dark-400 border-0 md:border-2 md:border-gray-600 px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full">
            <form>
              <div>
                <div className="pb-1 pl-1">
                  <label htmlFor="club" className="text-lg text-gray-400">
                    Club
                  </label>
                </div>
                <input
                  id="club"
                  type="text"
                  onChange={handleNameChange}
                  className="bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400"
                  placeholder="7 Iron"
                />
                <p
                  className={
                    nameMessage ? "text-sm h-4 text-red" : "invisible h-4"
                  }>
                  Please enter a club.
                </p>
              </div>
              <div className="pt-2 pb-4">
                <div className="pb-2 pl-1">
                  <label htmlFor="brand" className="text-lg">
                    Brand
                  </label>
                </div>
                <input
                  id="brand"
                  type="text"
                  onChange={handleBrandChange}
                  className="bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400"
                  placeholder="TaylorMade"
                />
                <p
                  className={
                    brandMessage ? "text-sm h-4 text-red" : "invisible h-4"
                  }>
                  Please enter a brand.
                </p>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="mt-4 w-full bg-blue-400 py-3 rounded-md hover:bg-blue-300">
                Add Club
              </button>
              <button
                onClick={navigateToClubs}
                className="mt-4 w-full btn bg-gray-500 text-dark-500 py-3 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClub;
