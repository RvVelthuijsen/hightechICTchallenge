// IMPORTS
require("dotenv").config();
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
let allMazes = [];
let location = {};
let directions = ["Up", "Down", "Right", "Left"];
let move = directions[1];
let inMaze = false;
let currentMaze = {
  name: "Example Maze",
  totalTiles: 17,
  potentialReward: 104,
};
// let currentMaze = {};
let currentScoreInHand = 0;
let currentScoreInBag = 0;
let totalScore = 0;

// FUNCTIONS
const fetchAllMazes = async () => {
  console.log("fetching");
  await fetch(`${process.env.API}/api/mazes/all`, {
    method: "GET",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      allMazes = data;
      console.log(allMazes);
      console.log("fetching done");
    })
    .catch((error) => console.error(error));
};

const fetchLocation = async () => {
  console.log("entering");
  await fetch(`${process.env.API}/api/maze/possibleActions`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      location = data;
    })
    .catch((error) => console.error(error));
};

const enterTestmaze = async () => {
  //   currentMaze = allMazes.find((maze) => (maze.name = "Example Maze"));
  currentMaze = allMazes[6];
  totalScore = allMazes[6].potentialReward;

  // set up a way to choose maze (inquirer package)

  await fetch(`${process.env.API}/api/mazes/enter?mazeName=Example Maze`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      location = data;
      inMaze = true;
      console.log("entered");
    })
    .catch((error) => console.error(error));
};

const exitTestmaze = async () => {
  console.log("Exiting maze");
  await fetch(`${process.env.API}/api/maze/exit`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      console.log(response.status);
      return response;
    })
    .then((data) => {
      console.log(data);
      location = data;
      inMaze = false;
    })
    .catch((error) => console.error(error));
};

const collectScore = async () => {
  console.log("Collecting score");
  await fetch(`${process.env.API}/api/maze/collectScore`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log(`Nice! ${location.currentScoreInHand} added to bag!`);
        // add multiple lines if score added is 0; all total (add hand and bag together?)
        currentScoreInHand = 0;
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};

const chooseMove = () => {
  for (const i of location.possibleMoveActions) {
    // console.log(location.possibleMoveActions[i]);
    console.log(`Reward is ${i.rewardOnDestination}`);
    if (i.rewardOnDestination > 0) {
      console.log("we need to go this way");
      move = i.direction;
      break;
    } else if (i.canCollectScoreHere && currentScoreInHand > 0) {
      console.log("we need to collect score here");
      move = i.direction;
      break;
    } else if (i.canExitMazeHere && currentScoreInBag === totalScore) {
      console.log("we need to exit maze here");
      move = i.direction;
      break;
    } else {
      const notVisited = location.possibleMoveActions.find(
        (moveAction) => moveAction.hasBeenVisited === false
      );
      if (notVisited) {
        move = notVisited.direction;
      } else {
        move = location.possibleMoveActions[0].direction;
      }

      // not a catch all... add another break case
    }
  }
};

const movement = async () => {
  console.log("Starting move");
  chooseMove();
  console.log(`Going ${move}`);
  await fetch(`${process.env.API}/api/maze/move?direction=${move}`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      location = data;
      currentScoreInHand = data.currentScoreInHand;
      currentScoreInBag = data.currentScoreInBag;
      console.log(data);
    })
    .catch((error) => console.error(error));
};

const timer = (delay) => {
  return new Promise((stop) => setTimeout(stop, delay));
};

const wait = async () => {
  await timer(1000);
  console.log("Catching breath");
};

const gameLoop = async () => {
  console.log("start");
  await fetchAllMazes();
  await enterTestmaze();
  console.log(currentMaze);
  console.log(location.possibleMoveActions);
  if (!location.possibleMoveActions) {
    await fetchLocation();
  }
  console.log(`In maze is ${inMaze}`);

  // for (let i = 0; i < currentMaze.totalTiles; i++) {
  //   console.log(`Loop ${i}`);
  //   // if (location.canCollectScoreHere) {
  //   //   collectScore();
  //   // } else if (location.canExitMazeHere) {
  //   //   exitTestmaze();
  //   // } else {
  //   //   await movement();
  //   // }

  //   await movement();
  // }
  let i = 1;
  do {
    console.log(`Loop ${i}`);
    if (location.canCollectScoreHere && currentScoreInHand != 0) {
      collectScore();
    } else if (location.canExitMazeHere && currentScoreInHand === 0) {
      exitTestmaze();
      console.log("Maze was completed");
      break;
    }
    await wait();
    await movement();
    i++;
  } while (i < 50);
  // while doesn't do much if using inMaze (break before is set to false), breaking
};

// EXECUTION
gameLoop();
