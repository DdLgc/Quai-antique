const allReservations = document.getElementById("allReservations");

loadReservations();

function loadReservations() {
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", getToken());

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + "reservations", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de récupérer les réservations");
      }

      return response.json();
    })
    .then((reservations) => {
      displayReservations(reservations);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des réservations", error);
    });
}

function displayReservations(reservations) {
  allReservations.innerHTML = "";

  if (reservations.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Vous n'avez pas de réservation.";
    allReservations.appendChild(message);
    return;
  }

  reservations.forEach((reservation) => {
    const reservationContainer = document.createElement("div");
    reservationContainer.classList.add("mb-3");

    const reservationText = document.createElement("span");
    reservationText.textContent =
      `${reservation.date} | ${reservation.time} | ` +
      `${reservation.guestNumber} personne(s) | ` +
      `${reservation.allergy ?? "Pas d'allergie"}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-3");
    deleteButton.textContent = "Annuler";

    deleteButton.addEventListener("click", () => {
      deleteReservation(reservation.id);
    });

    reservationContainer.appendChild(reservationText);
    reservationContainer.appendChild(deleteButton);

    allReservations.appendChild(reservationContainer);
  });
}

function deleteReservation(id) {
  const confirmation = confirm(
    "Voulez-vous vraiment annuler cette réservation ?",
  );

  if (!confirmation) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", getToken());

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + `reservations/${id}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible d'annuler la réservation");
      }

      if (response.status === 204) {
        loadReservations();
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'annulation de la réservation", error);
    });
}
