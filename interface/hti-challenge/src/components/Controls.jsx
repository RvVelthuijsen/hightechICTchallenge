import "./Controls.css";
import { forgetPlayer } from "../utils/forgetPlayer";

function Controls({
  moves,
  status,
  setStatus,
  location,
  setTypeStrings,
  startMaze,
  movement,
  scoreCollection,
  finish,
  setPlayerName,
}) {
  return (
    <div className={"controls"}>
      <div className="collect">
        {location.canCollectScoreHere && location.currentScoreInHand > 0 ? (
          <button
            onClick={async (event) => {
              await scoreCollection();
            }}
          >
            Collect Score
          </button>
        ) : null}
      </div>
      {status === "inMaze" ? (
        <div className={"movement-options"}>
          {moves.map((move) => (
            <button
              key={move.direction}
              className={`movement-${move.direction.toLowerCase()}`}
              onClick={async (event) => {
                await movement(move.direction);
              }}
            >
              {move.direction}
            </button>
          ))}
        </div>
      ) : null}
      {status === "Start" ? (
        <button
          onClick={async (event) => {
            await forgetPlayer();
            setStatus("Initialising");
            setTypeStrings(["What is your name?"]);
          }}
        >
          Start
        </button>
      ) : null}
      {status === "Initialising" ? (
        <form
          id="nameField"
          onSubmit={(event) => {
            event.preventDefault();
            startMaze();
          }}
        >
          <input
            type="text"
            name="playerName"
            onChange={(event) => {
              setPlayerName(event.target.value);
            }}
          ></input>
          <button type="submit">Go!</button>
        </form>
      ) : null}
      <div className="exit">
        {location.canExitMazeHere ? (
          <button
            onClick={async (event) => {
              await finish();
            }}
          >
            Exit Maze
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Controls;
