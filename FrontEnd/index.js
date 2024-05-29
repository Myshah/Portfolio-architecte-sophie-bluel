// Variables
const apiUrl = 'http://localhost:5678/api/'   //Stockage de l'adresse de l'API

// Récupération des Projets de l'API
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
    return []; // Exemple : Retourner un tableau vide en cas d'erreur
  }
}

getWorks()
  .then(works => {
    console.log('Projets récupérés avec succès :', works);
    // Traiter les œuvres récupérées ici
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des Projets :', error);
    // Gérer l'erreur dans l'interface utilisateur ou fournir un mécanisme de secours
  });


// Récupération des Catégories de l'API 
async function getCategories() {                                     // Fonction unique pour les deux requêtes
  try {                                                                      // Vérification des erreurs potentielles dans le bloc async
    const response = await fetch(`${apiUrl}categories`);           // Requête dans l'API

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }

    const data = await response.json();                                      // Conversion des données au format json
    return data;
  } catch (error) {                                                          // Réception des erreurs potentielles du bloc async
    console.log('Erreur lors de la récupération des catégories :', error);  // Visualisation des erreurs
    return [];                                    // Retourne des objets vides en cas d'erreur
  }
}

getCategories()
  .then(data => {
    console.log('Catégories récupérées avec succès :', data);
  })
  .catch(error => {
    console.log('Erreur lors de la récupération des Catégories :', error);
  });

// Affichage dynamique de la gallerie