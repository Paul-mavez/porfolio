// messages.js
document.addEventListener("DOMContentLoaded", () => {
    fetchMessages();
});

async function fetchMessages() {
    const tbody = document.querySelector("#messagesTable tbody");
    tbody.innerHTML = `<tr><td colspan="5">Loading messages...</td></tr>`;

    try {
        // Automatically switch between local and live API
        const API_URL = window.location.hostname === "localhost" 
            ? "http://localhost:3000/messages"  // Local development
            : "https://porfolio-8uaz.onrender.com/messages"; // Replace with your Render URL

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const messages = await response.json();
        loadTable(messages);
    } catch (error) {
        console.error("Fetch error:", error);
        tbody.innerHTML = `<tr><td colspan="5">Failed to load messages. Make sure your server is running or API URL is correct.</td></tr>`;
    }
}

function loadTable(messages) {
    const tbody = document.querySelector("#messagesTable tbody");
    tbody.innerHTML = ""; 

    if (!messages || messages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No messages found.</td></tr>`;
        return;
    }

    messages.forEach(msg => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${msg.id}</td>
            <td>${msg.fullname}</td>
            <td>${msg.email}</td>
            <td>${msg.message}</td>
            <td>${msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</td>
        `;
        tbody.appendChild(row);
    });
}

