// IMPORTS
import inquirer from "inquirer";
import { registerPlayer } from "./methods/registerPlayer.js";

//VARIABLES
let allMazeData = [];
let mazeNameList;
let playerName;
let selectedMaze = {};
let location = {};
let move = "";
let currentScoreInHand = 0;
let currentScoreInBag = 0;
let totalScore = 0;
let canExit = false;
let inMaze = false;

// FUNCTIONS
const fetchAllMazes = async () => {
  //   console.log("Fetching mazes");
  let mazeNameList = [];
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
      //   console.log("Fetching complete");
      allMazeData = data;
      mazeNameList = data.map((maze) => {
        return maze.name;
      });
    })
    .catch((error) => console.error(error));
  return mazeNameList;
};

const enterSelectedMaze = async () => {
  totalScore = selectedMaze.potentialReward;
  await fetch(
    `${process.env.API}/api/mazes/enter?mazeName=${selectedMaze.name}`,
    {
      method: "POST",
      headers: {
        "Authorization": process.env.API_KEY,
      },
    }
  )
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
      //   console.log(data);
      location = data;
      inMaze = true;
      console.log(`You have entered the ${selectedMaze.name} maze. Good luck!`);
    })
    .catch((error) => console.error(error));
};

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
        location = {};
        currentScoreInBag = 0;
        currentScoreInHand = 0;
        canExit = false;
        totalScore = 0;
        inMaze = false;
        console.log("Maze exited");
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .catch((error) => console.error(error));
};

const collectScore = async () => {
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
        `Nice! ${currentScoreInHand} added to your bag! Your total score in bag is now ${data.currentScoreInBag}`
      );
      currentScoreInHand = 0;
      currentScoreInBag = data.currentScoreInBag;
      if (currentScoreInBag === totalScore) {
        console.log(
          "You've added all available score to our bag, so you are now able to exit!"
        );
        canExit = true;
      }
    })
    .catch((error) => console.error(error));
};

const intitialise = async () => {
  console.log("Initialising");
  const choices = await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What's your name?",
        validate(value) {
          const pass = value.match(/^[a-zA-Z]+$/i);
          if (pass) {
            return true;
          } else {
          }
          return "Please enter a valid name";
        },
      },
      {
        type: "list",
        name: "mazeSelection",
        message: "Which maze would you like to play?",
        choices: mazeNameList,
      },
    ])
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
        // Prompt couldn't be rendered in the current environment
      } else {
        console.error(error);
        // Something else went wrong
      }
    });

  console.log(
    `\nThank you ${choices.name}, we'll set everything up and get you started.`
  );
  selectedMaze = allMazeData.find(
    (maze) => maze.name === choices.mazeSelection
  );
  playerName = choices.name;
  return choices;
};
const chooseMove = async () => {
  const movementOptions = location.possibleMoveActions.map((option) => {
    // switch (true) {
    //   case option.allowsExit:
    //     console.log(`You can go ${option.direction} Here you can exit if you've collected all available score.`);
    //   case option.allowsScoreCollection:
    //     console.log(`${option.direction} allows you to collect your score.`);
    //   case option.rewardOnDestination > 0:
    //     console.log(
    //       `${option.direction} has a reward: ${option.rewardOnDestination}.`
    //     );
    //   default:
    //     console.log(`${option.direction} has nothing special.`);
    // }

    console.log(
      `You can go ${option.direction}. Here you ${
        option.allowsExit ? "can" : "cannot"
      } exit, you ${
        option.allowsScoreCollection ? "can" : "cannot"
      } cache in your score, and you can collect ${
        option.rewardOnDestination
      } score.`
    );

    return option.direction;
  });
  const choices = await inquirer
    .prompt([
      {
        type: "list",
        name: "move",
        message: "Which way would you like to go in?",
        choices: movementOptions,
      },
    ])
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
        // Prompt couldn't be rendered in the current environment
      } else {
        console.error(error);
        // Something else went wrong
      }
    });
  move = choices.move;
  return choices;
};

const movement = async () => {
  await chooseMove();
  console.log(`Alright, going ${move}!`);
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
      if (currentScoreInBag === totalScore) {
        canExit = true;
      }
    })
    .catch((error) => console.error(error));

  console.log(
    `You went ${move}. You are now holding ${currentScoreInHand} score in hand and ${currentScoreInBag} score in bag. The total score here is ${totalScore}`
  );

  if (location.canExitMazeHere && canExit) {
    console.log("You have all the available point and you can exit here.");
    await exitMaze();
    return;
  } else if (location.canCollectScoreHere && currentScoreInHand > 0) {
    const choices = await inquirer
      .prompt([
        {
          type: "confirm",
          name: "shouldCollectScore",
          message:
            "You can collect your score in hand here. Would you like to?",
          default: false,
          transformer: (answer) => (answer ? "👍" : "👎"),
        },
      ])
      .catch((error) => {
        if (error.isTtyError) {
          console.error(
            "Prompt couldn't be rendered in the current environment"
          );
          // Prompt couldn't be rendered in the current environment
        } else {
          console.error(error);
          // Something else went wrong
        }
      });
    if (choices.shouldCollectScore) {
      await collectScore();
    }
  }
  movement();
};

const gameLoop = async () => {
  console.log("Hi, welcome to the A-maze-ing Race.");
  mazeNameList = await fetchAllMazes();
  await intitialise();
  await registerPlayer(playerName);
  await enterSelectedMaze(selectedMaze.name);
  const loader = [
    "/ Installing",
    "| Installing",
    "\\ Installing",
    "- Installing",
  ];
  let i = 4;
  const ui = new inquirer.ui.BottomBar({ bottomBar: loader[i % 4] });
  const interval = setInterval(() => {
    ui.updateBottomBar(loader[i++ % 4]);
  }, 300);
  clearInterval(interval);

  console.log(
    "You find yourself in a new maze. Take a look around, what are your options?"
  );
  await movement();

  if (!inMaze) {
    console.log("Nice you've completed a maze!");

    const reset = await inquirer
      .prompt([
        {
          type: "confirm",
          name: "continue",
          message: "Would you like to play another one?",
          default: false,
          transformer: (answer) => (answer ? "👍" : "👎"),
        },
      ])
      .catch((error) => {
        if (error.isTtyError) {
          console.error(
            "Prompt couldn't be rendered in the current environment"
          );
          // Prompt couldn't be rendered in the current environment
        } else {
          console.error(error);
          // Something else went wrong
        }
      });
    if (reset.continue) {
      await intitialise();
    } else {
      console.log(`Okay, thank you for playing ${playerName}`);
    }
  }
};

// EXECUTION
gameLoop();
