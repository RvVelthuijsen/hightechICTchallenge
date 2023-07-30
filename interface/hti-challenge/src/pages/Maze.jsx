import { useState } from "react";
import Controls from "../components/Controls";
import Screen from "../components/Screen";
import { forgetPlayer } from "../utils/forgetPlayer";
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

  const timer = (delay) => {
    return new Promise((stop) => setTimeout(stop, delay));
  };

  const initialise = async () => {
    setStatus("Initialising");
    await forgetPlayer();
    setTypeStrings(["What is your name?"]);
  };

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
    const tiles = document.querySelector(".tile-grid");
    tiles.style.animation = `movement-${direction.toLowerCase()} 1s linear`;
    await timer(1000);
    tiles.style.animation = "";
    const newLocation = await makeMove(direction);
    if (location.currentScoreInHand < newLocation.currentScoreInHand) {
      setTypeStrings([
        `Nice, you picked up ${
          newLocation.currentScoreInHand - location.currentScoreInHand
        } points!`,
        "Where would you like to go next?",
      ]);
    } else {
      setTypeStrings(["Where would you like to go next?"]);
    }
    updateLocation(newLocation);
  };

  const scoreCollection = async () => {
    let newLocation = await collectScore();
    setTypeStrings([
      `Nice, ${location.currentScoreInHand} points added to bag!`,
      "Where would you like to go next?",
    ]);
    updateLocation(newLocation);
  };

  const finish = async () => {
    await exitMaze();
    setStatus("Finished");
    updateLocation({});
    setTypeStrings(["Thank you for playing!", "Would you like to go again?"]);
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
        location={location}
        startMaze={startMaze}
        movement={movement}
        scoreCollection={scoreCollection}
        finish={finish}
        playerName={playerName}
        setPlayerName={setPlayerName}
        initialise={initialise}
      />
    </div>
  );
}

export default Maze;
