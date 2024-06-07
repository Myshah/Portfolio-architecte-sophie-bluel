/* Variables*/
const apiUrl = 'http://localhost:5678/api/'                                  //Stockage de l'adresse de l'API

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
    // Traiter les œuvres récupérées ici
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
async function displayWorks(){
    const gallery = document.querySelector('.gallery')                       // Récupération de l'élément HTML avec la classe .gallery du DOM et le stockage dans la constante gallery
    gallery.innerHTML = "";                                                  // Efface le contenu existant dans l'élément avec la classe .gallery
//    console.log(gallery)
      
  const works = await getWorks();                                            // Récupération des données des Projets
//  console.log(getWorks);

  works.forEach(work => {                                                    // Boucle pour chaque Projet (forEach)
    const figure = document.createElement('figure');                         // Création des éléments HTML pour chaque Projet
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
//    console.log('Affichage des Projets :', work.title);

    figure.appendChild(img);                                                 // Construction de la structure HTML
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }); 
}

displayWorks()

//*** Filtres ***//
async function createFilterButtons() {
  const works = await getWorks();
  const categorySet = new Set();

  // Extraire les catégories uniques des projets
  works.forEach(work => {
    if (work.category && work.category.name) {
      categorySet.add(work.category.name);
    }
  });

  const filterContainer = document.querySelector('.filter');

// Ajout d'un bouton pour afficher tous les projets en premier
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.classList.add('all');
allButton.addEventListener('click', () => {
  displayFilteredWorks();
  setActiveButton(allButton);
});
filterContainer.appendChild(allButton);

categorySet.forEach(category => {
  const button = document.createElement('button');
  button.textContent = category;
  button.addEventListener('click', () => {
    displayFilteredWorks(category);
    setActiveButton(button);
  });
  filterContainer.appendChild(button);
});
}

function setActiveButton(activeButton) {
const buttons = document.querySelectorAll('.filter button');
buttons.forEach(button => button.classList.remove('active'));
activeButton.classList.add('active');
}

createFilterButtons();

async function displayFilteredWorks(categoryName = null) {
const gallery = document.querySelector('.gallery');
gallery.innerHTML = "";

const works = await getWorks();
const filteredWorks = categoryName ? works.filter(work => work.category && work.category.name === categoryName) : works;

//retravailler cette partie pour la condenser car doublons
filteredWorks.forEach(work => {
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  const figcaption = document.createElement('figcaption');

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
});
}

displayFilteredWorks();