import "./Controls.css";

function Controls({
  moves,
  status,
  location,
  startMaze,
  movement,
  scoreCollection,
  finish,
  playerName,
  setPlayerName,
  initialise,
}) {
  return (
    <div className={"controls"}>
      {status === "Start" ? (
        <button
          onClick={async (event) => {
            await initialise();
          }}
        >
          Start
        </button>
      ) : null}
      {status === "inMaze" ? (
        <>
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
        </>
      ) : null}
      {status === "Initialising" ? (
        <form
          id="nameField"
          onSubmit={async (event) => {
            event.preventDefault();
            await startMaze();
          }}
        >
          <input
            type="text"
            name="playerName"
            value={playerName}
            onChange={(event) => {
              setPlayerName(event.target.value);
            }}
          ></input>
          <button type="submit">Go!</button>
        </form>
      ) : null}
      {status === "Finished" ? (
        <button
          onClick={async (event) => {
            await initialise();
          }}
        >
          Go Again!
        </button>
      ) : null}
    </div>
  );
}

export default Controls;
