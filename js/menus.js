const dishesContainer = document.getElementById("dishes-container");
const menusContainer = document.getElementById("menus-container");
const btnAddDish = document.getElementById("btnAddDish");
const btnAddMenu = document.getElementById("btnAddMenu");
const dishForm = document.getElementById("dishForm");
const dishModalLabel = document.getElementById("DishModalLabel");
const dishNameInput = document.getElementById("dishNameInput");
const dishDescriptionInput = document.getElementById("dishDescriptionInput");
const dishCategoryInput = document.getElementById("dishCategoryInput");
const dishPriceInput = document.getElementById("dishPriceInput");
const menuForm = document.getElementById("menuForm");
const menuModalLabel = document.getElementById("MenuModalLabel");
const menuNameInput = document.getElementById("menuNameInput");
const menuDescriptionInput = document.getElementById("menuDescriptionInput");
const formulaForm = document.getElementById("formulaForm");
const formulaModalLabel = document.getElementById("FormulaModalLabel");
const formulaDescriptionInput = document.getElementById("formulaDescriptionInput");
const formulaPriceInput = document.getElementById("formulaPriceInput");
const deleteMenuItemText = document.getElementById("deleteMenuItemText");
const btnConfirmDeleteMenuItem = document.getElementById("btnConfirmDeleteMenuItem");

let dishIdToEdit = null;
let menuIdToEdit = null;
let formulaIdToEdit = null;
let formulaMenuId = null;
let deleteType = null;
let deleteId = null;

loadCard();

btnAddDish.addEventListener("click", () => {
    dishIdToEdit = null;
    dishForm.reset();
    dishModalLabel.textContent = "Ajouter un plat";
});

btnAddMenu.addEventListener("click", () => {
    menuIdToEdit = null;
    menuForm.reset();
    menuModalLabel.textContent = "Ajouter un menu";
});

dishForm.addEventListener("submit", saveDish);
menuForm.addEventListener("submit", saveMenu);
formulaForm.addEventListener("submit", saveFormula);
btnConfirmDeleteMenuItem.addEventListener("click", confirmDelete);

function loadCard() {
    Promise.all([
        fetch(apiUrl + "dishes").then(checkResponse),
        fetch(apiUrl + "menus").then(checkResponse),
    ])
        .then(([dishes, menus]) => {
            displayDishes(dishes);
            displayMenus(menus);
            showAndHideElementsForRoles();
        })
        .catch((error) => {
            console.error("Erreur lors du chargement de la carte", error);
            dishesContainer.innerHTML = '<p class="text-center text-danger">Impossible de charger la carte pour le moment.</p>';
            menusContainer.innerHTML = '<p class="text-center text-danger">Impossible de charger les menus pour le moment.</p>';
        });
}

function checkResponse(response) {
    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
    }
    return response.json();
}

function displayDishes(dishes) {
    dishesContainer.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row", "g-4");

    row.appendChild(createDishCategory("Entrées", getDishesByCategory(dishes, "starter")));
    row.appendChild(createDishCategory("Plats", getDishesByCategory(dishes, "main")));
    row.appendChild(createDishCategory("Desserts", getDishesByCategory(dishes, "dessert")));

    dishesContainer.appendChild(row);
}

function createDishCategory(title, dishes) {
    const column = document.createElement("div");
    column.classList.add("col-12", "col-lg-4");

    const category = document.createElement("article");
    category.classList.add("card", "shadow-sm", "h-100", "menu-card");

    const body = document.createElement("div");
    body.classList.add("card-body", "p-4");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("h4", "text-primary", "border-bottom", "pb-2", "mb-4");
    categoryTitle.textContent = title;

    body.appendChild(categoryTitle);

    if (dishes.length === 0) {
        const message = document.createElement("p");
        message.classList.add("text-muted", "fst-italic");
        message.textContent = "Aucun plat disponible.";
        body.appendChild(message);
    }

    dishes.forEach((dish) => {
        body.appendChild(createDishItem(dish));
    });

    category.appendChild(body);
    column.appendChild(category);
    return column;
}

function createDishItem(dish) {
    const container = document.createElement("div");
    container.classList.add("mb-4");

    const header = document.createElement("div");
    header.classList.add("d-flex", "justify-content-between", "gap-3");

    const name = document.createElement("h4");
    name.classList.add("h6", "mb-1");
    name.textContent = dish.name;

    const price = document.createElement("span");
    price.classList.add("fw-bold", "text-nowrap");
    price.textContent = formatPrice(dish.price);

    header.appendChild(name);
    header.appendChild(price);
    container.appendChild(header);

    if (dish.description) {
        const description = document.createElement("p");
        description.classList.add("small", "mb-2", "text-muted");
        description.textContent = dish.description;
        container.appendChild(description);
    }

    container.appendChild(createDishAdminActions(dish));
    return container;
}

function createDishAdminActions(dish) {
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
        dishNameInput.value = dish.name;
        dishDescriptionInput.value = dish.description || "";
        dishCategoryInput.value = dish.category;
        dishPriceInput.value = dish.price;
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
        menusContainer.appendChild(createMenuCard(menu));
    });
}

function createMenuCard(menu) {
    const card = document.createElement("article");
    card.classList.add("card", "shadow-sm", "mb-4", "menu-card");

    const body = document.createElement("div");
    body.classList.add("card-body", "p-4");

    const title = document.createElement("h3");
    title.classList.add("card-title", "text-primary");
    title.textContent = menu.name;

    body.appendChild(title);

    if (menu.description) {
        const description = document.createElement("p");
        description.classList.add("mb-3");
        description.textContent = menu.description;
        body.appendChild(description);
    }

    body.appendChild(createMenuAdminActions(menu));

    const formulasContainer = document.createElement("div");
    formulasContainer.classList.add("mt-3");

    if (!Array.isArray(menu.formulas) || menu.formulas.length === 0) {
        const message = document.createElement("p");
        message.classList.add("text-muted", "fst-italic", "mb-0");
        message.textContent = "Aucune formule disponible.";
        formulasContainer.appendChild(message);
    } else {
        menu.formulas.forEach((formula) => {
            formulasContainer.appendChild(createFormulaItem(formula, menu.id));
        });
    }

    body.appendChild(formulasContainer);
    card.appendChild(body);

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
        menuModalLabel.textContent = "Modifier le menu";
    });

    const addFormulaButton = document.createElement("button");
    addFormulaButton.type = "button";
    addFormulaButton.classList.add("btn", "btn-outline-success", "btn-sm");
    addFormulaButton.textContent = "Ajouter une formule";
    addFormulaButton.setAttribute("data-bs-toggle", "modal");
    addFormulaButton.setAttribute("data-bs-target", "#FormulaModal");

    addFormulaButton.addEventListener("click", () => {
        formulaIdToEdit = null;
        formulaMenuId = menu.id;
        formulaForm.reset();
        formulaModalLabel.textContent = "Ajouter une formule";
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
    actions.appendChild(addFormulaButton);
    actions.appendChild(deleteButton);

    return actions;
}

function createFormulaItem(formula, menuId) {
    const container = document.createElement("div");
    container.classList.add("border-top", "pt-3", "mt-3");

    const content = document.createElement("div");
    content.classList.add("d-flex", "justify-content-between", "gap-3");

    const description = document.createElement("p");
    description.classList.add("mb-2");
    description.textContent = formula.description;

    const price = document.createElement("span");
    price.classList.add("fw-bold", "text-nowrap");
    price.textContent = formatPrice(formula.price);

    content.appendChild(description);
    content.appendChild(price);
    container.appendChild(content);

    const actions = document.createElement("div");
    actions.classList.add("d-flex", "gap-2");
    actions.dataset.show = "admin";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("btn", "btn-outline-primary", "btn-sm");
    editButton.textContent = "Modifier";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#FormulaModal");

    editButton.addEventListener("click", () => {
        formulaIdToEdit = formula.id;
        formulaMenuId = menuId;
        formulaDescriptionInput.value = formula.description || "";
        formulaPriceInput.value = formula.price;
        formulaModalLabel.textContent = "Modifier la formule";
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");
    deleteButton.textContent = "Supprimer";
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#DeleteMenuItemModal");

    deleteButton.addEventListener("click", () => {
        prepareDelete("formula", formula.id, "cette formule");
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    container.appendChild(actions);

    return container;
}

function saveDish(event) {
    event.preventDefault();

    const name = dishNameInput.value.trim();
    const description = dishDescriptionInput.value.trim();
    const category = dishCategoryInput.value;
    const price = Number(dishPriceInput.value);

    if (!name || !category || Number.isNaN(price) || price <= 0) {
        return;
    }

    const endpoint =
        dishIdToEdit === null
            ? apiUrl + "dishes"
            : apiUrl + `dishes/${dishIdToEdit}`;

    const method = dishIdToEdit === null ? "POST" : "PUT";

    fetch(endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": getToken(),
        },
        body: JSON.stringify({
            name,
            description,
            category,
            price,
        }),
    })
        .then(checkResponse)
        .then(() => {
            hideModal("DishModal");
            dishIdToEdit = null;
            dishForm.reset();
            loadCard();
        })
        .catch((error) => {
            console.error("Erreur lors de l'enregistrement du plat", error);
        });
}

function saveMenu(event) {
    event.preventDefault();

    const name = menuNameInput.value.trim();
    const description = menuDescriptionInput.value.trim();

    if (!name) {
        return;
    }

    const endpoint =
        menuIdToEdit === null
            ? apiUrl + "menus"
            : apiUrl + `menus/${menuIdToEdit}`;

    const method = menuIdToEdit === null ? "POST" : "PUT";

    fetch(endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": getToken(),
        },
        body: JSON.stringify({
            name,
            description,
        }),
    })
        .then(checkResponse)
        .then(() => {
            hideModal("MenuModal");
            menuIdToEdit = null;
            menuForm.reset();
            loadCard();
        })
        .catch((error) => {
            console.error("Erreur lors de l'enregistrement du menu", error);
        });
}

function saveFormula(event) {
    event.preventDefault();

    const description = formulaDescriptionInput.value.trim();
    const price = Number(formulaPriceInput.value);

    if (!description || Number.isNaN(price) || price <= 0 || !formulaMenuId) {
        return;
    }

    const endpoint =
        formulaIdToEdit === null
            ? apiUrl + "formulas"
            : apiUrl + `formulas/${formulaIdToEdit}`;

    const method = formulaIdToEdit === null ? "POST" : "PUT";

    const data = {
        description,
        price,
    };

    if (formulaIdToEdit === null) {
        data.menuId = formulaMenuId;
    }

    fetch(endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": getToken(),
        },
        body: JSON.stringify(data),
    })
        .then(checkResponse)
        .then(() => {
            hideModal("FormulaModal");
            formulaIdToEdit = null;
            formulaMenuId = null;
            formulaForm.reset();
            loadCard();
        })
        .catch((error) => {
            console.error("Erreur lors de l'enregistrement de la formule", error);
        });
}

function prepareDelete(type, id, name) {
    deleteType = type;
    deleteId = id;

    if (type === "menu") {
        deleteMenuItemText.textContent = `Supprimer le menu « ${name} » ?`;
    } else if (type === "dish") {
        deleteMenuItemText.textContent = `Supprimer le plat « ${name} » ?`;
    } else {
        deleteMenuItemText.textContent = "Supprimer cette formule ?";
    }
}

function confirmDelete() {
    if (deleteType === null || deleteId === null) {
        return;
    }

    const endpoints = {
        menu: `menus/${deleteId}`,
        dish: `dishes/${deleteId}`,
        formula: `formulas/${deleteId}`,
    };

    fetch(apiUrl + endpoints[deleteType], {
        method: "DELETE",
        headers: {
            "X-AUTH-TOKEN": getToken(),
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Impossible de supprimer l'élément");
            }

            hideModal("DeleteMenuItemModal");
            deleteType = null;
            deleteId = null;
            loadCard();
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

function hideModal(id) {
    const modalElement = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}