document.addEventListener("DOMContentLoaded", function () {
    
    if (!window.socket) {
        console.log('Creating a new socket connection...');
        window.socket = io('http://localhost:4000');
    } else {
        console.log('Reusing existing socket connection...');
    }

    const socket = window.socket; 

    
    const operationsNavItem = document.getElementById('operations-nav-item');
    const technicalServiceToggle = document.getElementById("technical-service-toggle");
    const navbarToggle = document.getElementById("navbarToggle");  

    
    document.getElementById('start-button').addEventListener('click', function () {
        socket.emit('startSimulation');
    });

    
    socket.on('simulationStarted', () => {
        const toggles = ['x', 'y', 'z', 'g', 'r1', 'r3'].map(axis => document.getElementById(`${axis}-toggle`));
        toggles.forEach(toggle => {
            toggle.checked = true;
        });
        technicalServiceToggle.checked = true;
        navbarToggle.checked = true;
    });

    
    socket.on('technicalServiceStatus', (data) => {
        technicalServiceToggle.checked = data.status;
        if (!data.status) {
            const toggles = ['x', 'y', 'z', 'g', 'r1', 'r3'].map(axis => document.getElementById(`${axis}-toggle`));
            toggles.forEach(toggle => {
                toggle.checked = false;
            });
            navbarToggle.checked = false;  
            operationsNavItem.classList.remove("disabled");  
        } else {
            operationsNavItem.classList.add("disabled");  
        }
    });

    
    socket.emit('getSimulationStatus');
    socket.on('simulationStatus', (status) => {
        if (status.simulationRunning && status.technicalService) {
            navbarToggle.checked = true; 
        } else {
            navbarToggle.checked = false;
        }
    });

    
    technicalServiceToggle.addEventListener('change', function () {
        if (!technicalServiceToggle.checked) {  
            navbarToggle.checked = false;  
            socket.emit('setAlarm');  
        } else { 
            socket.emit('clearAlarm'); 
        }
    });

    // Update the visibility of the operations tab in the navbar according to the current toggle state when the page loads
    if (!technicalServiceToggle.checked) {
        operationsNavItem.classList.remove("disabled");
    } else {
        operationsNavItem.classList.add("disabled");
    }

    // Listen to the loadLabel event from Operations.js
    socket.on('labelToggled', (data) => {
        const labelToggle = document.getElementById('label-toggle');
        if (labelToggle) {
            labelToggle.checked = data.status;
        }
    });

    // Listen to the loadTube event from Operations.js
    socket.on('tubeToggled', (data) => {
        const sideToggle = document.getElementById(`${data.side}-toggle`);
        if (sideToggle) {
            sideToggle.checked = true;
        }
    });
});
