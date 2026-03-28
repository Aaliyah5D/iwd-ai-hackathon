// Load requests from localStorage
let requests = JSON.parse(localStorage.getItem("requests")) || [];

// Request help function
function requestHelp(item) {
  const urgency = prompt("Enter urgency level (Low, Medium, High):", "Medium");
  const request = {
    id: Date.now(), // unique ID
    type: item,
    urgency: urgency || "Medium",
    time: new Date().toLocaleString(),
    status: "Pending",
  };
  requests.push(request);
  localStorage.setItem("requests", JSON.stringify(requests));
  displayRequests();
}

// Accept request function
function acceptRequest(id) {
  requests = requests.map((r) => {
    if (r.id === id) r.status = "Accepted";
    return r;
  });
  localStorage.setItem("requests", JSON.stringify(requests));
  displayRequests();
}

// Display requests in cards
function displayRequests() {
  const output = document.getElementById("requestOutput");
  output.innerHTML = "";

  if (requests.length === 0) {
    output.innerHTML = "<p>No requests yet</p>";
    return;
  }

  requests.forEach((r) => {
    const card = document.createElement("div");
    card.className = "request-card";

    // Card color based on status & urgency
    if (r.status === "Accepted") {
      card.style.backgroundColor = "#d4edda"; // light green
    } else if (r.urgency === "High") {
      card.style.backgroundColor = "#f8d7da"; // light red
    } else if (r.urgency === "Medium") {
      card.style.backgroundColor = "#fff3cd"; // light yellow
    } else {
      card.style.backgroundColor = "#f1f2f6"; // default
    }

    card.innerHTML = `
          <p><strong>${r.type}</strong> - ${r.time}</p>
          <p>Urgency: <strong>${r.urgency}</strong></p>
          <p>Status: <span class="status">${r.status}</span></p>
          ${r.status === "Pending" ? `<button onclick="acceptRequest(${r.id})">Accept</button>` : ""}
        `;

    output.appendChild(card);
  });
}

// Mental health tracker
let mood = "";

function setMood(selectedMood) {
  mood = selectedMood;
}

function submitMood() {
  const moodData = {
    mood: mood,
    note: document.querySelector("textarea").value,
    time: new Date().toLocaleString(),
  };
  localStorage.setItem("mood", JSON.stringify(moodData));
  document.getElementById("moodOutput").innerText = "Mood saved ✔️";
}

// Initialize page
window.onload = displayRequests;

// Simple database of universities → counselling contacts
const uniCounsellingData = {
  TUT: "Phone: 012 382 1234 | Email: counselling@tut.ac.za",
  "University of Pretoria": "Phone: 012 420 1234 | Email: counselling@up.ac.za",
  "University of Johannesburg":
    "Phone: 011 559 1234 | Email: counselling@uj.ac.za",
  "Wits University": "Phone: 011 717 1234 | Email: counselling@wits.ac.za",
  UCT: "Phone: 021 650 1234 | Email: counselling@uct.ac.za",
  // add more universities as needed
};

function findCounselling() {
  const uniInput = document.getElementById("uniName").value.trim();
  const output = document.getElementById("uniContacts");

  if (uniInput === "") {
    output.innerHTML = "<p>Please enter your university.</p>";
    return;
  }

  const contact = uniCounsellingData[uniInput];

  if (contact) {
    output.innerHTML = `<p>Contacts for <strong>${uniInput}</strong>:<br>${contact}</p>`;
  } else {
    output.innerHTML = `<p>Sorry, we couldn't find contacts for <strong>${uniInput}</strong>. You can try checking your university website.</p>`;
  }
}
