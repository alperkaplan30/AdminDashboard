document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable .field');
    const containers = document.querySelectorAll('.draggable');
    const saveButton = document.getElementById('save-button');
    const patientNameInput = document.getElementById('patient-name');

    // Regular Expression for Patient Name
    const nameRegex = /^[A-Za-z\s]{2,50}$/;

    
    saveButton.addEventListener('click', (e) => {
        const patientName = patientNameInput.value.trim();

        if (!nameRegex.test(patientName)) {
            e.preventDefault(); 
            alert('Please enter a valid patient name. (Letters and spaces only, 2-50 characters)');
        } else {
            
            console.log('Hasta adý geçerli:', patientName);
        }
    });

    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.field:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
