const galerieImage = document.getElementById("allImages");
const pictureForm = document.getElementById("pictureForm");
const namePhotoInput = document.getElementById("NamePhotoInput");
const imageInput = document.getElementById("ImageInput");
const deletePictureTitle = document.getElementById("deletePictureTitle");
const deletePictureImage = document.getElementById("deletePictureImage");
const btnDeletePicture = document.getElementById("btnDeletePicture");
const deletePhotoModalElement = document.getElementById("DeletePhotoModal");
const btnAddPicture = document.getElementById("btnAddPicture");
const editionPhotoModalLabel = document.getElementById("EditionPhotoModalLabel");

let pictureIdToDelete = null;
let pictureIdToEdit = null;
pictureForm.addEventListener("submit", createPicture);
loadGallery();
btnAddPicture.addEventListener("click", () => {
    pictureIdToEdit = null;
    pictureForm.reset();
    editionPhotoModalLabel.textContent = "Ajouter une photo";
});

function loadGallery() {
    fetch(apiUrl + "pictures")
    .then(response => {
        if (!response.ok) {
            throw new Error("Impossible de récupérer les images de la galerie");
        }

        return response.json();
    })
    .then(pictures => {
        displayGallery(pictures);
    })
    .catch(error => {
        console.error(
            "erreur lors du chargement de la galerie",
            error
        );
    });
}

function displayGallery(pictures) {
    galerieImage.innerHTML = "";

    if(pictures.length === 0) {
        const message = document.createElement("p");
        message.classList.add("text-center", "w-100");
        message.textContent = "Aucune photo disponible pour le moment.";

        galerieImage.appendChild(message);
        return;
    }

    pictures.forEach(picture => {
        const image = getImage(
            picture.id,
            picture.title,
            picture.imageUrl
        );

        galerieImage.appendChild(image);
    });

    showAndHideElementsForRoles();
}

function isValidImageUrl(url) {
    try {
        const parsedUrl = new URL(url, window.location.origin);

        return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}

function getImage(id, titre, urlImage) {
    const imageContainer = document.createElement("div");

    imageContainer.dataset.pictureId = id;
    imageContainer.classList.add("col", "p-3");
    const imageCard = document.createElement("div");
    imageCard.classList.add("image-card", "text-white");

    const image = document.createElement("img");
    if (isValidImageUrl(urlImage)) {
        image.src = urlImage;
    } else {
        image.src = "../images/food.jpg";
    }
    image.alt = titre;
    image.classList.add("rounded", "w-100");
    imageCard.appendChild(image);
    const imageTitle = document.createElement("p");
    imageTitle.classList.add("titre-image");
    imageTitle.textContent = titre;

    imageCard.appendChild(imageTitle);
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-image-buttons");
    actionButtons.dataset.show = "admin";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("btn", "btn-outline-light");
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#EditionPhotoModal");
    editButton.addEventListener("click", () => {
        pictureIdToEdit = id;
        namePhotoInput.value = titre;
        imageInput.value = "";
        editionPhotoModalLabel.textContent = "Modifier la photo";
});

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square");

    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-outline-light");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#DeletePhotoModal");

    deleteButton.addEventListener("click", () => {
        pictureIdToDelete = id;

        deletePictureTitle.textContent = titre;
        deletePictureImage.src = urlImage;
        deletePictureImage.alt = titre;
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash");

    deleteButton.appendChild(deleteIcon);

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    imageCard.appendChild(actionButtons);
    imageContainer.appendChild(imageCard);

  return imageContainer;
}

btnDeletePicture.addEventListener("click", deletePicture);

function deletePicture() {
    if (pictureIdToDelete === null) {
        return;
    }

    fetch(apiUrl + `pictures/${pictureIdToDelete}`, {
        method: "DELETE",
        headers: {
            "X-AUTH-TOKEN": getToken()
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de supprimer l'image");
            }

            if (response.status === 204) {
                const deleteModal = bootstrap.Modal.getInstance(deletePhotoModalElement);
                if (deleteModal) {
                    deleteModal.hide();
                }

                pictureIdToDelete = null;
                deletePictureTitle.textContent = "";
                deletePictureImage.src = "";
                deletePictureImage.alt = "";
                loadGallery();
            }
        })
        .catch(error => {
            console.error(
                "Erreur lors de la suppression de l'image",
                error
            );
        });
}

function createPicture(event) {
    event.preventDefault();

    const title = namePhotoInput.value.trim();
    const image = imageInput.files[0];

    if (!title) {
        return;
    }

    if (pictureIdToEdit === null && !image) {
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (image) {
        formData.append("image", image);
    }
    const endpoint = pictureIdToEdit === null
        ? apiUrl + "pictures"
        : apiUrl + `pictures/${pictureIdToEdit}`;

    fetch(endpoint, {
        method: "POST",
        headers: {
            "X-AUTH-TOKEN": getToken()
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible d'ajouter l'image");
            }

            return response.json();
        })
        .then(() => {
            pictureForm.reset();
            pictureIdToEdit = null;
            loadGallery();
        })
        .catch(error => {
            console.error(
                "Erreur lors de l'ajout de l'image",
                error
            );
        });
}
