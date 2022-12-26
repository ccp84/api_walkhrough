const API_KEY = 'zkczXS9h0POwf4R_7qwnGcwDqdQ';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', (e) => getStatus(e));

async function getStatus(e) {
    let queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if(response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let title = 'API Key Expiry Date';
    let content = `<div>API Key expires on:</div> <div>${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerHTML = title;
    document.getElementById('results-content').innerHTML = content;

    resultsModal.show();
}