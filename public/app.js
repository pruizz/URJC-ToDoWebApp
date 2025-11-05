

// Modal Bootstrap para cerrar sesión
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.querySelector('.logout-link');
    const confirmBtn = document.getElementById('confirmLogout');
    let logoutModal;
    if (window.bootstrap) {
        logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (logoutModal) {
                logoutModal.show();
            }
        });
    }
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function () {
            // Aquí puedes redirigir o hacer logout
            // Redirigir a la página de login al confirmar cierre de sesión
            const res = await fetch(`/currentUser/null`, {
                method: 'POST'
            });
            if (res.ok) {
                window.location.href = '/';
            } else {
                alert('Error al cerrar sesión');
            }
        });
    }
});

async function deleteTaskIndex(event, id) {

    try {
        const res = await fetch(`/tasks/${id}/delete`, {
            method: 'POST'
        });

        if (res.ok) {
            window.location.href = '/home';
        } else {
            alert('Error al borrar la tarea');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al borrar la tarea');
    }
}

async function processTaskData(event) {
    event.preventDefault();
    const taskForm = document.getElementById('taskForm');

    
    const formData = new FormData(event.target);
    const response = await fetch('/task/add', {
        method: 'POST',
        body: new URLSearchParams(formData),
    });

    if (response.ok) {
        window.location.href = '/home';
    }
}


async function checkUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch("/checkUser", {
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

    if (result) {
        window.location.href = '/home';
    } else {
        alert("Incorrecto")
    }

}

async function checkUsernameAvailability() {
    const username = document.getElementById("usernameR").value
    const response = await fetch("/duplicateUsername", {
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
    const response = await fetch("/duplicateEmail", {
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
    const password1 = document.getElementById("passwordR1").value
    const password2 = document.getElementById("passwordR2").value
    const feedback = document.getElementById("passwordFeedback")
    const button = document.getElementById("newAccountBt")

    if (password1 !== password2) {
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


    const response = await fetch("/newUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })

    const result = await response.json();

    if (result) {
        alert("Usuario creado con éxito")
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const modalTareaElement = document.getElementById('modalTarea');

    if (addTaskBtn && modalTareaElement) {
        const modalTarea = new bootstrap.Modal(modalTareaElement);

        // Abrir modal al hacer clic en "Añadir tarea"
        addTaskBtn.addEventListener('click', () => {
            modalTarea.show();
        });

        // Manejar envío del formulario
        const formTarea = document.getElementById('formTarea');
        formTarea.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtener los datos del formulario con los nombres que espera el backend
            const data = {
                title: formTarea.tituloTarea.value.trim(),
                description: formTarea.descripcionTarea.value.trim(),
                dueDate: formTarea.fechaTarea.value,
                priority: formTarea.prioridadTarea.value
            };

            // Enviar la tarea al backend
            const response = await fetch('/task/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                if (window.location.pathname === '/tasks') {
                    window.location.href = '/tasks';
                } else {
                    window.location.href = '/home';
                }
            } else {
                alert('Error al añadir la tarea');
            }
            modalTarea.hide();
            formTarea.reset();
        });
    }
});

// Asignar color de prioridad y completado en dashboard (index)
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.mini-task-card').forEach(function (el) {
        var p = (el.className.match(/priority-(\w+)/) || [])[1];
        if (p === 'high') el.classList.add('priority-high');
        else if (p === 'medium') el.classList.add('priority-medium');
        else if (p === 'low') el.classList.add('priority-low');

        if (el.classList.contains('completed')) el.classList.add('completed');
    });
});
