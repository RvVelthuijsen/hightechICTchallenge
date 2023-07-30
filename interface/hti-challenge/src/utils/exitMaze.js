// VARIABLES

//FUNCTION
const exitMaze = async () => {
  let toReturn = await fetch(`${import.meta.env.VITE_API}/api/maze/exit`, {
    method: "POST",
    headers: { "Authorization": import.meta.env.VITE_API_KEY },
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response;
      } else {
        return Promise.reject(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    })
    .catch((error) => console.error(error));
  return toReturn;
};

//EXECUTION
// forgetPlayer();

export { exitMaze };
