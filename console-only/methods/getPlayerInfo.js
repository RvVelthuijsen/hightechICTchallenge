// VARIABLES

//FUNCTIONS
const playerInfo = async () => {
  await fetch(`${process.env.API}/api/player`, {
    method: "GET",
    headers: { "Authorization": process.env.API_KEY },
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

//EXECUTION
playerInfo();
