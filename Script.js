document.getElementById('initialize').addEventListener('click', initializeInputs);
document.getElementById('run-simulation').addEventListener('click', runSimulation);

function initializeInputs() {
    const numProcesses = parseInt(document.getElementById('processes').value);
    const numResources = parseInt(document.getElementById('resources').value);

    const resourceAllocationDiv = document.getElementById('resource-allocation');
    resourceAllocationDiv.innerHTML = '';
    resourceAllocationDiv.style.display = 'block';

    for (let i = 0; i < numProcesses; i++) {
        const processDiv = document.createElement('div');
        processDiv.classList.add('resource-inputs');
        processDiv.innerHTML = <h3>Process ${i}</h3>;

        for (let j = 0; j < numResources; j++) {
            processDiv.innerHTML += `
                <label>Allocated Resource ${j}:</label>
                <input type="number" id="alloc_${i}_${j}" min="0" value="0">
                
            `;
        }
        for (let j = 0; j < numResources; j++) {
            processDiv.innerHTML +=`
                <label>Max Resource ${j}:</label>
                <input type="number" id="max_${i}_${j}" min="0" value="0">
            `;
        }

        resourceAllocationDiv.appendChild(processDiv);
    }

    const availableDiv = document.createElement('div');
    availableDiv.classList.add('resource-inputs');
    availableDiv.innerHTML = <h3>Available Resources</h3>;
    for (let j = 0; j < numResources; j++) {
        availableDiv.innerHTML += `
            <label>Available Resource ${j}:</label>
            <input type="number" id="available_${j}" min="0" value="0">
        `;
    }
    resourceAllocationDiv.appendChild(availableDiv);

    document.getElementById('run-simulation').style.display = 'block';
}

function runSimulation() {
    const numProcesses = parseInt(document.getElementById('processes').value);
    const numResources = parseInt(document.getElementById('resources').value);

    const allocation = [];
    const max = [];
    const available = [];

    for (let i = 0; i < numProcesses; i++) {
        allocation[i] = [];
        max[i] = [];
        for (let j = 0; j < numResources; j++) {
            allocation[i][j] = parseInt(document.getElementById(alloc_${i}_${j}).value);
            max[i][j] = parseInt(document.getElementById(max_${i}_${j}).value);
        }
    }

    for (let j = 0; j < numResources; j++) {
        available[j] = parseInt(document.getElementById(available_${j}).value);
    }

    const safeSequence = bankersAlgorithm(allocation, max, available);
    displayResult(safeSequence);
}

function bankersAlgorithm(allocation, max, available) {
    const numProcesses = allocation.length;
    const numResources = available.length;

    const need = Array.from({ length: numProcesses }, (_, i) => 
        Array.from({ length: numResources }, (_, j) => max[i][j] - allocation[i][j])
    );

    const work = [...available];
    const finish = Array(numProcesses).fill(false);
    const safeSequence = [];

    while (safeSequence.length < numProcesses) {
        let foundProcess = false;

        for (let i = 0; i < numProcesses; i++) {
            if (!finish[i] && need[i].every((needR, j) => needR <= work[j])) {
                need[i].forEach((_, j) => {
                    work[j] += allocation[i][j];
                });
                safeSequence.push(i);
                finish[i] = true;
                foundProcess = true;
                break;
            }
        }

        if (!foundProcess) {
            return null; // No safe sequence found
        }
    }

    return safeSequence;
}

function displayResult(safeSequence) {
    const resultDiv = document.getElementById('simulation-result');
    resultDiv.innerHTML = '';

    if (safeSequence) {
        resultDiv.innerHTML = Safe sequence is: ${safeSequence.join(', ')};
        resultDiv.classList.remove('failure');
        resultDiv.classList.add('success');
    } else {
        resultDiv.innerHTML = 'No safe sequence found. System is in an unsafe state!';
        resultDiv.classList.remove('success');
        resultDiv.classList.add('failure');
    }
}