/* Variables*/
const apiUrl = 'http://localhost:5678/api/' //Stockage de l'adresse de l'API
let works = [];

//*** Récupération des Projets de l'API ***//

// Sélection du conteneur pour le message d'erreur
const errorMessageElement = document.getElementById('error-message');

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
    // Afficher le message d'erreur sur la page
    errorMessageElement.style.display = 'block';
    return [];
  }
}

getWorks()
  .then(works => {
    console.log('Projets récupérés avec succès :', works);
    // Cacher le message d'erreur si les projets sont récupérés avec succès
    if (works.length > 0) {
      errorMessageElement.style.display = 'none';
    }
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des Projets :', error);
  });


//*** Récupération des Catégories de l'API ***// 
async function getCategories() {
  // Vérification des erreurs potentielles dans le bloc async
  try {
    // Requête dans l'API                                                                      
    const response = await fetch(`${apiUrl}categories`);                     

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }

    // Conversion des données au format json
    const data = await response.json();                                      
    return data;
  // Réception des erreurs potentielles du bloc async
  } catch (error) {
    // Visualisation des erreurs                                                          
    console.log('Erreur lors de la récupération des catégories :', error);
    // Retourne des objets vides en cas d'erreur   
    return [];                                                               
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
  // Récupération de l'élément HTML avec la classe .gallery du DOM et le stockage dans la constante gallery
  const gallery = document.querySelector('.gallery')
  // Efface le contenu existant dans l'élément avec la classe .gallery
  gallery.innerHTML = "";                                                  
  //console.log(id)

  // Récupération des données des Projets
  const works = await getWorks();                                            
  //console.log(getWorks);
  if (id == 0) {
    filteredWorks = works.filter((work) => work.categoryId != id);
  } else {
    // Filtre les projets en fonction de la catégorie sélectionnée
    filteredWorks = works.filter((work) => work.categoryId === id);  
  }

  // Boucle pour chaque Projet (forEach)
  filteredWorks.forEach(work => {                                            

    // Création des éléments HTML pour chaque Projet
    const figure = document.createElement('figure');                         
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
    //console.log('Affichage des Projets :', work.title);

    // Construction de la structure HTML
    figure.appendChild(img);                                                 
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

//*** Filtres ***//
async function createFilterButtons() {
  const cats = await getCategories()
  const categorySet = new Set();                                                 // "Set" pour stocker les catégories uniques
  cats.forEach(cat => {                                                          // Extraire les catégories uniques des projets
    categorySet.add(cat);                                                        // Ajoute la catégorie au Set
  });
  //console.log(categorySet)
  const filterContainer = document.querySelector('.filter');                     // Sélectionne l'élément conteneur pour les filtres

  /* Création des boutons de filtre */
  // Ajout d'un bouton pour afficher tous les projets
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('all', "active");
  allButton.addEventListener('click', () => {  
    displayFilteredWorks(0);                                                      // Affiche tous les projets quand on appuie sur "Tous"
    setActiveButton(allButton);                                                   // Active le bouton "Tous"
  });
  filterContainer.appendChild(allButton);                                         // Ajoute le bouton "Tous"

  // Création des boutons pour chaque catégorie
  categorySet.forEach(category => {
    //  console.log(category)
    //  console.log(category.key)
    const button = document.createElement('button');
    button.textContent = category.name;
    button.id = category.id
    button.addEventListener('click', () => {
      displayFilteredWorks(category.id);                                           // Affiche les projets filtrés par catégorie
      setActiveButton(button);                                                    // Active le bouton de la catégorie
    });
    filterContainer.appendChild(button);
  });
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.filter button');                     // Sélectionne tous les boutons de filtre
  buttons.forEach(button => button.classList.remove('active'));                    // Retire la classe 'active' de tous les boutons
  activeButton.classList.add('active');                                            // Ajoute la classe 'active' au bouton cliqué
}


async function init() {
  const token = localStorage.getItem("token");
  // L'utilisateur est connecté
  if (token) {

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
  // Lien login/logout
  const logLink = document.getElementById('logLink'); 

  // Vérifie et met à jour l'état de connexion au chargement et après chaque action
  updateLoginStatus();

  // Gestion du clic sur le lien login/logout
  logLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
      logout(); // Déconnexion si déjà connecté
    } else {
      // Redirection vers la page de connexion si non connecté
      window.location.href = "login.html"; 
    }
  });
});

// Fonction pour mettre à jour l'affichage en fonction de l'état de connexion
function updateLoginStatus() {
  const logLink = document.getElementById('logLink');
  // Vérifie l'état à chaque appel
  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId'); 

  if (isLoggedIn) {
    // Changer le texte du lien en "Logout"
    logLink.textContent = 'logout'; 
  } else {
    logLink.textContent = 'login';
  }
}

// Fonction de déconnexion
function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  // Mettre à jour l'état de connexion après déconnexion
  updateLoginStatus(); 
  alert('Vous avez été déconnecté.');
  // Redirection vers la page d'accueil après la déconnexion
  window.location.href = "index.html"; 
}

/* Modale */
// Fonction pour afficher les travaux dans la modal
async function afficheWorksDansModal() {
  setupAddButton();
  // Récupération des projets depuis l'API
  const worksFromApi = await getWorks(); 
  // Sélection de la galerie dans la modal
  const galleryModal = document.querySelector(".gallery-modal"); 
  // Nettoyage de la galerie existante 
  galleryModal.innerHTML = "";   

  // on desactive reactive la touche F5
  document.addEventListener('keydown', disableRefresh); 
  worksFromApi.forEach(work => {
    // Création de la carte projet
    const workCard = document.createElement("figure");  
    workCard.dataset.id = `categorie${work.categoryId}`;

    // Wrapper pour l'image et le logo
    const workImgWrapper = document.createElement("div");  
    workImgWrapper.className = "image-wrapper";

    // Image du projet
    const workImg = document.createElement("img");  
    workImg.src = work.imageUrl;
    workImg.alt = work.title;
    workImgWrapper.appendChild(workImg);

    // Logo de la poubelle
    const trashIcon = document.createElement("i");  
    // Classe pour l'icône de la poubelle
    trashIcon.className = "fas fa-trash-can trash-icon";  
    // Ajout de l'ID du projet
    trashIcon.dataset.workId = work.id;  
    trashIcon.addEventListener('click', () => {
      deleteWork(work.id);
      reafiche();
    });


    workImgWrapper.appendChild(trashIcon);
    // Ajout du wrapper à la carte projet
    workCard.appendChild(workImgWrapper);  
    // Ajout de la carte à la galerie de la modal
    galleryModal.appendChild(workCard);  
  });
}


async function reafiche() {
  await afficheWorksDansModal()
}

const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");


btn_modif.addEventListener('click', async function () {
  // apelle fonction travaux
  await afficheWorksDansModal(); 
  // afficher la modal
  modal.style.display = 'block';  
});

if (closeButton) {
  closeButton.addEventListener('click', () => {
    // Fermer la modal
    modal.style.display = 'none';  
    //on reactive la touche F5
    document.removeEventListener('keydown', disableRefresh); 
    resetModal();
    //rafraichir les données une fois la modale quitté
    init(); 
  });
}

// Fonction pour supprimer un projet
async function deleteWork(workId) {   
  // on recupere le token
  const token = localStorage.getItem("token");  
  const response = await fetch(`${apiUrl}works/${workId}`, {  
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression du projet : ${response.status}`);
  }
  return response.status;
}

function disableRefresh(event) {
  if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
    event.preventDefault();
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
  // Sélectionner l'icône de flèche gauche
  const backIcon = document.querySelector('.back-icon'); 

  if (addButton) {
    addButton.addEventListener('click', async () => {
      await remplirCategoriesFormulaire();
      galleryModal.style.display = 'none';
      formContainer.style.display = 'block';
      modalTitle.style.display = 'none';
      addPhotoTitle.style.display = 'block';
      ajouterPhotoButton.style.display = 'none';
      // Afficher l'icône de flèche gauche
      backIcon.style.display = 'block'; 
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
      // Effacer le contenu précédent
      imagePreviewContainer.innerHTML = ''; 
      imagePreviewContainer.appendChild(img);
      // Ajouter la classe pour masquer les éléments non nécessaires
      uploadPhotoSection.classList.add('image-selected'); 
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

addImageChangeListener();


// Fonction pour réinitialiser la modal
function resetModal() {
  const formContainer = document.querySelector('.form-container');
  const galleryModal = document.querySelector('.gallery-modal');
  const modalTitle = document.getElementById('galleryTitle');
  const addPhotoTitle = document.getElementById('addPhotoTitle');
  const ajouterPhotoButton = document.getElementById('ajouterPhotoButton');
  // Sélectionner l'icône de flèche gauche
  const backIcon = document.querySelector('.back-icon'); 

  // Réinitialiser le formulaire
  const addWorkForm = document.getElementById('addWorkForm');
  addWorkForm.reset();

  // Réinitialiser l'aperçu de l'image
  const imagePreviewContainer = document.getElementById('imagePreview');
  // Remettre l'icône d'image
  imagePreviewContainer.innerHTML = '<i class="fa-regular fa-image" id="imageIcon"></i>'; 
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