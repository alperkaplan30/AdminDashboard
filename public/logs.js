document.addEventListener("DOMContentLoaded", function () {
    const fileInput1 = document.getElementById('file-input1');
    const fileInput2 = document.getElementById('file-input2');
    const logOutput = document.getElementById('log-output');
    const autoSaveButton = document.getElementById('auto-save-button');
    const saveLogButton = document.getElementById('save-log-button');

    let autoSaveEnabled = false;
    let autoSaveInterval;

    fileInput1.addEventListener('change', function (event) {
        handleFileSelect(event, 1);
    });

    fileInput2.addEventListener('change', function (event) {
        handleFileSelect(event, 2);
    });

    autoSaveButton.addEventListener('click', function () {
        autoSaveEnabled = !autoSaveEnabled;
        autoSaveButton.classList.toggle('active', autoSaveEnabled);
        autoSaveButton.textContent = autoSaveEnabled ? 'Auto Save ON' : 'Auto Save OFF';

        if (autoSaveEnabled) {
            autoSaveInterval = setInterval(saveLog, 10000); 
        } else {
            clearInterval(autoSaveInterval);
        }
    });

    saveLogButton.addEventListener('click', function () {
        saveLog();
    });

    function handleFileSelect(event, side) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const logData = e.target.result;
                populateFields(logData, side);
            };
            reader.readAsText(file);
        }
    }

    function populateFields(logData, side) {
        const lines = logData.split('\n');
       
        const data = {
            patientName: '',
            dob: '',
            entryDate: '',
            gender: '',
            orderPatientName: '',
            orderNumber: '',
            currentPrints: ''
        };

        // Parse the contents of the log file
        lines.forEach(line => {
            if (line.startsWith('Patient Name:')) {
                data.patientName = line.split('Patient Name:')[1].trim();
            } else if (line.startsWith('Date of Birth:')) {
                data.dob = line.split('Date of Birth:')[1].trim();
            } else if (line.startsWith('Entry Date:')) {
                data.entryDate = line.split('Entry Date:')[1].trim();
            } else if (line.startsWith('Gender:')) {
                data.gender = line.split('Gender:')[1].trim();
            } else if (line.startsWith('Order Patient Name:')) {
                data.orderPatientName = line.split('Order Patient Name:')[1].trim();
            } else if (line.startsWith('Order Number:')) {
                data.orderNumber = line.split('Order Number:')[1].trim();
            } else if (line.startsWith('Current Prints:')) {
                data.currentPrints = line.split('Current Prints:')[1].trim();
            }
        });

        
        if (side === 1) {
            document.getElementById('patient-name1').value = data.patientName;
            document.getElementById('dob1').value = data.dob;
            document.getElementById('entry-date1').value = data.entryDate;
            document.getElementById('gender1').value = data.gender;
            document.getElementById('order-patient-name1').value = data.orderPatientName;
            document.getElementById('order-number1').value = data.orderNumber;
            document.getElementById('current-prints1').value = data.currentPrints;
        } else {
            document.getElementById('patient-name2').value = data.patientName;
            document.getElementById('dob2').value = data.dob;
            document.getElementById('entry-date2').value = data.entryDate;
            document.getElementById('gender2').value = data.gender;
            document.getElementById('order-patient-name2').value = data.orderPatientName;
            document.getElementById('order-number2').value = data.orderNumber;
            document.getElementById('current-prints2').value = data.currentPrints;
        }

        if (autoSaveEnabled) {
            saveLog();
        }
    }

    function saveLog() {
        const logText = logOutput.value;
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);  
        const a = document.createElement('a');
        a.href = url;
        a.download = 'example.log';
        a.click();
        URL.revokeObjectURL(url);
    }
});
