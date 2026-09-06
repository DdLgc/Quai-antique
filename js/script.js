const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const apiUrl = "https://127.0.0.1:8000/api/";

signoutBtn.addEventListener("click", signout);

function getRole() {
  return getCookie(RoleCookieName);
}

function signout() {
  eraseCookie(tokenCookieName);
  eraseCookie(RoleCookieName);
  window.location.reload();
}

function setToken(token) {
  setCookie(tokenCookieName, token, 7);
}

function getToken() {
  return getCookie(tokenCookieName);
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function isConnected() {
  return getToken() !== null;
}

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    switch (element.dataset.show) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "admin":
        if (!userConnected || role != "ROLE_ADMIN") {
          element.classList.add("d-none");
        }
        break;
      case "client":
        if (!userConnected || role != "ROLE_USER") {
          element.classList.add("d-none");
        }
        break;
    }
  });
}

function getInfoUser() {
  let myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", getToken());

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(apiUrl + "account/me", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de récupérer les informations utilisateur");
      }

      return response.json();
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des données utilisateur",
        error,
      );
    });
}

const openingHoursContainer = document.getElementById("opening-hours");
const openingHoursForm = document.getElementById("opening-hours-form");
const openingHoursFields = document.getElementById("opening-hours-fields");
const maxGuestInput = document.getElementById("max-guest-input");

const days = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

let currentOpeningHours = {};

function formatTime(time) {
  return time.replace(":", "h");
}

function formatPeriod(period) {
  if (!period) {
    return null;
  }

  return `${formatTime(period[0])} - ${formatTime(period[1])}`;
}

function displayOpeningHours(openingHours) {
  openingHoursContainer.innerHTML = "";

  Object.entries(days).forEach(([key, label]) => {
    const day = openingHours[key] || {};
    const am = formatPeriod(day.am);
    const pm = formatPeriod(day.pm);

    let hours = "Fermé";

    if (am && pm) {
      hours = `${am} | ${pm}`;
    } else if (am) {
      hours = am;
    } else if (pm) {
      hours = pm;
    }

    const paragraph = document.createElement("p");
    paragraph.classList.add("mb-1");
    paragraph.textContent = `${label} : ${hours}`;

    openingHoursContainer.appendChild(paragraph);
  });
}

function loadOpeningHours() {
  fetch(apiUrl + "restaurant/1/opening-hours")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de récupérer les horaires");
      }

      return response.json();
    })
    .then((data) => {
      currentOpeningHours = data.openingHours;
      displayOpeningHours(currentOpeningHours);
      createOpeningHoursForm(currentOpeningHours);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des horaires", error);
      openingHoursContainer.innerHTML = "<p>Horaires indisponibles.</p>";
    });
}

function loadRestaurantCapacity() {
  fetch(apiUrl + "restaurant/1", {
    headers: {
      "X-AUTH-TOKEN": getToken(),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de récupérer la capacité du restaurant");
      }

      return response.json();
    })
    .then((restaurant) => {
      maxGuestInput.value = restaurant.maxGuest;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de la capacité", error);
    });
}

function saveRestaurantCapacity() {
  const maxGuest = Number(maxGuestInput.value);

  if (maxGuest < 1) {
    return Promise.reject(
      new Error("La capacité doit être supérieure à 0")
    );
  }

  return fetch(apiUrl + "restaurant/1/capacity", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": getToken(),
    },
    body: JSON.stringify({ maxGuest }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Impossible de modifier la capacité");
    }

    return response.json();
  });
}

function createOpeningHoursForm(openingHours) {
  openingHoursFields.innerHTML = "";

  Object.entries(days).forEach(([key, label]) => {
    const day = openingHours[key] || {};
    const am = day.am || ["", ""];
    const pm = day.pm || ["", ""];

    document.querySelectorAll(".closed-day-checkbox").forEach((checkbox) => {
      toggleClosedDay(checkbox);

      checkbox.addEventListener("change", () => {
        toggleClosedDay(checkbox);
      });
    });
    function toggleClosedDay(checkbox) {
      const day = checkbox.dataset.day;
      const fields = document.querySelectorAll(`#${day}-fields input`);

      fields.forEach((input) => {
        input.disabled = checkbox.checked;

        if (checkbox.checked) {
          input.value = "";
        }
      });
    }

    openingHoursFields.insertAdjacentHTML(
      "beforeend",
      `
    <div class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="fs-6 mb-0">${label}</h3>

            <div class="form-check">
                <input
                    class="form-check-input closed-day-checkbox"
                    type="checkbox"
                    id="${key}-closed"
                    data-day="${key}"
                    ${!day.am && !day.pm ? "checked" : ""}
                >
                <label class="form-check-label" for="${key}-closed">
                    Fermé
                </label>
            </div>
        </div>

        <div class="row g-2" id="${key}-fields">
            <div class="col-6 col-md-3">
                <label class="form-label" for="${key}-am-start">Midi - ouverture</label>
                <input type="time" class="form-control" id="${key}-am-start" value="${am[0]}">
            </div>

            <div class="col-6 col-md-3">
                <label class="form-label" for="${key}-am-end">Midi - fermeture</label>
                <input type="time" class="form-control" id="${key}-am-end" value="${am[1]}">
            </div>

            <div class="col-6 col-md-3">
                <label class="form-label" for="${key}-pm-start">Soir - ouverture</label>
                <input type="time" class="form-control" id="${key}-pm-start" value="${pm[0]}">
            </div>

            <div class="col-6 col-md-3">
                <label class="form-label" for="${key}-pm-end">Soir - fermeture</label>
                <input type="time" class="form-control" id="${key}-pm-end" value="${pm[1]}">
            </div>
        </div>
    </div>
`,
    );
  });
}

function getPeriod(start, end) {
  return start && end ? [start, end] : null;
}

function saveOpeningHours(event) {
  event.preventDefault();

  const openingHours = {};

  Object.keys(days).forEach((day) => {
    const closed = document.getElementById(`${day}-closed`).checked;

    if (closed) {
      openingHours[day] = {
        am: null,
        pm: null,
      };

      return;
    }

    const amStart = document.getElementById(`${day}-am-start`).value;
    const amEnd = document.getElementById(`${day}-am-end`).value;
    const pmStart = document.getElementById(`${day}-pm-start`).value;
    const pmEnd = document.getElementById(`${day}-pm-end`).value;

    openingHours[day] = {
      am: getPeriod(amStart, amEnd),
      pm: getPeriod(pmStart, pmEnd),
    };
  });

  fetch(apiUrl + "restaurant/1/opening-hours", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": getToken(),
    },
    body: JSON.stringify({ openingHours }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de modifier les horaires");
      }

      return response.json();
    })
    .then((data) => {
  currentOpeningHours = data.openingHours;
  displayOpeningHours(currentOpeningHours);

  return saveRestaurantCapacity();
})
.then(() => {
  const modalElement = document.getElementById("opening-hours-modal");
  bootstrap.Modal.getOrCreateInstance(modalElement).hide();
})
    .catch((error) => {
      console.error("Erreur lors de la modification des horaires", error);
    });
}

openingHoursForm.addEventListener("submit", saveOpeningHours);

loadOpeningHours();
showAndHideElementsForRoles();

if (getCookie(RoleCookieName) === "ROLE_ADMIN") {
  loadRestaurantCapacity();
}
