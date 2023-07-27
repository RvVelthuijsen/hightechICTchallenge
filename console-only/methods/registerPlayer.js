// IMPORTS
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
const playerName = prompt("What is your name?");

//FUNCTIONS
const registerPlayer = async () => {
  await fetch(`${process.env.API}/api/player/register?name=${playerName}`, {
    method: "POST",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 202) {
        return response;
      } else {
        return response.json();
      }
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

//EXECUTION
registerPlayer();