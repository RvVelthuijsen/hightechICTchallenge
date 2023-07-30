// VARIABLES

//FUNCTIONS
const playerInfo = async () => {
  await fetch(`${import.meta.env.VITE_API}/api/player`, {
    method: "GET",
    headers: { "Authorization": import.meta.env.VITE_API_KEY },
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
