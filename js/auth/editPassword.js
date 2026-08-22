const editPasswordForm = document.getElementById("editPasswordForm");
const passwordInput = document.getElementById("PasswordInput");
const validatePasswordInput = document.getElementById("ValidatePasswordInput");
editPasswordForm.addEventListener("submit", updatePassword);

function updatePassword(event) {
  event.preventDefault();

  const passwordValid = validatePassword(passwordInput);
  const confirmationValid = validateConfirmationPassword(
    passwordInput,
    validatePasswordInput,
  );

  if (!passwordValid || !confirmationValid) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", getToken());

  const raw = JSON.stringify({
    password: passwordInput.value,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "account/edit", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de modifier le mot de passe");
      }

      if (response.status === 204) {
        passwordInput.value = "";
        validatePasswordInput.value = "";

        passwordInput.classList.remove("is-valid");
        validatePasswordInput.classList.remove("is-valid");

        window.location.replace("/account");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la modification du mot de passe", error);
    });
}

function validatePassword(input) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const password = input.value;

  if (password.match(passwordRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  }

  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  return false;
}

function validateConfirmationPassword(inputPassword, inputConfirmPassword) {
  if (
    inputConfirmPassword.value === inputPassword.value &&
    inputConfirmPassword.value !== ""
  ) {
    inputConfirmPassword.classList.add("is-valid");
    inputConfirmPassword.classList.remove("is-invalid");
    return true;
  }

  inputConfirmPassword.classList.add("is-invalid");
  inputConfirmPassword.classList.remove("is-valid");
  return false;
}
