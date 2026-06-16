const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const signinForm = document.getElementById("signinForm");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
  let dataForm = new FormData(signinForm);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: dataForm.get("email"),
    password: dataForm.get("mdp"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "login", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
      }
  })

    .then((result) => {
      const token = result.apiToken;
      setToken(token);

      setCookie(RoleCookieName, result.roles[0], 7);
      window.location.replace("/");
    })
    .catch((error) => {
      console.error("erorr", error);
    });
}
