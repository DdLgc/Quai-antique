const homeGallery = document.getElementById("homeGallery");

loadHomeGallery();

function loadHomeGallery() {
    fetch(apiUrl + "pictures")
    .then((response) => {
        if(!response.ok) {
            throw new Error(
                "Impossible de récupérer les images de la galerie",
            );
        }
        return response.json();
    })
    .then((pictures) => {
        displayHomeGallery(pictures.slice(0, 6));
    })
    .catch((error) => {
        console.error(
            "Erreur lors du chargement de la galerie d'accueil",
            error,
        );
    });
}

function displayHomeGallery(pictures) {
    homeGallery.innerHTML = "";

    if (pictures.lenght === 0) {
        const message = document.createElement("p");
        message.classList.add("text-center", "w-100");
        message.textContent = "Aucune photo disponible pour le moment.";

        homeGallery.appendChild(message);
        return;
    }

    pictures.forEach((picture) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("col", "p-3");

        const imageCard = document.createElement("div");
        const image = document.createElement("img");

        if (isValidHomeImageUrl(picture.imageUrl)) {
            image.src = picture.imageUrl;
        } else {
            image.src = "../images/food.jpg";
        }

        image.alt = picture.title;
        image.classList.add("rounded", "w-100");

        const imageTitle = document.createElement("p");
        imageTitle.classList.add("titre-image");
        imageTitle.textContent = picture.title;

        imageCard.appendChild(image);
        imageCard.appendChild(imageTitle);
        imageContainer.appendChild(imageCard);
        homeGallery.appendChild(imageContainer);
    });
}

function isValidHomeImageUrl(url) {
    try {
        const parsedUrl = new URL(
            url,
            window.location.origin,
        );

        return ["http:", "https:"].includes(
            parsedUrl.protocol,
        );
    } catch {
        return false;
    }
}
