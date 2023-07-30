import Typewriter from "typewriter-effect";
import player from "../assets/player.png";
import "./Screen.css";

function Screen({ moves, status, typeStrings, location }) {
  return (
    <div className={"screen"}>
      {status === "inMaze" ? (
        <div style={{ position: "relative" }}>
          <img
            src={player}
            width={"70px"}
            height={"70px"}
            style={{
              position: "absolute",
              margin: "auto",

              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              textAlign: "center",
            }}
          />
          <div className={"tile-grid"}>
            <div className={"tile"}></div>
            {moves.map((move) => {
              return (
                <div
                  key={move.direction}
                  className={`tile-option-${move.direction.toLowerCase()}`}
                >
                  <p>{move.rewardOnDestination}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="placeholder"></div>
      )}

      <Typewriter
        options={{
          strings: typeStrings,
          autoStart: true,
          loop: true,
          delay: 75,
        }}
      />
      <div className="bottom-bar">
        {status === "inMaze" ? (
          <>
            <p>Current score in hand: {location.currentScoreInHand}</p>
            <p>Current score in bag: {location.currentScoreInBag}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Screen;
