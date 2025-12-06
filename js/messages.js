// messages.js
document.addEventListener("DOMContentLoaded", () => {
    fetchMessages();
});

async function fetchMessages() {
    try {
        const response = await fetch("http://localhost:3000/messages");
        if (!response.ok) throw new Error("Network response was not ok");

        const messages = await response.json();
        loadTable(messages);
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load messages. Make sure your server is running.");
    }
}

function loadTable(messages) {
    const tbody = document.querySelector("#messagesTable tbody");
    tbody.innerHTML = ""; 

    messages.forEach(msg => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${msg.id}</td>
            <td>${msg.fullname}</td>
            <td>${msg.email}</td>
            <td>${msg.message}</td>
            <td>${new Date(msg.created_at).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}
