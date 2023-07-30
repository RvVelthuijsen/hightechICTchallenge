import { useState } from "react";
import Controls from "../components/Controls";
import Screen from "../components/Screen";
import { registerPlayer } from "../utils/registerPlayer";
import { enterMaze } from "../utils/enterMaze";
import { makeMove } from "../utils/makeMove";
import { collectScore } from "../utils/collectScore";
import { exitMaze } from "../utils/exitMaze";
import "./Maze.css";

function Maze() {
  const [moves, setMoves] = useState([
    { direction: "Up" },
    { direction: "Down" },
    { direction: "Left" },
    { direction: "Right" },
  ]);
  const [status, setStatus] = useState("Start");
  const [location, setLocation] = useState({});
  const [typeStrings, setTypeStrings] = useState([
    "Hi, welcome to the A-maze-ing Race!",
    "Press Start below to get started.",
  ]);
  const [playerName, setPlayerName] = useState("");

  const updateLocation = (location) => {
    console.log(location);
    setMoves(location.possibleMoveActions);
    setLocation(location);
  };

  const startMaze = async () => {
    await registerPlayer(playerName);
    const location = await enterMaze();
    updateLocation(location);
    setStatus("inMaze");
    setTypeStrings(["Where would you like to go?"]);
  };

  const movement = async (direction) => {
    const location = await makeMove(direction);
    updateLocation(location);
  };

  const scoreCollection = async () => {
    let newLocation = await collectScore();
    updateLocation(newLocation);
  };

  const finish = async () => {
    await exitMaze();
    setStatus("Finished");
  };

  return (
    <div className="maze">
      <Screen
        moves={moves}
        status={status}
        typeStrings={typeStrings}
        location={location}
      />
      <Controls
        moves={moves}
        status={status}
        setStatus={setStatus}
        location={location}
        setTypeStrings={setTypeStrings}
        startMaze={startMaze}
        movement={movement}
        scoreCollection={scoreCollection}
        finish={finish}
        setPlayerName={setPlayerName}
      />
    </div>
  );
}

export default Maze;
