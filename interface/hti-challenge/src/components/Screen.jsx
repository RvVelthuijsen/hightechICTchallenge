import Typewriter from "typewriter-effect";
import player from "../assets/player.png";
import "./Screen.css";

function Screen({ moves, status, typeStrings, location }) {
  return (
    <div className={"screen"}>
      {status === "inMaze" ? (
        <div className="maze-section">
          <div className="img-container">
            <img src={player} width={"70px"} height={"70px"} />
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
            <p style={{ margin: 0 }}>
              Current score in hand: {location.currentScoreInHand}
            </p>
            <p style={{ margin: 0 }}>
              Current score in bag: {location.currentScoreInBag}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Screen;
