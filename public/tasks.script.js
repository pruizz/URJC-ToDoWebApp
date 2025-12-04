document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const modalTareaElement = document.getElementById('modalTarea');

    if (addTaskBtn && modalTareaElement) {
        const modalTarea = new bootstrap.Modal(modalTareaElement);
        const formTarea = document.getElementById('formTarea');
        const fechaInput = formTarea.fechaTarea;

        if (fechaInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const minDate = `${yyyy}-${mm}-${dd}`;
            fechaInput.min = minDate;
        }

        addTaskBtn.addEventListener('click', () => {
            formTarea.editMode.value = 'false';
            formTarea.editTaskId.value = '';
            document.getElementById('modalTareaLabel').textContent = 'Añadir Nueva Tarea';
            document.getElementById('submitBtn').textContent = 'Añadir';
            formTarea.reset();
            modalTarea.show();
        });

        formTarea.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                title: formTarea.tituloTarea.value.trim(),
                description: formTarea.descripcionTarea.value.trim(),
                dueDate: fechaInput.value,
                priority: formTarea.prioridadTarea.value
            };

            const isEditMode = formTarea.editMode.value === 'true';
            const taskId = formTarea.editTaskId.value;
            let url = '/api/task/add';
            if (isEditMode && taskId) {
                url = `/api/tasks/${taskId}/update`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert(isEditMode ? 'Error al actualizar la tarea' : 'Error al añadir la tarea');
            }
        });
    }
});

async function deleteTaskIndex(id) {
    try {
        const res = await fetch(`/api/tasks/${id}/delete`, {
            method: 'POST'
        });
        if (res.ok) {
            window.location.reload();
        } else {
            alert('Error al borrar la tarea');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al borrar la tarea');
    }
}

function editTask(id, title, description, dueDate, priority) {
    document.getElementById('editMode').value = 'true';
    document.getElementById('editTaskId').value = id;
    document.getElementById('tituloTarea').value = title;
    document.getElementById('descripcionTarea').value = description;
    document.getElementById('fechaTarea').value = dueDate;
    document.getElementById('prioridadTarea').value = priority;
    document.getElementById('modalTareaLabel').textContent = 'Editar Tarea';
    document.getElementById('submitBtn').textContent = 'Actualizar';
    const modal = new bootstrap.Modal(document.getElementById('modalTarea'));
    modal.show();
}
