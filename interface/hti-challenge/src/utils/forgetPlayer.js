// VARIABLES

//FUNCTION
const forgetPlayer = async () => {
  await fetch(`${import.meta.env.VITE_API}/api/player/forget`, {
    method: "DELETE",
    headers: { "Authorization": import.meta.env.VITE_API_KEY },
  })
    .then((response) => {
      console.log(response);
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
// forgetPlayer();

export { forgetPlayer };
