// IMPORTS
require("dotenv").config();
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
let allMazes = [];
let location = {};
let directionPairs = {
  Up: { counter: "Down", tag: 1 },
  Down: { counter: "Up", tag: 2 },
  Right: { counter: "Left", tag: 3 },
  Left: { counter: "Right", tag: 4 },
};
let move = "Up";
let inMaze = false;
// let currentMaze = {
//   name: "Example Maze",
//   totalTiles: 17,
//   potentialReward: 104,
// };
let currentMaze = {};
let currentScoreInHand = 0;
let currentScoreInBag = 0;
let totalScore = 0;
// let tag = 2;

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

const tagTile = async (tag) => {
  console.log("Tagging tile");
  await fetch(`${process.env.API}/api/maze/tag?tagValue=${tag}`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log(`Tile was tagged ${0}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};

// const isMovePossible = (lastMove, possibleMove) => {
//   if (directionPairs[lastMove] === possibleMove) {
//     return false;
//   } else {
//     return true;
//   }
// };

const chooseMove = async () => {
  // if there's only one move, go here
  if (location.possibleMoveActions.length === 1) {
    console.log("only one move possible");
    move = location.possibleMoveActions[0].direction;
    return;
  }
  // Creating copy to work with
  let moveOptions = Array.from(location.possibleMoveActions);
  let taggedTile;
  let moveSelected = false;

  // If there's more than one move, I'm removing the option which goes back to where we just came from
  let moveWhichGoesBack = moveOptions.find(
    (option) => option.direction === directionPairs[move].counter
  );
  if (moveWhichGoesBack != undefined) {
    moveOptions = moveOptions.filter((option) => option != moveWhichGoesBack);
  }

  // if after this there's only one move, go here
  if (moveOptions.length === 1) {
    console.log("only one move possible");
    move = moveOptions[0].direction;
    return;
  }

  // Checking if there's a tag on current tile which corresponds to the direction we went to last time we visited.
  if (location.tagOnCurrentTile != null) {
    console.log("tag detected");
    taggedTile = moveOptions.find(
      (option) =>
        location.tagOnCurrentTile === directionPairs[option.direction].tag
    );
  }

  // iterate over options to find best match
  for (const i of moveOptions) {
    console.log(`Reward is ${i.rewardOnDestination}`);
    if (i.rewardOnDestination > 0) {
      console.log("we need to go this way");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.canCollectScoreHere && currentScoreInHand > 0) {
      console.log("we need to collect score here");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.canExitMazeHere && currentScoreInBag === totalScore) {
      console.log("we need to exit maze here");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.hasBeenVisited === false) {
      console.log(
        "this is the first tile that has not been visited before, let's go"
      );
      move = i.direction;
      moveSelected = true;
      break;
    } else if (taggedTile && i.direction === taggedTile.direction) {
      console.log("we went here before, skipping");
      continue;
    }

    // else if (move != i.direction) {
    //   console.log(`last move was ${move}`);
    //   console.log(`current option is ${i.direction}`);
    //   console.log(
    //     "all options visited, going with first option which is not the direction we have been going in"
    //   );
    //   move = i.direction;
    //   break;
    // }

    // make into case
  }

  // if none of the tiles are favourable, meaning none have score, we cannot collect or exit and we've visited them all before, we choose a random option
  if (!moveSelected) {
    // remove option we went to last if taggedTile
    if (taggedTile) {
      moveOptions = moveOptions.filter(
        (option) =>
          location.tagOnCurrentTile != directionPairs[option.direction].tag
      );
    }

    console.log(
      "all else failed, going with random option we haven't been before"
    );
    let randomOption = Math.floor(Math.random() * moveOptions.length);
    console.log(`Random option selected: ${randomOption}`);
    move = moveOptions[randomOption].direction;
  }

  console.log(
    `Going ${move}. Tagging tile for future reference. Next time we come here we should not go here again`
  );
  await tagTile(directionPairs[move].tag);

  // not a catch all... add another break case
};

const movement = async () => {
  console.log("Starting move");
  await chooseMove();
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
  console.log("Catching breath");
  await timer(3000);
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
    } else if (location.canExitMazeHere && currentScoreInBag === totalScore) {
      exitTestmaze();
      console.log("Maze was completed");
      break;
    }
    await wait();
    await movement();
    i++;
  } while (i < 80);
  // while doesn't do much if using inMaze (break before is set to false), breaking
};

// EXECUTION
gameLoop();
