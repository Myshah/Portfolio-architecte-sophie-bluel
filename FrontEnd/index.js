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
async function displayWorks(id){
    const gallery = document.querySelector('.gallery')                       // Récupération de l'élément HTML avec la classe .gallery du DOM et le stockage dans la constante gallery
    gallery.innerHTML = "";                                                  // Efface le contenu existant dans l'élément avec la classe .gallery
//    console.log(id)
      
  const works = await getWorks();                                            // Récupération des données des Projets
//  console.log(getWorks);
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
//    console.log('Affichage des Projets :', work.title);

    figure.appendChild(img);                                                 // Construction de la structure HTML
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }); 
}

displayWorks(0)

//*** Filtres ***//
async function createFilterButtons() {
 // const works = await getWorks();                                            // Récupération des projets
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