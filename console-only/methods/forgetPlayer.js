// VARIABLES

//FUNCTION
const forgetPlayer = async () => {
  await fetch(`${process.env.API}/api/player/forget`, {
    method: "DELETE",
    headers: {
      "Authorization": process.env.API_KEY,
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 202) {
        return `Forgetting user was ${response.statusText}`;
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
forgetPlayer();
