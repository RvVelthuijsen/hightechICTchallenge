// IMPORTS
const prompt = require("prompt-sync")({ sigint: true });

// VARIABLES
const playerName = prompt("What is your name?");

//FUNCTIONS
const registerPlayer = async (givenName) => {
  const nameToRegsiter = givenName ? givenName : playerName;
  await fetch(`${process.env.API}/api/player/register?name=${nameToRegsiter}`, {
    method: "POST",
    headers: { "Authorization": process.env.API_KEY },
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

export default registerPlayer;
