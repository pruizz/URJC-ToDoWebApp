document.addEventListener('DOMContentLoaded', () => {
    const miniCalendarEl = document.getElementById('mini-deadline-calendar');
    if (miniCalendarEl && typeof flatpickr !== 'undefined') {
        try {
            const taskDatesRaw = miniCalendarEl.getAttribute('data-task-dates');
            let taskDates = [];
            if (taskDatesRaw) {
                taskDates = JSON.parse(taskDatesRaw);
            }
            const dateMap = {};
            taskDates.forEach(item => {
                dateMap[item.date] = item.priority;
            });
            flatpickr(miniCalendarEl, {
                inline: true,
                locale: 'es',
                defaultDate: new Date(),
                onDayCreate: function(dObj, dStr, fp, dayElem) {
                    const dateStr = fp.formatDate(dayElem.dateObj, 'Y-m-d');
                    if (dateMap[dateStr]) {
                        const priority = dateMap[dateStr];
                        const dot = document.createElement('span');
                        dot.className = `event-dot event-dot-${priority}`;
                        dayElem.appendChild(dot);
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing Flatpickr:', error);
        }
    }

    document.querySelectorAll('.mini-task-card').forEach(function (el) {
        var p = (el.className.match(/priority-(\w+)/) || [])[1];
        if (p === 'high') el.classList.add('priority-high');
        else if (p === 'medium') el.classList.add('priority-medium');
        else if (p === 'low') el.classList.add('priority-low');

        if (el.classList.contains('completed')) el.classList.add('completed');
    });
});
