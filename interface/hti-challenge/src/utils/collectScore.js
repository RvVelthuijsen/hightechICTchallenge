// VARIABLES

//FUNCTION
const collectScore = async () => {
  let toReturn = await fetch(
    `${import.meta.env.VITE_API}/api/maze/collectScore`,
    {
      method: "POST",
      headers: { "Authorization": import.meta.env.VITE_API_KEY },
    }
  )
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response.json();
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

export { collectScore };
