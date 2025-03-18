document.addEventListener("DOMContentLoaded", function () {
    if (!window.socket) {
        console.log('Creating a new socket connection...');
        window.socket = io('http://localhost:4000');
    } else {
        console.log('Reusing existing socket connection...');
    }

    const socket = window.socket;
    const axes = ['x', 'y', 'z', 'g', 'r1', 'r3'];
    const currentValues = axes.map(axis => document.getElementById(`current-${axis}-value`));
    const navbarToggle = document.getElementById("navbarToggle"); 

    let holdStatus = {};  // Hold state for each axis
    let updateMode = {};  // Update status for each axis

    axes.forEach(axis => {
        holdStatus[axis] = false;
        updateMode[axis] = false;
    });

    let intervalId;

    
    socket.on('simulationStarted', () => {
        intervalId = setInterval(() => {
            axes.forEach((axis, index) => {
                if (!holdStatus[axis] && !updateMode[axis]) {
                    const randomValue = Math.floor(Math.random() * 101);
                    currentValues[index].value = randomValue;
                }
            });
        }, 1000);
    });

    // When the page loads, check the simulation status and update the navbar toggle
    socket.emit('getSimulationStatus'); 
    socket.on('simulationStatus', (status) => {
        if (status.simulationRunning) {
            if (status.technicalService) {
                navbarToggle.checked = true;  
            } else {
                navbarToggle.checked = false; 
            }
        }
    });

    // Listen to Technical Service status and update navbar toggle
    socket.on('technicalServiceStatus', (data) => {
        if (!data.status) {  
            navbarToggle.checked = false; 
        } else {
            navbarToggle.checked = true;  
        }
    });

    
    window.reset = function (axis) {
        currentValues[axes.indexOf(axis)].value = 0;  
        socket.emit('resetValue', axis);  
        console.log(`${axis} value reset to 0`);
    };

    
    window.hold = function (axis) {
        holdStatus[axis] = !holdStatus[axis];  
        if (holdStatus[axis]) {
            console.log(`${axis} axis hold: Data flow paused`);
        } else {
            console.log(`${axis} axis resumed: Data flow resumed`);
        }
        socket.emit('holdToggle', axis);  
    };

    
    window.updateValue = function (axis) {
        const newValue = document.getElementById(`new-${axis}-value`).value;
        if (newValue >= 0 && newValue <= 100) {  
            currentValues[axes.indexOf(axis)].value = newValue;
            updateMode[axis] = true;  
            socket.emit('updateValue', { axis, value: newValue }); 
            console.log(`${axis} axis updated with new value: ${newValue}`);
        } else {
            alert("Please enter a value between 0 and 100");
        }
    };

    
    window.home = function (axis) {
        console.log(`${axis} axis homed`);  
    };
});
