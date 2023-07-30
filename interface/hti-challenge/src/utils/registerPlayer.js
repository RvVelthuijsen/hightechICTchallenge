// IMPORTS

// VARIABLES

//FUNCTIONS
const registerPlayer = async (givenName) => {
  await fetch(
    `${import.meta.env.VITE_API}/api/player/register?name=${givenName}`,
    {
      method: "POST",
      headers: { "Authorization": import.meta.env.VITE_API_KEY },
    }
  )
    .then((response) => {
      console.log(response);
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

export { registerPlayer };
