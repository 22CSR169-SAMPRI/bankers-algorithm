function createTables() {
    const processCount = parseInt(document.getElementById('processes').value);
    const resourceCount = parseInt(document.getElementById('resources').value);

    createTable('allocation-table', processCount, resourceCount, 'Allocation');
    createTable('max-table', processCount, resourceCount, 'Max');
    createAvailableResourcesInput(resourceCount);

    document.getElementById('tables-section').style.display = 'block';
}

function createTable(tableId, processCount, resourceCount, tableName) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';

    let header = '<tr><th>' + tableName + '</th>';
    for (let j = 0; j < resourceCount; j++) {
        header += '<th>R' + j + '</th>';
    }
    header += '</tr>';
    table.innerHTML += header;

    for (let i = 0; i < processCount; i++) {
        let row = '<tr><td>P' + i + '</td>';
        for (let j = 0; j < resourceCount; j++) {
            row += '<td><input type="number" id="' + tableName.toLowerCase() + '-' + i + '-' + j + '" value="0"></td>';
        }
        row += '</tr>';
        table.innerHTML += row;
    }
}

function createAvailableResourcesInput(resourceCount) {
    const availableResourcesDiv = document.getElementById('available-resources');
    availableResourcesDiv.innerHTML = '<label>Available:</label>';
    for (let i = 0; i < resourceCount; i++) {
        availableResourcesDiv.innerHTML += '<input type="number" id="available-' + i + '" value="0">';
    }
}

function runBankersAlgorithm() {
    const processCount = parseInt(document.getElementById('processes').value);
    const resourceCount = parseInt(document.getElementById('resources').value);

    const allocation = [];
    const max = [];
    const available = [];

    for (let i = 0; i < processCount; i++) {
        allocation.push([]);
        max.push([]);
        for (let j = 0; j < resourceCount; j++) {
            allocation[i].push(parseInt(document.getElementById('allocation-' + i + '-' + j).value));
            max[i].push(parseInt(document.getElementById('max-' + i + '-' + j).value));
        }
    }

    for (let i = 0; i < resourceCount; i++) {
        available.push(parseInt(document.getElementById('available-' + i).value));
    }

    const result = bankersAlgorithm(processCount, resourceCount, allocation, max, available);
    document.getElementById('result').textContent = result;
}

function bankersAlgorithm(processCount, resourceCount, allocation, max, available) {
    const need = [];
    for (let i = 0; i < processCount; i++) {
        need.push([]);
        for (let j = 0; j < resourceCount; j++) {
            need[i].push(max[i][j] - allocation[i][j]);
        }
    }

    const finish = new Array(processCount).fill(false);
    const safeSequence = [];
    let progress = true;

    while (progress) {
        progress = false;
        for (let i = 0; i < processCount; i++) {
            if (!finish[i]) {
                let possible = true;
                for (let j = 0; j < resourceCount; j++) {
                    if (need[i][j] > available[j]) {
                        possible = false;
                        break;
                    }
                }
                if (possible) {
                    for (let j = 0; j < resourceCount; j++) {
                        available[j] += allocation[i][j];
                    }
                    safeSequence.push(i);
                    finish[i] = true;
                    progress = true;
                }
            }
        }
    }

    if (safeSequence.length === processCount) {
        return 'System is in a safe state.\nSafe sequence: ' + safeSequence.map(p => 'P' + p).join(', ');
    } else {
        return 'System is not in a safe state.';
    }