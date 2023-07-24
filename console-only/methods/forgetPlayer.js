// require("dotenv").config();

// VARIABLES
const API = "https://maze.hightechict.nl";

//FUNCTION
const forgetPlayer = async () => {
  console.log(process.env.API_KEY);
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
forgetPlayer();
