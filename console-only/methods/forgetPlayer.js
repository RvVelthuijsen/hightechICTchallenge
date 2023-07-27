// VARIABLES

//FUNCTION
const forgetPlayer = async () => {
  await fetch(`${process.env.API}/api/player/forget`, {
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