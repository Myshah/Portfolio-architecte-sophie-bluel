/* Variables*/
const apiUrl = 'http://localhost:5678/api/'                                  //Stockage de l'adresse de l'API
let works = [];

//*** Récupération des Projets de l'API ***//
async function getWorks() {
  try {
    const response = await fetch(`${apiUrl}works`);

    if (!response.ok) {
      throw new Error(`La requête API a échoué avec le statut : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des Projets :', error);
    return [];
  }
}

getWorks()
  .then(works => {
    console.log('Projets récupérés avec succès :', works);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des Projets :', error);
  });


//*** Récupération des Catégories de l'API ***// 
async function getCategories() {                                             // Fonction unique pour les deux requêtes
  try {                                                                      // Vérification des erreurs potentielles dans le bloc async
    const response = await fetch(`${apiUrl}categories`);                     // Requête dans l'API

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }

    const data = await response.json();                                      // Conversion des données au format json
    return data;
  } catch (error) {                                                          // Réception des erreurs potentielles du bloc async
    console.log('Erreur lors de la récupération des catégories :', error);   // Visualisation des erreurs
    return [];                                                               // Retourne des objets vides en cas d'erreur
  }
}

getCategories()
  .then(data => {
    console.log('Catégories récupérées avec succès :', data);
  })
  .catch(error => {
    console.log('Erreur lors de la récupération des Catégories :', error);
  });

//*** Affichage dynamique de la galerie ***//
async function displayWorks(id){
    const gallery = document.querySelector('.gallery')                       // Récupération de l'élément HTML avec la classe .gallery du DOM et le stockage dans la constante gallery
    gallery.innerHTML = "";                                                  // Efface le contenu existant dans l'élément avec la classe .gallery
    //console.log(id)
      
  const works = await getWorks();                                            // Récupération des données des Projets
  //console.log(getWorks);
  if (id == 0){
    filteredWorks = works.filter((work) => work.categoryId != id);
  } else {
    filteredWorks = works.filter((work) => work.categoryId === id);  // Filtre les projets en fonction de la catégorie sélectionnée
  }
  

  filteredWorks.forEach(work => {                                                    // Boucle pour chaque Projet (forEach)

    const figure = document.createElement('figure');                         // Création des éléments HTML pour chaque Projet
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
    //console.log('Affichage des Projets :', work.title);

    figure.appendChild(img);                                                 // Construction de la structure HTML
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }); 
}

displayWorks(0)

//*** Filtres ***//
async function createFilterButtons() {
  const cats = await getCategories()
  const categorySet = new Set();                                             // "Set" pour stocker les catégories uniques
      cats.forEach(cat => {                                                  // Extraire les catégories uniques des projets
      categorySet.add(cat);                                   // Ajoute la catégorie au Set
  });
  //console.log(categorySet)
  const filterContainer = document.querySelector('.filter');                 // Sélectionne l'élément conteneur pour les filtres

  /* Création des boutons de filtre */
  // Ajout d'un bouton pour afficher tous les projets
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('all');
  allButton.addEventListener('click', () => {
    displayFilteredWorks(0);                                                    // Affiche tous les projets quand on appuie sur "Tous"
    setActiveButton(allButton);                                                // Active le bouton "Tous"
  });
  filterContainer.appendChild(allButton);                                      // Ajoute le bouton "Tous"

  // Création des boutons pour chaque catégorie
  categorySet.forEach(category => {
  //  console.log(category)
  //  console.log(category.key)
  const button = document.createElement('button');
  button.textContent = category.name;
  button.id = category.id
   button.addEventListener('click', () => {
    displayFilteredWorks(category.id);                                          // Affiche les projets filtrés par catégorie
    setActiveButton(button);                                                 // Active le bouton de la catégorie
  });
    filterContainer.appendChild(button);
  });
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.filter button');                 // Sélectionne tous les boutons de filtre
  buttons.forEach(button => button.classList.remove('active'));                // Retire la classe 'active' de tous les boutons
  activeButton.classList.add('active');                                        // Ajoute la classe 'active' au bouton cliqué
}

createFilterButtons();

function displayFilteredWorks(idCat) {
  displayWorks(idCat)
}

/* ADMIN */
// *** Gestion de la connexion/déconnexion *** //
document.addEventListener('DOMContentLoaded', () => {
  const logLink = document.getElementById('logLink'); // Lien login/logout

  // Vérifie et met à jour l'état de connexion au chargement et après chaque action
  updateLoginStatus();

  // Gestion du clic sur le lien login/logout
  logLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (localStorage.getItem('token') && localStorage.getItem('userId')) {
          logout(); // Déconnexion si déjà connecté
      } else {
          window.location.href = "login.html"; // Redirection vers la page de connexion si non connecté
      }
  });
});

// Fonction pour mettre à jour l'affichage en fonction de l'état de connexion
function updateLoginStatus() {
  const logLink = document.getElementById('logLink');
  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId'); // Vérifie l'état à chaque appel

  if (isLoggedIn) {
      logLink.textContent = 'Logout'; // Changer le texte du lien en "Logout"
  } else {
      logLink.textContent = 'Login';
  }
}

// Fonction de déconnexion
function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  updateLoginStatus(); // Mettre à jour l'état de connexion après déconnexion
  alert('Vous avez été déconnecté.');
  window.location.href = "index.html"; // Redirection vers la page d'accueil après la déconnexion
}

/* Modale */
let modal = null;

async function createWorkElements() {
  const works = await getWorks();
  const elements = [];

  works.forEach(work => {
      // ... (code pour créer les éléments figure, img et figcaption)
  });

  return elements;
}

// Ouvrir la modale avec les Works
async function openModal(event) {
  event.preventDefault();

  const isLoggedIn = localStorage.getItem('token') !== null;
  if (!isLoggedIn) {
      return; 
  }

  const target = document.querySelector(event.target.getAttribute('href'));
  modal = target;
  target.style.display = null;
  target.classList.remove('aria-hidden');
  target.setAttribute('aria-modal', 'true');

  const modalGallery = document.querySelector('.modal .modalGallery');
  modalGallery.innerHTML = ""; 

  try {
      const response = await fetch(`${apiUrl}works`); // Appel à l'API dans la modale
      if (!response.ok) {
          throw new Error(`La requête API a échoué avec le statut : ${response.status}`);
      }
      const works = await response.json();

      works.forEach(work => {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');

          img.src = work.imageUrl;
          img.alt = work.title;
          figcaption.textContent = work.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);
          modalGallery.appendChild(figure);
      });
  } catch (error) {
      console.error('Erreur lors de la récupération des projets dans la modale :', error);
  }
}

// Fermer la modale
function closeModal(event) {
  if (modal === null) return;
  event.preventDefault();
  modal.style.display = "none";
  modal.classList.add('aria-hidden');
  modal.removeAttribute('aria-modal');
  modal = null;
}

// Gestionnaire d'événements pour les clics
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('js-modal')) {
    openModal(e);
  } else if (e.target.classList.contains('js-modal-close') || e.target.closest('.modal') === modal) {
    closeModal(e);
  }
});

function updateModalLinks() {
  const modalLinks = document.querySelectorAll('.js-modal');
  modalLinks.forEach(link => {
    link.style.display = localStorage.getItem('token') !== null ? 'block' : 'none';
  });
}

updateModalLinks();