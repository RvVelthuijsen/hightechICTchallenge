// IMPORTS
import dotenv from "dotenv";
dotenv.config;
import inquirer from "inquirer";
import readline from "readline";
import { registerPlayer } from "./methods/registerPlayer.js";

//VARIABLES
let allMazeData = [];
let mazeNameList;
let playerName;
let selectedMaze = {};
let location = {};
let move = "";

// FUNCTIONS

const rlCreateInterface = () => {
  return readline.createInterface({
    // reset the readline Interface
    input: process.stdin,
    output: process.stdout,
  });
};

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
      console.log(`You have entered the ${selectedMaze.name} maze. Good luck!`);
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
  const choices = await inquirer
    .prompt([
      {
        type: "list",
        name: "move",
        message: "Which direction would you like to go in?",
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
      // if (location.canExitMazeHere){
      //   pathToExit.unshift(directionPairs[move].counter)
      // }
    })
    .catch((error) => console.error(error));
};

const gameLoop = async () => {
  console.log("Hi, welcome to the A-maze-ing Race.");
  mazeNameList = await fetchAllMazes();
  await intitialise();
  await registerPlayer(playerName);
  await enterSelectedMaze(selectedMaze.name);

  // let i = 1;
  // do {
  //   console.log(`Loop ${i}`);
  //   if (location.canCollectScoreHere && currentScoreInHand != 0) {
  //     collectScore();
  //   } else if (location.canExitMazeHere && currentScoreInBag === 94) {
  //     exitTestmaze();
  //     console.log("Maze was completed");
  //     break;
  //   }
  //   await wait();
  //   await movement();
  //   i++;
  // } while (i < 80);

  // while doesn't do much if using inMaze (break before is set to false), breaking
};

// EXECUTION
gameLoop();
