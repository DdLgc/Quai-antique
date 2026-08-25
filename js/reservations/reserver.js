const reservationForm = document.getElementById("reservationForm");
const nomInput = document.getElementById("NomInput");
const prenomInput = document.getElementById("PrenomInput");
const allergieInput = document.getElementById("AllergieInput");
const nbConvivesInput = document.getElementById("NbConvivesInput");
const dateInput = document.getElementById("DateInput");
const selectHour = document.getElementById("selectHour");
const midiRadio = document.getElementById("midiRadio");
const soirRadio = document.getElementById("soirRadio");
let maxGuest = null;

getInfoUser().then(user => {
    if (!user) {
        return;
    }

    nomInput.value = user.lastName ?? "";
    prenomInput.value = user.firstName ?? "";
    allergieInput.value = user.allergy ?? "";
    nbConvivesInput.value = user.guestNumber ?? "";
});

reservationForm.addEventListener("submit", createReservation);
loadRestaurant();


function createReservation(event) {
    event.preventDefault();

    const guestNumber = Number(nbConvivesInput.value);

    if (
    !dateInput.value ||
    !selectHour.value ||
    guestNumber < 1 ||
    (maxGuest !== null && guestNumber > maxGuest)
) {
    return;
}

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const raw = JSON.stringify({
        date: dateInput.value,
        time: selectHour.value,
        guestNumber: guestNumber,
        allergy: allergieInput.value || null
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(apiUrl + "reservations", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de créer la réservation");
            }

            return response.json();
        })
        .then(() => {
            window.location.replace("/allResa");
        })
        .catch(error => {
            console.error(
                "Erreur lors de la création de la réservation",
                error
            );
        });
}

function loadRestaurant() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    fetch(apiUrl + "restaurant/1", {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de récupérer les informations du restaurant");
            }

            return response.json();
        })
        .then(restaurant => {
            maxGuest = restaurant.maxGuest;
            nbConvivesInput.max = restaurant.maxGuest;

            updateHourOptions(
                soirRadio.checked
                    ? restaurant.pmOpeningTime
                    : restaurant.amOpeningTime
            );

            midiRadio.addEventListener("change", () => {
                updateHourOptions(restaurant.amOpeningTime);
            });

            soirRadio.addEventListener("change", () => {
                updateHourOptions(restaurant.pmOpeningTime);
            });
        })
        .catch(error => {
            console.error(
                "Erreur lors du chargement du restaurant",
                error
            );
        });
}

function updateHourOptions(hours) {
    selectHour.innerHTML = "";

    hours.forEach(hour => {
        const option = document.createElement("option");
        option.value = hour;
        option.textContent = hour;

        selectHour.appendChild(option);
    });
}