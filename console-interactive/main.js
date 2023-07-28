// IMPORTS
import dotenv from "dotenv";
dotenv.config;
import inquirer from "inquirer";
import registerPlayer from "./methods/registerPlayer";

//VARIABLES
let allMazeData = [];
let mazeNameList;
let playerName;
let selectedMaze = {};
let location = {};

// FUNCTIONS
const fetchAllMazes = async () => {
  console.log("Fetching mazes");
  let mazeNameList = [];
  await fetch(`${process.env.API}/api/mazes/all`, {
    method: "GET",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Fetching complete");
      allMazeData = data;
      return data;
    })
    .then((mazes) => {
      mazeNameList = mazes.map((maze) => {
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
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      location = data;
      console.log("entered");
    })
    .catch((error) => console.error(error));
};

const intitialise = async () => {
  const questions = [
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
  ];

  inquirer
    .prompt([questions])
    .then((answers) => {
      console.log("\nThank you, here are your answers:");
      console.log(JSON.stringify(answers, null, "  "));
      selectedMaze = allMazeData.find(
        (maze) => maze.name === answers.mazeSelection
      );
      console.log(selectedMaze);
      playerName = answers.name;
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
        // Prompt couldn't be rendered in the current environment
      } else {
        console.error(error);
        // Something else went wrong
      }
    });
};

const gameLoop = async () => {
  console.log("Hi, welcome to the A-maze-ing Race.");
  mazeNameList = await fetchAllMazes();
  await intitialise();
  await registerPlayer(playerName);
  await enterSelectedMaze();

  // if (!location.possibleMoveActions) {
  //   await fetchLocation();
  // }
  // console.log(`In maze is ${inMaze}`);

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
