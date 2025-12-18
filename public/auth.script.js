// Helper function to convert file to base64 data string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function checkUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    const result = await response.json();

    if (result.error === undefined) {
        window.location.href = '/home';
    } else {
        alert("Incorrecto")
    }

}

async function checkUsernameAvailability() {
    const username = document.getElementById("usernameR").value
    const response = await fetch("/api/duplicateUsername", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username
        })
    })

    const result = await response.json()
    const feedback = document.getElementById("usernameFeedback")
    const button = document.getElementById("newAccountBt")
    if (!result) {
        feedback.innerHTML = "Ese nombre de usuario no está disponible, prueba con otro."
        button.disabled = true;
    } else {
        feedback.innerHTML = ""
        button.disabled = false;
    }
}

async function checkEmailAvailability() {
    const email = document.getElementById("emailR").value
    const response = await fetch("/api/duplicateEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    })

    const result = await response.json()
    const feedback = document.getElementById("emailFeedback")
    const button = document.getElementById("newAccountBt")
    if (!result) {
        feedback.innerHTML = "Ese email ya ha sido registrado, prueba a iniciar sesión con tu nombre de usuario."
        button.disabled = true;
    } else {
        feedback.innerHTML = ""
        button.disabled = false;
    }
}

function checkSamePassword() {
    const password_1 = document.getElementById("passwordR1").value
    const password_2 = document.getElementById("passwordR2").value
    const feedback = document.getElementById("passwordFeedback")
    const button = document.getElementById("newAccountBt")

    if (password_1 !== password_2) {
        feedback.innerHTML = "Las contraseñas no coinciden."
        button.disabled = true;
    } else {
        feedback.innerHTML = ""
        button.disabled = false;
    }
}

async function newUser(event) {
    event.preventDefault();
    const username = document.getElementById("usernameR").value;
    const email = document.getElementById("emailR").value;
    const password = document.getElementById("passwordR2").value;
    const fotoInput = document.getElementById("formFileSm");

    let profilePhotoData = null;

    if (fotoInput.files && fotoInput.files[0]) {
        try {
            profilePhotoData = await fileToBase64(fotoInput.files[0]);
        } catch (error) {
            console.error('Error converting file to base64:', error);
            alert('Error processing the image file');
            return;
        }
    }

    const response = await fetch("/api/newUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            profile_photo: profilePhotoData || null
        })
    })

    const result = await response.json();

    if (result) {
        alert("Usuario creado con éxito")
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutButton = document.getElementById('confirmLogout');
    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener('click', async () => {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Error al cerrar sesión.');
            }
        });
    }
});
