// main.js — Complete Final Version
// Replace API_URL with your live Google Apps Script endpoint.

const API_URL = "https://script.google.com/macros/s/AKfycbyz7rcWsoCTIikg08PzhbbS1OYQ9Rgsa17RCGb5R0PGXvOT_KSrbsXu-WxLiQSkDwgDQg/exec";

//------------------------------------
// 1. QUICK SEARCH HANDLER (Homepage)
//------------------------------------

document.getElementById('quickSearch')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const brand = document.getElementById('qBrand').value.trim();
    const model = document.getElementById('qModel').value.trim();

    if (!brand || !model) {
        alert("Please enter both brand and model.");
        return;
    }

    window.location.href = `results.html?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`;
});

//------------------------------------
// 2. SUBMIT SELL FORM
//------------------------------------

async function submitSellForm(event) {
    event.preventDefault();

    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.phone || !data.brand || !data.model || !data.part || !data.price) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sell", data })
        });

        const result = await response.json();
        if (result.status === "success") {
            alert("Your spare part listing is submitted successfully!");
            form.reset();
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        alert("Network error. Try again later.");
    }
}

//------------------------------------
// 3. SUBMIT BUY FORM
//------------------------------------

async function submitBuyForm(event) {
    event.preventDefault();

    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.phone || !data.brand || !data.model || !data.part) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "buy", data })
        });

        const result = await response.json();
        if (result.status === "success") {
            alert("Your request is submitted! You will be notified when a match is found.");
            form.reset();
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        alert("Network error. Try again later.");
    }
}

//------------------------------------
// 4. LOAD RESULTS PAGE MATCHES
//------------------------------------

async function loadResults() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get('brand');
    const model = params.get('model');

    if (!brand || !model) return;

    document.getElementById('searchTitle').innerText = `Results for ${brand} ${model}`;

    try {
        const res = await fetch(`${API_URL}?action=search&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`);
        const data = await res.json();

        const container = document.getElementById('resultsBox');
        container.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            container.innerHTML = "<p>No matching spare parts found.</p>";
            return;
        }

        data.results.forEach((item) => {
            const div = document.createElement('div');
            div.className = "result-item";
            div.innerHTML = `
                <h3>${item.brand} ${item.model}</h3>
                <p><strong>Part:</strong> ${item.part}</p>
                <p><strong>Price:</strong> ₹${item.price}</p>
                <p><strong>Seller:</strong> ${item.name} (${item.phone})</p>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        document.getElementById('resultsBox').innerHTML = '<p>Error loading results.</p>';
    }
}

//------------------------------------
// 5. AUTO INIT ON RESULTS PAGE
//------------------------------------

if (window.location.pathname.includes("results.html")) {
    loadResults();
}