const menusContainer = document.getElementById("menus-container");

const btnAddMenu = document.getElementById("btnAddMenu");

const menuForm = document.getElementById("menuForm");
const menuModalLabel = document.getElementById("MenuModalLabel");
const menuNameInput = document.getElementById("menuNameInput");
const menuDescriptionInput = document.getElementById("menuDescriptionInput");
const menuPriceInput = document.getElementById("menuPriceInput");

const dishForm = document.getElementById("dishForm");
const dishModalLabel = document.getElementById("DishModalLabel");
const dishNameInput = document.getElementById("dishNameInput");
const dishDescriptionInput = document.getElementById("dishDescriptionInput");
const dishCategoryInput = document.getElementById("dishCategoryInput");

const deleteMenuItemText = document.getElementById("deleteMenuItemText");
const btnConfirmDeleteMenuItem = document.getElementById(
  "btnConfirmDeleteMenuItem",
);

let menuIdToEdit = null;
let menuIdForDish = null;
let dishIdToEdit = null;

let deleteType = null;
let deleteId = null;

loadMenus();

btnAddMenu.addEventListener("click", () => {
  menuIdToEdit = null;

  menuForm.reset();

  menuModalLabel.textContent = "Ajouter un menu";
});

menuForm.addEventListener("submit", saveMenu);

dishForm.addEventListener("submit", saveDish);

btnConfirmDeleteMenuItem.addEventListener("click", confirmDelete);

function loadMenus() {
  fetch(apiUrl + "menus")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de récupérer les menus");
      }

      return response.json();
    })

    .then((menus) => {
      displayMenus(menus);
    })

    .catch((error) => {
      console.error("Erreur lors du chargement des menus", error);

      menusContainer.innerHTML = "";

      const message = document.createElement("p");

      message.classList.add("text-center", "text-danger");

      message.textContent = "Impossible de charger la carte pour le moment.";

      menusContainer.appendChild(message);
    });
}

function displayMenus(menus) {
  menusContainer.innerHTML = "";

  if (menus.length === 0) {
    const message = document.createElement("p");

    message.classList.add("text-center");

    message.textContent = "Aucun menu disponible pour le moment.";

    menusContainer.appendChild(message);

    return;
  }

  menus.forEach((menu) => {
    const menuCard = createMenuCard(menu);

    menusContainer.appendChild(menuCard);
  });

  showAndHideElementsForRoles();
}

function createMenuCard(menu) {
  const card = document.createElement("article");

  card.classList.add("card", "shadow-sm", "mb-5", "menu-card");

  const cardBody = document.createElement("div");

  cardBody.classList.add("card-body", "p-4");

  const header = document.createElement("div");

  header.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-start",
    "gap-3",
    "mb-3",
  );

  const titleContainer = document.createElement("div");

  const title = document.createElement("h2");

  title.classList.add("card-title", "text-primary");

  title.textContent = menu.name;

  titleContainer.appendChild(title);

  if (menu.description) {
    const description = document.createElement("p");

    description.classList.add("mb-0");

    description.textContent = menu.description;

    titleContainer.appendChild(description);
  }

  const price = document.createElement("span");

  price.classList.add("fs-4", "fw-bold", "text-nowrap");

  price.textContent = formatPrice(menu.price);

  header.appendChild(titleContainer);
  header.appendChild(price);

  cardBody.appendChild(header);

  const adminMenuActions = createMenuAdminActions(menu);

  cardBody.appendChild(adminMenuActions);

  const dishesContainer = document.createElement("div");

  dishesContainer.classList.add("row", "g-4", "mt-2");

  dishesContainer.appendChild(
    createDishCategory(
      "Entrées",
      getDishesByCategory(menu.dishes, "starter"),
      menu.id,
    ),
  );

  dishesContainer.appendChild(
    createDishCategory(
      "Plats",
      getDishesByCategory(menu.dishes, "main"),
      menu.id,
    ),
  );

  dishesContainer.appendChild(
    createDishCategory(
      "Desserts",
      getDishesByCategory(menu.dishes, "dessert"),
      menu.id,
    ),
  );

  cardBody.appendChild(dishesContainer);

  card.appendChild(cardBody);

  return card;
}

function createMenuAdminActions(menu) {
  const actions = document.createElement("div");

  actions.classList.add("d-flex", "gap-2", "flex-wrap", "mb-3");

  actions.dataset.show = "admin";

  const editButton = document.createElement("button");

  editButton.type = "button";

  editButton.classList.add("btn", "btn-outline-primary", "btn-sm");

  editButton.textContent = "Modifier le menu";

  editButton.setAttribute("data-bs-toggle", "modal");

  editButton.setAttribute("data-bs-target", "#MenuModal");

  editButton.addEventListener("click", () => {
    menuIdToEdit = menu.id;

    menuNameInput.value = menu.name;

    menuDescriptionInput.value = menu.description || "";

    menuPriceInput.value = menu.price;

    menuModalLabel.textContent = "Modifier le menu";
  });

  const addDishButton = document.createElement("button");

  addDishButton.type = "button";

  addDishButton.classList.add("btn", "btn-outline-success", "btn-sm");

  addDishButton.textContent = "Ajouter un plat";

  addDishButton.setAttribute("data-bs-toggle", "modal");

  addDishButton.setAttribute("data-bs-target", "#DishModal");

  addDishButton.addEventListener("click", () => {
    menuIdForDish = menu.id;

    dishIdToEdit = null;

    dishForm.reset();

    dishModalLabel.textContent = "Ajouter un plat";
  });

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";

  deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");

  deleteButton.textContent = "Supprimer le menu";

  deleteButton.setAttribute("data-bs-toggle", "modal");

  deleteButton.setAttribute("data-bs-target", "#DeleteMenuItemModal");

  deleteButton.addEventListener("click", () => {
    prepareDelete("menu", menu.id, menu.name);
  });

  actions.appendChild(editButton);

  actions.appendChild(addDishButton);

  actions.appendChild(deleteButton);

  return actions;
}

function createDishCategory(title, dishes, menuId) {
  const column = document.createElement("div");

  column.classList.add("col-12", "col-lg-4");

  const categoryTitle = document.createElement("h3");

  categoryTitle.classList.add("h5", "border-bottom", "pb-2", "mb-3");

  categoryTitle.textContent = title;

  column.appendChild(categoryTitle);

  if (dishes.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.classList.add("text-muted", "fst-italic");

    emptyMessage.textContent = "Aucun plat renseigné.";

    column.appendChild(emptyMessage);

    return column;
  }

  dishes.forEach((dish) => {
    const dishContainer = document.createElement("div");

    dishContainer.classList.add("mb-4");

    const dishName = document.createElement("h4");

    dishName.classList.add("h6", "mb-1");

    dishName.textContent = dish.name;

    dishContainer.appendChild(dishName);

    if (dish.description) {
      const dishDescription = document.createElement("p");

      dishDescription.classList.add("small", "mb-2", "text-muted");

      dishDescription.textContent = dish.description;

      dishContainer.appendChild(dishDescription);
    }

    const actions = createDishAdminActions(dish, menuId);

    dishContainer.appendChild(actions);

    column.appendChild(dishContainer);
  });

  return column;
}

function createDishAdminActions(dish, menuId) {
  const actions = document.createElement("div");

  actions.classList.add("d-flex", "gap-2");

  actions.dataset.show = "admin";

  const editButton = document.createElement("button");

  editButton.type = "button";

  editButton.classList.add("btn", "btn-outline-primary", "btn-sm");

  editButton.textContent = "Modifier";

  editButton.setAttribute("data-bs-toggle", "modal");

  editButton.setAttribute("data-bs-target", "#DishModal");

  editButton.addEventListener("click", () => {
    dishIdToEdit = dish.id;

    menuIdForDish = menuId;

    dishNameInput.value = dish.name;

    dishDescriptionInput.value = dish.description || "";

    dishCategoryInput.value = dish.category;

    dishModalLabel.textContent = "Modifier le plat";
  });

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";

  deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");

  deleteButton.textContent = "Supprimer";

  deleteButton.setAttribute("data-bs-toggle", "modal");

  deleteButton.setAttribute("data-bs-target", "#DeleteMenuItemModal");

  deleteButton.addEventListener("click", () => {
    prepareDelete("dish", dish.id, dish.name);
  });

  actions.appendChild(editButton);

  actions.appendChild(deleteButton);

  return actions;
}

function saveMenu(event) {
  event.preventDefault();

  const name = menuNameInput.value.trim();

  const description = menuDescriptionInput.value.trim();

  const price = Number(menuPriceInput.value);

  if (!name || Number.isNaN(price) || price <= 0) {
    return;
  }

  const endpoint =
    menuIdToEdit === null ? apiUrl + "menus" : apiUrl + `menus/${menuIdToEdit}`;

  const method = menuIdToEdit === null ? "POST" : "PUT";

  fetch(endpoint, {
    method: method,

    headers: {
      "Content-Type": "application/json",

      "X-AUTH-TOKEN": getToken(),
    },

    body: JSON.stringify({
      name: name,

      description: description,

      price: price,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible d'enregistrer le menu");
      }

      return response.json();
    })

    .then(() => {
      const modalElement = document.getElementById("MenuModal");

      const modal = bootstrap.Modal.getInstance(modalElement);

      if (modal) {
        modal.hide();
      }

      menuIdToEdit = null;

      menuForm.reset();

      loadMenus();
    })

    .catch((error) => {
      console.error("Erreur lors de l'enregistrement du menu", error);
    });
}

function saveDish(event) {
  event.preventDefault();

  const name = dishNameInput.value.trim();

  const description = dishDescriptionInput.value.trim();

  const category = dishCategoryInput.value;

  if (!name || !menuIdForDish) {
    return;
  }

  const endpoint =
    dishIdToEdit === null
      ? apiUrl + "dishes"
      : apiUrl + `dishes/${dishIdToEdit}`;

  const method = dishIdToEdit === null ? "POST" : "PUT";

  fetch(endpoint, {
    method: method,

    headers: {
      "Content-Type": "application/json",

      "X-AUTH-TOKEN": getToken(),
    },

    body: JSON.stringify({
      name: name,

      description: description,

      category: category,

      menuId: menuIdForDish,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible d'enregistrer le plat");
      }

      return response.json();
    })

    .then(() => {
      const modalElement = document.getElementById("DishModal");

      const modal = bootstrap.Modal.getInstance(modalElement);

      if (modal) {
        modal.hide();
      }

      dishIdToEdit = null;

      menuIdForDish = null;

      dishForm.reset();

      loadMenus();
    })

    .catch((error) => {
      console.error("Erreur lors de l'enregistrement du plat", error);
    });
}

function prepareDelete(type, id, name) {
  deleteType = type;

  deleteId = id;

  if (type === "menu") {
    deleteMenuItemText.textContent = `Supprimer le menu « ${name} » ?`;
  } else {
    deleteMenuItemText.textContent = `Supprimer le plat « ${name} » ?`;
  }
}

function confirmDelete() {
  if (deleteType === null || deleteId === null) {
    return;
  }

  const endpoint =
    deleteType === "menu"
      ? apiUrl + `menus/${deleteId}`
      : apiUrl + `dishes/${deleteId}`;

  fetch(endpoint, {
    method: "DELETE",

    headers: {
      "X-AUTH-TOKEN": getToken(),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Impossible de supprimer l'élément");
      }

      const modalElement = document.getElementById("DeleteMenuItemModal");

      const modal = bootstrap.Modal.getInstance(modalElement);

      if (modal) {
        modal.hide();
      }

      deleteType = null;

      deleteId = null;

      loadMenus();
    })

    .catch((error) => {
      console.error("Erreur lors de la suppression", error);
    });
}

function getDishesByCategory(dishes, category) {
  if (!Array.isArray(dishes)) {
    return [];
  }

  return dishes.filter((dish) => dish.category === category);
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "";
  }

  return numericPrice.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}
