const nomInput = document.getElementById("NomInput");
const prenomInput = document.getElementById("PrenomInput");
const allergieInput = document.getElementById("AllergieInput");
const nbConvivesInput = document.getElementById("NbConvivesInput");
const accountForm = document.getElementById("accountForm");
const btnDeleteAccount = document.getElementById("btnDeleteAccount");

btnDeleteAccount.addEventListener("click", deleteAccount);

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

function deleteAccount() {
    const confirmation = confirm("Etes-cous sûr de vouloir supprimer définitivement votre compte ?");
    if (!confirmation) {
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(apiUrl + "account/delete", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de supprimer le compte")
            }

            if (response.status === 204) {
                eraseCookie(tokenCookieName);
                eraseCookie(RoleCookieName);

                window.location.replace("/");
            }
        })

        .catch(error => {
            console.error("Erreur lors de la suppression du compte", error
            );
        });
}