const nomInput = document.getElementById("NomInput");
const prenomInput = document.getElementById("PrenomInput");
const allergieInput = document.getElementById("AllergieInput");
const nbConvivesInput = document.getElementById("NbConvivesInput");

getInfoUser().then(user => {
    if (!user) {
        return;
    }

    nomInput.value = user.lastName ?? "";
    prenomInput.value = user.firstName ?? "";
    allergieInput.value = user.allergy ?? "";
    nbConvivesInput.value = user.guestNumber ?? "";
});