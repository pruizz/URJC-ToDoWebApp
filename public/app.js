
// Helper function to convert file to base64 data string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Modal Bootstrap para cerrar sesión
document.addEventListener('DOMContentLoaded', () => {


    const miniCalendarEl = document.getElementById('mini-deadline-calendar');
    if (miniCalendarEl && typeof flatpickr !== 'undefined') {
        try {
            // Obtener los datos de las tareas desde el atributo data
            const taskDatesRaw = miniCalendarEl.getAttribute('data-task-dates');
            console.debug('Task dates raw:', taskDatesRaw);
            
            let taskDates = [];
            if (taskDatesRaw) {
                taskDates = JSON.parse(taskDatesRaw);
                console.debug('Task dates parsed:', taskDates);
            }

            // Crear un mapa de fechas para búsqueda rápida
            const dateMap = {};
            taskDates.forEach(item => {
                dateMap[item.date] = item.priority; // 'alta', 'media', 'baja'
            });
            console.debug('Date map:', dateMap);

            // Inicializar Flatpickr
            flatpickr(miniCalendarEl, {
                inline: true,
                locale: 'es',
                defaultDate: new Date(),
                onDayCreate: function(dObj, dStr, fp, dayElem) {
                    // Formatear la fecha en formato Y-m-d (2025-11-19)
                    const dateStr = fp.formatDate(dayElem.dateObj, 'Y-m-d');
                    
                    // Verificar si hay una tarea en esta fecha
                    if (dateMap[dateStr]) {
                        const priority = dateMap[dateStr];
                        // Crear el punto de color
                        const dot = document.createElement('span');
                        dot.className = `event-dot event-dot-${priority}`;
                        dayElem.appendChild(dot);
                        console.debug(`Added dot for ${dateStr} with priority ${priority}`);
                    }
                }
            });
            console.debug('Flatpickr initialized successfully');
        } catch (error) {
            console.error('Error initializing Flatpickr:', error);
        }
    }

    const addTaskBtn = document.getElementById('add-task-btn');
    const modalTareaElement = document.getElementById('modalTarea');

    if (addTaskBtn && modalTareaElement) {
        const modalTarea = new bootstrap.Modal(modalTareaElement);
        // Obtenemos el formulario primero para poder usarlo
        const formTarea = document.getElementById('formTarea');

        // --- INICIO DE LA MODIFICACIÓN ---
        // Obtenemos el campo de la fecha (basado en tu código de submit)
        const fechaInput = formTarea.fechaTarea;

        if (fechaInput) {
            // Calcular la fecha de hoy en formato YYYY-MM-DD
            const today = new Date();
            const yyyy = today.getFullYear();
            // getMonth() es 0-indexado (0=Ene, 11=Dic), por eso +1
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const minDate = `${yyyy}-${mm}-${dd}`;

            // Establecer el atributo 'min' para bloquear fechas pasadas
            fechaInput.min = minDate;
        }
        // --- FIN DE LA MODIFICACIÓN ---

        // Abrir modal al hacer clic en "Añadir tarea"
        addTaskBtn.addEventListener('click', () => {
            // Desactivar el modo edición
            formTarea.editMode.value = 'false';
            formTarea.editTaskId.value = '';
            // Cambiar el título del modal
            document.getElementById('modalTareaLabel').textContent = 'Añadir Nueva Tarea';
            document.getElementById('submitBtn').textContent = 'Añadir';
            // Vaciar el formulario
            formTarea.reset();
            modalTarea.show();
        });

        // Manejar envío del formulario
        formTarea.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtener los datos del formulario
            const data = {
                title: formTarea.tituloTarea.value.trim(),
                description: formTarea.descripcionTarea.value.trim(),
                dueDate: fechaInput.value,
                priority: formTarea.prioridadTarea.value
            };

            // Comprobar si estamos en modo edición
            const isEditMode = formTarea.editMode.value === 'true';
            const taskId = formTarea.editTaskId.value;

            // Determinar la URL y el método HTTP según el modo
            let url = '/task/add';
            let method = 'POST';
            if (isEditMode && taskId) {
                url = `/tasks/${taskId}/update`;
                method = 'POST'; // Using POST for simplicity, could be PUT
            }

            // Enviar la tarea al backend (añadir o actualizar)
            const response = await fetch(url, {
                method: method,
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
                alert(isEditMode ? 'Error al actualizar la tarea' : 'Error al añadir la tarea');
            }

            modalTarea.hide();
            formTarea.reset();
            
            // Reset edit mode
            formTarea.editMode.value = 'false';
            formTarea.editTaskId.value = '';
            document.getElementById('modalTareaLabel').textContent = 'Añadir Nueva Tarea';
            document.getElementById('submitBtn').textContent = 'Añadir';
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

// Function to edit a task - populates the modal with existing task data
function editTask(id, title, description, dueDate, priority) {
    // Set edit mode
    document.getElementById('editMode').value = 'true';
    document.getElementById('editTaskId').value = id;
    
    // Populate form fields
    document.getElementById('tituloTarea').value = title;
    document.getElementById('descripcionTarea').value = description;
    document.getElementById('fechaTarea').value = dueDate;
    document.getElementById('prioridadTarea').value = priority;
    
    // Update modal title and button
    document.getElementById('modalTareaLabel').textContent = 'Editar Tarea';
    document.getElementById('submitBtn').textContent = 'Actualizar';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('modalTarea'));
    modal.show();
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
    const fotoInput = document.getElementById("formFileSm");

    let profilePhotoData = null;

    // If a file is selected, convert it to base64
    if (fotoInput.files && fotoInput.files[0]) {
        try {
            profilePhotoData = await fileToBase64(fotoInput.files[0]);
        } catch (error) {
            console.error('Error converting file to base64:', error);
            alert('Error processing the image file');
            return;
        }
    }

    const response = await fetch("/newUser", {
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
