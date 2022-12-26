const API_KEY = 'zkczXS9h0POwf4R_7qwnGcwDqdQ';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', (e) => getStatus(e));
document.getElementById('submit').addEventListener('click', (e) => postForm(e));

function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()){
        if(entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }

    form.delete('options');
    form.append('options', optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: "POST",
        headers:
        {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint results for ${data.file}`;
    let results;
    if(data.total_errors === 0) {
        results = '<div>No errors found!</div>';
    } else {
        results = `<div> Total errors: ${data.total_errors}</div>`;
        for (let error of data.error_list) {
            results += `<div>At line ${error.line}, column ${error.col}</div>`;
            results += `<div>Error: ${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayException(error) {
    let title = 'Error';
    let content = `<div><strong>Error Code:</strong> ${error.status_code}</div>`
    content += `<div><strong>Error Number:</strong> ${error.error_no}</div>`;
    content += `<div><strong>Error:</strong> ${error.error}</div>`;

    document.getElementById('resultsModalTitle').innerText = title;
    document.getElementById('results-content').innerHTML = content;

    resultsModal.show();
}

function displayStatus(data) {
    let title = 'API Key Expiry Date';
    let content = `<div>API Key expires on:</div> <div>${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerText = title;
    document.getElementById('results-content').innerHTML = content;

    resultsModal.show();
}