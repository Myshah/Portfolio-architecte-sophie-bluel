document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.login_form').addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const user = JSON.stringify({ email, password });

        // Envoi de la requête
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: user
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert("Connexion réussie !");
                // stocker les infos d'authentification
                localStorage.setItem("token", data.token);
                localStorage.setItem('userId', data.userId)
                // rediriger vers la page d’accueil 
                window.location.href = "index.html";

            } else {
               // console.log(data)
                alert("Email ou mot de passe incorrect");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Une erreur s'est produite");
        });
    });
});