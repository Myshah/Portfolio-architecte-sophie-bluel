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
async function displayWorks(id) {
  const gallery = document.querySelector('.gallery')                       // Récupération de l'élément HTML avec la classe .gallery du DOM et le stockage dans la constante gallery
  gallery.innerHTML = "";                                                  // Efface le contenu existant dans l'élément avec la classe .gallery
  //console.log(id)

  const works = await getWorks();                                            // Récupération des données des Projets
  //console.log(getWorks);
  if (id == 0) {
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
      displayFilteredWorks(category.id);                                        // Affiche les projets filtrés par catégorie
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


async function init() {
  const token = localStorage.getItem("token");
  // L'utilisateur est connecté
  if (token) {
    //Cacher le bouton de login
    //Afficher le bouton de logout
    //Cacher les filtres

    // Afficher les éléments avec la classe "admin"
    const adminElements = document.querySelectorAll(".admin");
    adminElements.forEach(element => {
      element.style.display = "block";
    });
    displayWorks(0)
  } else {
    displayWorks(0)
    createFilterButtons();
    // Cacher la classe "admin"
    const adminElements = document.querySelectorAll(".admin");
    adminElements.forEach(element => {
      element.style.display = "none";
    });

    // Cacher le bouton Modifier
    const modifierButton = document.querySelector(".btn-modif");
    if (modifierButton) {
      modifierButton.style.display = "none";
    }

    // Cacherla classe "adminmode"
    const adminModeElement = document.querySelector(".adminmode");
    if (adminModeElement) {
      adminModeElement.style.display = "none";
    }

  }
};

init();


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
    logLink.textContent = 'logout'; // Changer le texte du lien en "Logout"
  } else {
    logLink.textContent = 'login';
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
// Fonction pour afficher les travaux dans la modal
async function afficheWorksDansModal() {
  setupAddButton();
  const worksFromApi = await getWorks(); // Récupération des projets depuis l'API
  const galleryModal = document.querySelector(".gallery-modal"); // Sélection de la galerie dans la modal
  galleryModal.innerHTML = ""; // Nettoyage de la galerie existante   

  document.addEventListener('keydown', disableRefresh); // on desactive reactive la touche F5
  worksFromApi.forEach(work => {
    const workCard = document.createElement("figure");  // Création de la carte projet
    workCard.dataset.id = `categorie${work.categoryId}`;

    const workImgWrapper = document.createElement("div");  // Wrapper pour l'image et le logo
    workImgWrapper.className = "image-wrapper";

    const workImg = document.createElement("img");  // Image du projet
    workImg.src = work.imageUrl;
    workImg.alt = work.title;
    workImgWrapper.appendChild(workImg);

    const trashIcon = document.createElement("i");  // Logo de la poubelle
    trashIcon.className = "fas fa-trash-can trash-icon";  // Classe pour l'icône de la poubelle
    trashIcon.dataset.workId = work.id; // Ajout de l'ID du projet 
    trashIcon.addEventListener('click', () => {
      deleteWork(work.id);
      reafiche();
    });


    workImgWrapper.appendChild(trashIcon);
    workCard.appendChild(workImgWrapper);  // Ajout du wrapper à la carte projet
    galleryModal.appendChild(workCard);  // Ajout de la carte à la galerie de la modal
  });
}


async function reafiche() {
  await afficheWorksDansModal()
}

const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");


btn_modif.addEventListener('click', async function () {
  await afficheWorksDansModal(); // apelle fonction travaux
  modal.style.display = 'block';  // afficher la modal
});

// if (closeButton) {
//   closeButton.addEventListener('click', () => {
//     modal.style.display = 'none';  // Fermer la modal
//     document.removeEventListener('keydown', disableRefresh); //on reactive la touche F5
//     init(); //rafraichir les données une fois la modale quitté
//     const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche
//     backIcon.style.display = 'none'; // Masquer l'icône de flèche gauche
//   });
// }

if (closeButton) {
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';  // Fermer la modal
    document.removeEventListener('keydown', disableRefresh); //on reactive la touche F5
    resetModal();
    init(); //rafraichir les données une fois la modale quitté
  });
}

// Fonction pour supprimer un projet
async function deleteWork(workId) {     //  declarer la Fonction
  const token = localStorage.getItem("token");  // on recupere le token
  const response = await fetch(`${apiUrl}works/${workId}`, {  // 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {  //  verfier la reponse
    throw new Error(`Erreur lors de la suppression du projet : ${response.status}`);
  }
  return response.status;
}

function disableRefresh(event) {
  if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
    event.preventDefault();
    //        alert("Le rafraîchissement de la page est désactivé !");
  }
}


// Fonction pour remplir les catégories dans le formulaire d'ajout
async function remplirCategoriesFormulaire() {
  const categories = await getCategories();
  const selectElement = document.getElementById('workCategory');
  selectElement.innerHTML = '';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}

// Fonction pour afficher le formulaire d'ajout de photo
function setupAddButton() {
  const addButton = document.querySelector('.btn-ajout');
  const formContainer = document.querySelector('.form-container');
  const galleryModal = document.querySelector('.gallery-modal');
  const modalTitle = document.getElementById('galleryTitle');
  const addPhotoTitle = document.getElementById('addPhotoTitle');
  const ajouterPhotoButton = document.getElementById('ajouterPhotoButton');
  const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche

  if (addButton) {
    addButton.addEventListener('click', async () => {
      await remplirCategoriesFormulaire();
      galleryModal.style.display = 'none';
      formContainer.style.display = 'block';
      modalTitle.style.display = 'none';
      addPhotoTitle.style.display = 'block';
      ajouterPhotoButton.style.display = 'none';
      backIcon.style.display = 'block'; // Afficher l'icône de flèche gauche
    });
  }

  if (backIcon) {
    backIcon.addEventListener('click', () => {
      formContainer.style.display = 'none';
      galleryModal.style.display = 'grid';
      modalTitle.style.display = 'block';
      addPhotoTitle.style.display = 'none';
      ajouterPhotoButton.style.display = 'inline-block';
      backIcon.style.display = 'none';
    });
  }
}


// Fonction pour afficher l'aperçu de l'image sélectionnée
function displayImagePreview(event) {
  const imagePreviewContainer = document.getElementById('imagePreview');
  const uploadPhotoSection = document.getElementById('uploadPhotoSection');
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      imagePreviewContainer.innerHTML = ''; // Effacer le contenu précédent
      imagePreviewContainer.appendChild(img);
      uploadPhotoSection.classList.add('image-selected'); // Ajouter la classe pour masquer les éléments non nécessaires
    }
    reader.readAsDataURL(file);
  }
}

// déclaration de la fonction addImageChangeListener
function addImageChangeListener() {
  const workImageInput = document.getElementById('workImage');
  if (workImageInput) {
    workImageInput.addEventListener('change', displayImagePreview);
  } else {
    console.error('Élément de saisie d\'image non trouvé');
  }
}

addImageChangeListener(); // Ajouter l'écouteur d'événement pour l'image ici

// function addModalClickListener() {
//   window.addEventListener('click', (event) => {
//     if (event.target == modal) {
//       modal.style.display = 'none';
//       document.removeEventListener('keydown', disableRefresh); // Réactiver la touche F5
//       resetModal(); // Réinitialiser la modale à son état d'origine
//       init();
//     }
//   });
// }


// Fonction pour réinitialiser la modal
function resetModal() {
  const formContainer = document.querySelector('.form-container');
  const galleryModal = document.querySelector('.gallery-modal');
  const modalTitle = document.getElementById('galleryTitle');
  const addPhotoTitle = document.getElementById('addPhotoTitle');
  const ajouterPhotoButton = document.getElementById('ajouterPhotoButton');
  const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche

  // Réinitialiser le formulaire
  const addWorkForm = document.getElementById('addWorkForm');
  addWorkForm.reset();

  // Réinitialiser l'aperçu de l'image
  const imagePreviewContainer = document.getElementById('imagePreview');
  imagePreviewContainer.innerHTML = '<i class="fa-regular fa-image" id="imageIcon"></i>'; // Remettre l'icône d'image
  const uploadPhotoSection = document.getElementById('uploadPhotoSection');
  uploadPhotoSection.classList.remove('image-selected');

  // Masquer et afficher les éléments appropriés
  formContainer.style.display = 'none';
  galleryModal.style.display = 'grid';
  modalTitle.style.display = 'block';
  addPhotoTitle.style.display = 'none';
  ajouterPhotoButton.style.display = 'inline-block';
  backIcon.style.display = 'none';
}

async function envoyerFormulaireAjoutPhoto(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token manquant");
    return;
  }

  const workImage = document.getElementById('workImage').files[0];
  const workTitle = document.getElementById('workTitle').value;
  const workCategory = document.getElementById('workCategory').value;

  if (!workImage || !workTitle || !workCategory) {
    console.error("Tous les champs du formulaire doivent être remplis");
    return;
  }

  const formData = new FormData();
  formData.append('image', workImage);
  formData.append('title', workTitle);
  formData.append('category', workCategory);

  try {
    const response = await fetch(`${apiUrl}works`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'ajout du projet : ${response.status}`);
    }

    // Rafraîchir l'affichage après l'ajout de l'image
    console.log("Projet ajouté avec succès");
    resetModal();
    modal.style.display = 'none';
    await displayWorks(0);
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur s'est produite lors de l'ajout du projet. Veuillez réessayer.");
  }
}

// Ajoutez un écouteur d'événement pour le formulaire d'ajout de photo
document.getElementById('addWorkForm').addEventListener('submit', envoyerFormulaireAjoutPhoto);