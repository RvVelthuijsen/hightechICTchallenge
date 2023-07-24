require("dotenv").config();
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
const API = "https://maze.hightechict.nl";
const playerName = prompt("What is your name?");

//FUNCTIONS
const registerPlayer = async () => {
  await fetch(`${API}/api/player/register?name=${playerName}`, {
    method: "POST",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

const forgetPlayer = async () => {
  await fetch(`${API}/api/player/forget`, {
    method: "DELETE",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      return response;
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

//EXECUTION
// registerPlayer();
forgetPlayer();
