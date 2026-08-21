const nomInput = document.getElementById("NomInput");
const prenomInput = document.getElementById("PrenomInput");
const allergieInput = document.getElementById("AllergieInput");
const nbConvivesInput = document.getElementById("NbConvivesInput");
const accountForm = document.getElementById("accountForm");

getInfoUser().then(user => {
    if (!user) {
        return;
    }

    nomInput.value = user.lastName ?? "";
    prenomInput.value = user.firstName ?? "";
    allergieInput.value = user.allergy ?? "";
    nbConvivesInput.value = user.guestNumber ?? "";
});

accountForm.addEventListener("submit", updateAccount);

function updateAccount(event) {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const raw = JSON.stringify({
        firstName: prenomInput.value,
        lastName: nomInput.value,
        allergy: allergieInput.value || null,
        guestNumber: nbConvivesInput.value
            ? Number(nbConvivesInput.value)
            : null
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(apiUrl + "account/edit", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de modifier les informations utilisateur");
            }

            if (response.status === 204) {
                return;
            }
        })
        .catch(error => {
            console.error(
                "Erreur lors de la modification des informations utilisateur",
                error
            );
        });
}