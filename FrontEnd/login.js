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
            if (data.success) {
                alert("Connexion réussie !");

            } else {
                alert("Email ou mot de passe incorrect");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Une erreur s'est produite");
        });
    });
});