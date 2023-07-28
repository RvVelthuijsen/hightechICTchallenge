// RUN WITH "NPM RUN START" COMMAND

// IMPORTS
require("dotenv").config();
// full api address and api key stored in .env file

// VARIABLES
let allMazes = [];
let location = {};
let directionPairs = {
  Up: { counter: "Down", tag: 1 },
  Down: { counter: "Up", tag: 2 },
  Right: { counter: "Left", tag: 3 },
  Left: { counter: "Right", tag: 4 },
};
// above variable stores the "counter" direction (if we just went up, going down would put us where we were etc.) and the number to tag for each direction
let move = "";
let inMaze = false;
let currentMaze = {};
let currentScoreInHand = 0;
let currentScoreInBag = 0;
let totalScore = 0;
let pathToExit = [];
let canExit = false;
let exitFound = false;

// FUNCTIONS

// Function to fetch all mazes to select maze from
const fetchAllMazes = async () => {
  console.log("Fetching mazes");
  await fetch(`${process.env.API}/api/mazes/all`, {
    method: "GET",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log("Fetching complete. All mazes:");
      allMazes = data;
      console.log(allMazes);
    })
    .catch((error) => console.error(error));
};

// Function to fetch movementOptions, should data get lost or script be run without first forgetting and registering player
const fetchLocation = async () => {
  console.log("entering");
  await fetch(`${process.env.API}/api/maze/possibleActions`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log("MoveOptions are:");
      console.log(data.possibleMoveActions);
    })
    .catch((error) => console.error(error));
};

// Function to enter Maze
const enterMaze = async (mazeName) => {
  currentMaze = allMazes.find((maze) => maze.name === mazeName);
  totalScore = currentMaze.potentialReward;
  console.log(`Entering new maze: ${mazeName}`);

  await fetch(`${process.env.API}/api/mazes/enter?mazeName=${mazeName}`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log(data);
      location = data;
      inMaze = true;
      console.log("Entered maze");
    })
    .catch((error) => console.error(error));
};

//Function to exit Maze
const exitMaze = async () => {
  console.log("Exiting maze");
  await fetch(`${process.env.API}/api/maze/exit`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // getting json parse error, so handling like this
        console.log(response);
        location = {};
        currentScoreInBag = 0;
        currentScoreInHand = 0;
        // pathToExit = [];
        // canExit = false;
        // exitFound = false;
        // inMaze = false;
        // totalScore = 0;
        console.log("Maze exited");
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .catch((error) => console.error(error));
};

// Function to collect score, resets currentScoreInHand funtion to 0 if succesfull
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
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log(
        `Nice! ${currentScoreInHand} added to bag! Total score in bag is now ${data.currentScoreInBag}`
      );
      currentScoreInHand = 0;
      if (data.currentScoreInBag === totalScore) {
        console.log(
          "We've added all available score to our bag. We are now able to exit!"
        );
        canExit = true;
      }
    })
    .catch((error) => console.error(error));
};

// Function to tag tile with direction we go in
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
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      console.log(`Tile was tagged ${data.tagOnCurrentTile}`);
    })
    .catch((error) => console.error(error));
};

// Move selection funtion
const chooseMove = async () => {
  // Looking to see if any surrounding tiles is an exit
  let exitHere = location.possibleMoveActions.find(
    (option) => option.allowsExit === true
  );
  // If yes, flag as exit found and set the route to the exit as one step into that direction
  if (exitHere != undefined) {
    console.log("We found an exit, let's remember that!");
    exitFound = true;
    pathToExit = [exitHere.direction];
  }

  // If we can exit and know the path to exit, retrace steps
  if (canExit && exitFound) {
    console.log("We can leave and know the way, let's go!");
    // setting move direction to first option in path array and removing that option
    move = pathToExit.shift();
    console.log(pathToExit);
    return;
  }

  // if there's only one move, go here
  if (location.possibleMoveActions.length === 1) {
    console.log("There is only one move possible");
    move = location.possibleMoveActions[0].direction;
    if (exitFound) {
      // if we aren't going to an exit tile, but we have found the exit (before), we're adding the counter to our move to the start of the path array, to retrace
      pathToExit = [directionPairs[move].counter, ...pathToExit];
      console.log(pathToExit);
    }
    return;
  }

  // Creating variables to work with
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
    console.log("There is only one move possible");
    move = moveOptions[0].direction;
    if (exitFound) {
      // if we aren't going to an exit tile, but we have found the exit (before), we're adding the counter to our move to the start of the path array, to retrace
      pathToExit = [directionPairs[move].counter, ...pathToExit];
      console.log(pathToExit);
    }
    return;
  }

  // Checking if there's a tag on current tile which corresponds to the direction we went to last time we visited and saving it in taggedTile variable
  if (location.tagOnCurrentTile != null) {
    console.log("A tag was detected");
    taggedTile = moveOptions.find(
      (option) =>
        location.tagOnCurrentTile === directionPairs[option.direction].tag
    );
  }

  // If none of the above cases, iterate over options to find best match
  for (const i of moveOptions) {
    console.log(`Reward is ${i.rewardOnDestination}`);
    if (i.rewardOnDestination > 0) {
      console.log("Score! We need to go this way");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.canCollectScoreHere && currentScoreInHand > 0) {
      console.log("We need to collect score here");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.canExitMazeHere && currentScoreInBag === totalScore) {
      console.log("We need to exit maze here");
      move = i.direction;
      moveSelected = true;
      break;
    } else if (i.hasBeenVisited === false) {
      console.log(
        "This is the first tile that has not been visited before, let's go"
      );
      move = i.direction;
      moveSelected = true;
      break;
    } else if (taggedTile && i.direction === taggedTile.direction) {
      console.log("We went here before, skipping");
      continue;
    }

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
      "All checks failed, going with random option we haven't been before"
    );
    let randomOption = Math.floor(Math.random() * moveOptions.length);
    console.log(`Random option selected: ${randomOption}`);
    move = moveOptions[randomOption].direction;
  }

  if (move === exitHere?.direction) {
    // if we are going to a tile which is an exit, path to exit becomes empty. we're there
    pathToExit = [];
  } else if (exitFound) {
    // if we aren't going to an exit tile, but we have found the exit (before), we're adding the counter to our move to the start of the path array, to retrace
    pathToExit = [directionPairs[move].counter, ...pathToExit];
    console.log(pathToExit);
  }

  // tagging tile
  console.log(
    `Going ${move}. Tagging tile for future reference. Next time we come here we should not go here again`
  );
  await tagTile(directionPairs[move].tag);
};

// Function to make the api call for movement, awaits move selection (necessary to await because on chooseMove we make an api call to tag)
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
      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => {
      location = data;
      currentScoreInHand = data.currentScoreInHand;
      currentScoreInBag = data.currentScoreInBag;
      // if (location.canExitMazeHere){
      //   pathToExit.unshift(directionPairs[move].counter)
      // }
    })
    .catch((error) => console.error(error));
};

// It's easier to follow in console with slight delay, adding timer of 3 sec before making next move
const timer = (delay) => {
  return new Promise((stop) => setTimeout(stop, delay));
};
const wait = async () => {
  console.log("Catching breath...");
  await timer(3000);
};

// This is the main gameloop which takes care of the full inital maze setup and loop
const gameLoop = async () => {
  console.log("Start");
  await fetchAllMazes();

  // Looping over all mazes in attempt to clear all
  for (const maze of allMazes) {
    await enterMaze(maze.name);
    console.log(currentMaze);
    if (!location.possibleMoveActions) {
      await fetchLocation();
    }
    console.log(`In maze is ${inMaze}`);
    let i = 1;
    do {
      console.log(`Loop ${i}`);
      if (location.canCollectScoreHere && currentScoreInHand != 0) {
        await collectScore();
      } else if (location.canExitMazeHere && canExit) {
        await exitMaze();
        console.log(`Maze was completed in ${i} turns!`);
        break;
      }
      await wait();
      console.log("MoveOptions are:");
      console.log(location.possibleMoveActions);
      console.log(
        `Current status: ${currentScoreInHand} in hand and ${currentScoreInBag} in bag`
      );
      await movement();
      i++;
    } while (inMaze);
    // while doesn't do much if using inMaze (break before it's set to false), breaking
  }
};

// EXECUTION
gameLoop();
