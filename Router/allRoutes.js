import Route from "./Route.js";
//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[]),
    new Route("/galerie", "La galerie", "/pages/galerie.html",[],"js/galerie.js"),
    new Route("/menus", "La carte", "/pages/menus.html", [], "/js/menus.js"),
    new Route("/signin", "Connexion", "/pages/auth/signin.html",["disconnected"],"/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html",["disconnected"],"/js/auth/signup.js"),
    new Route("/account", "Mon compte", "/pages/auth/account.html", ["ROLE_USER", "ROLE_ADMIN"], "/js/auth/account.js"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html",["ROLE_USER", "ROLE_ADMIN"],"/js/auth/editPassword.js"),
    new Route("/allResa", "Vos réservations", "/pages/reservations/allResa.html",["ROLE_USER"],"/js/reservations/allResa.js"),
    new Route("/reserver", "Réserver", "/pages/reservations/reserver.html",["ROLE_USER"], "/js/reservations/reserver.js"),
];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";