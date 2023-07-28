// IMPORTS
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
const playerName = prompt("What is your name?");

//FUNCTIONS
const registerPlayer = async () => {
  await fetch(`${process.env.API}/api/player/register?name=${playerName}`, {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY,
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 202) {
        return `Registering user was ${response.statusText}`;
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

//EXECUTION
registerPlayer();
