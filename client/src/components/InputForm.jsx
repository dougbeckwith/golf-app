import React from "react";
import InputField from "./InputField";
import Button from "./Button";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

const InputForm = ({
  error,
  putsPerRound,
  onInputChange,
  createRoundsOfPuts,
  isAddRoundDisabled
}) => {
  return (
    <form className="bg-dark-300 py-5 px-6 rounded-md flex flex-col max-w-[400px]">
      <InputLabel htmlFor={"putsPerRound"}>Puts Per 18 Holes</InputLabel>
      <InputField value={putsPerRound} onChange={onInputChange} putsPerRound={putsPerRound} />
      {error && <InputError>{error}</InputError>}
      <Button disabled={isAddRoundDisabled()} onClick={createRoundsOfPuts}>
        Add Round
      </Button>
    </form>
  );
};

export default InputForm;
