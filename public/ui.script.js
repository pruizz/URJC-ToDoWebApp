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

    // Filters and complete handling
    // Centralized filter application function
    function applyFilter(filter) {
        document.querySelectorAll('.task-card').forEach(card => {
            // reset display
            card.style.display = '';

            if (!filter || filter === 'all') return;

            // determine completed state robustly (dataset or class)
            const isCompleted = (card.dataset.completed === 'true') || card.classList.contains('completed');

            if (filter === 'pending' && isCompleted) {
                card.style.display = 'none';
                return;
            }
            if (filter === 'completed' && !isCompleted) {
                card.style.display = 'none';
                return;
            }
            if (filter.startsWith('priority-') && !card.classList.contains(filter)) {
                card.style.display = 'none';
                return;
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(btn => btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        applyFilter(filter);
    }));

    document.querySelectorAll('.task-card').forEach(function (el) {
        var p = (el.dataset.priority || '').toLowerCase();
        if (p === 'high') el.classList.add('priority-high');
        else if (p === 'medium') el.classList.add('priority-medium');
        else if (p === 'low') el.classList.add('priority-low');

        if (el.dataset.completed === 'true') el.classList.add('completed');
    });
});
