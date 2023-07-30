import Typewriter from "typewriter-effect";
import "./Screen.css";

function Screen({ moves, status, typeStrings, location }) {
  //   const type = document.getElementById("typewriter");
  //   const instance = new Typewriter(type, {
  //     autoStart: true,
  //     loop: true,
  //     delay: 80,
  //   });

  //   instance
  //     .pauseFor(2500)
  //     .typeString("A simple yet powerful native javascript")
  //     .pauseFor(300)
  //     .deleteChars(10)
  //     .typeString("<strong>JS</strong> plugin for a cool typewriter effect and ")
  //     .typeString(
  //       '<strong>only <span style="color: #27ae60;">5kb</span> Gzipped!</strong>'
  //     )
  //     .pauseFor(1000)
  //     .start();

  return (
    <div className={"screen"}>
      {status === "inMaze" ? (
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
