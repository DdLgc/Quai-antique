const galerieImage = document.getElementById("allImages");

let titre = "titre de l'image";
let imageSource = "../images/food.jpg";

let monImage = getImage(titre, imageSource);
galerieImage.appendChild(monImage);

function isValidImageUrl(url) {
    try {
        const parsedUrl = new URL(url, window.location.origin);

        return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}

function getImage(titre, urlImage) {
    const imageContainer = document.createElement("div");

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

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square");

    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-outline-light");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#DeletePhotoModal");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash");

    deleteButton.appendChild(deleteIcon);

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    imageCard.appendChild(actionButtons);


    imageContainer.appendChild(imageCard);
  
  return imageContainer;
}
