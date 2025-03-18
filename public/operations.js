document.addEventListener("DOMContentLoaded", function () {
    
    if (!window.socket) {
        window.socket = io('http://localhost:4000');  
    }

    const socket = window.socket;  
    let currentLabelCount = 100;  
    let tubesLeft = { gold: 10, blue: 10, purple: 10, red: 10 };  

    
    function updateUI() {
        document.getElementById('current-label-count').value = currentLabelCount;
        for (const color in tubesLeft) {
            const tubeLeftElem = document.getElementById(`${color}-tube-left`);
            if (tubeLeftElem) {
                tubeLeftElem.innerText = `${tubesLeft[color]} tubes left`;
            }
        }
    }

    
    socket.on('simulationStarted', () => {
        currentLabelCount = 100;
        tubesLeft = { gold: 10, blue: 10, purple: 10, red: 10 };
        updateUI();
        const randomTubeNumber = Math.floor(Math.random() * 20) + 1;
        document.getElementById('current-labeling-tube-number').value = `${randomTubeNumber}/20`;
    });

    
    document.getElementById('print-button').addEventListener('click', function () {
        const selectedTubeColor = document.querySelector('input[name="tube-color"]:checked');

        const labelData = {
            labelCount: currentLabelCount,
            tubesLeft: tubesLeft,
            color: selectedTubeColor ? selectedTubeColor.value : null
        };

        
        if (!selectedTubeColor) {
            socket.emit('printLabel', labelData);
        } else {
            
            socket.emit('printLabel', labelData);
        }
    });

    
    socket.on('labelPrinted', (data) => {
        currentLabelCount = data.labelCount;
        tubesLeft = data.tubesLeft;
        updateUI();
        const randomTubeNumber = Math.floor(Math.random() * 20) + 1;
        document.getElementById('current-labeling-tube-number').value = `${randomTubeNumber}/20`;
    });

    
    document.getElementById('load-label-button').addEventListener('click', function () {
        socket.emit('loadLabel');
    });

    // When the Load Tube button is pressed, information about which side will be opened will be sent to the server
    document.getElementById('load-tube-button').addEventListener('click', function () {
        const userChoice = prompt("Please select the side: Type '1' for Side1 or '2' for Side2");
        if (userChoice === '1' || userChoice === '2') {
            socket.emit('loadTube', { side: userChoice });
        } else {
            alert("Invalid choice. Please type '1' or '2'.");
        }
    });

    // Color options become active when the tube toggle is turned on
    document.getElementById('tube-toggle').addEventListener('change', function () {
        const tubeOptions = document.querySelectorAll('input[name="tube-color"]');
        tubeOptions.forEach(option => {
            option.disabled = !document.getElementById('tube-toggle').checked;  
        });
    });

    
    socket.on('labelToggled', (data) => {
        const labelToggle = document.getElementById('label-toggle');
        if (labelToggle) {
            labelToggle.checked = data.status;
        }
    });

   
    socket.on('tubeToggled', (data) => {
        const sideToggle = document.getElementById(`${data.side}-toggle`);
        if (sideToggle) {
            sideToggle.checked = true;
        }
    });
});
