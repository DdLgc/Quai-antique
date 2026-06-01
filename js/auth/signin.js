const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
  if (mailInput.value == "test@mail.com" && passwordInput.value == "123") {

    const token = "fdskjlfjskldjksljqklùfmezfklcùc";
    setToken(token)
    
    setCookie(RoleCookieName, "admin", 7)
    window.location.replace("/");

  } else {
    mailInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");
  }
}
