const reservationForm = document.getElementById("reservationForm");
const allergieInput = document.getElementById("AllergieInput");
const nbConvivesInput = document.getElementById("NbConvivesInput");
const dateInput = document.getElementById("DateInput");
const selectHour = document.getElementById("selectHour");
const availabilityMessage = document.getElementById("availabilityMessage");
const btnReservation = document.getElementById("btnReservation");

initializeReservationPage();

async function initializeReservationPage() {
  dateInput.min = new Date().toISOString().split("T")[0];

  if (isConnected()) {
    const user = await getInfoUser();

    if (user) {
      allergieInput.value = user.allergy ?? "";
      nbConvivesInput.value = user.guestNumber ?? "";
    }
  }

  dateInput.addEventListener("change", loadAvailability);
  nbConvivesInput.addEventListener("change", loadAvailability);
  reservationForm.addEventListener("submit", createReservation);
}

async function loadAvailability() {
  const date = dateInput.value;
  const guestNumber = Number(nbConvivesInput.value);

  selectHour.innerHTML = "";
  selectHour.disabled = true;
  availabilityMessage.textContent = "";

  if (!date || guestNumber < 1) {
    selectHour.innerHTML =
      '<option value="">Choisissez une date et un nombre de convives</option>';
    return;
  }

  try {
    const response = await fetch(
      `${apiUrl}reservations/availability?date=${encodeURIComponent(date)}&guestNumber=${guestNumber}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? "Impossible de vérifier les disponibilités",
      );
    }

    const availableSlots = data.slots.filter((slot) => slot.available);

    if (availableSlots.length === 0) {
      selectHour.innerHTML =
        '<option value="">Aucun créneau disponible</option>';
      availabilityMessage.textContent =
        "Aucune place disponible pour cette date et ce nombre de convives.";
      return;
    }

    selectHour.innerHTML = '<option value="">Choisissez une heure</option>';

    availableSlots.forEach((slot) => {
      const option = document.createElement("option");

      option.value = slot.time;
      option.textContent = `${slot.time} — ${slot.remainingGuests} place(s) restante(s)`;

      selectHour.appendChild(option);
    });

    selectHour.disabled = false;
    availabilityMessage.textContent = `${availableSlots.length} créneau(x) disponible(s).`;
  } catch (error) {
    console.error("Erreur lors du chargement des disponibilités", error);

    selectHour.innerHTML =
      '<option value="">Disponibilités indisponibles</option>';

    availabilityMessage.textContent = error.message;
  }
}

async function createReservation(event) {
  event.preventDefault();

  const guestNumber = Number(nbConvivesInput.value);

  if (!dateInput.value || !selectHour.value || guestNumber < 1) {
    return;
  }

  btnReservation.disabled = true;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (isConnected()) {
    headers.append("X-AUTH-TOKEN", getToken());
  }

  const reservation = {
    date: dateInput.value,
    time: selectHour.value,
    guestNumber: guestNumber,
    allergy: allergieInput.value.trim() || null,
  };

  try {
    const response = await fetch(apiUrl + "reservations", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reservation),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Impossible de créer la réservation");
    }

    if (isConnected()) {
      window.location.replace("/allResa");
      return;
    }

    reservationForm.reset();
    selectHour.innerHTML =
      '<option value="">Choisissez d\'abord une date</option>';
    selectHour.disabled = true;

    availabilityMessage.textContent =
      "Votre réservation a bien été enregistrée.";
  } catch (error) {
    console.error("Erreur lors de la création de la réservation", error);
    availabilityMessage.textContent = error.message;
  } finally {
    btnReservation.disabled = false;
  }
}
