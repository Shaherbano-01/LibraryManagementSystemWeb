// Membership plans and fees
const plans = {
  monthly: 500,
  yearly: 4500,
};

// Array to store member details
let members = [];
let notifications = [];
let notificationSettings = {
  email: true,
  sms: false,
  web: true,
};

// Function to render members in the table
function renderMembers() {
  const tableBody = document.getElementById("members-table");
  tableBody.innerHTML = ""; // Clear existing rows

  members.forEach((member, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.plan}</td>
      <td>Rs.${member.fee}</td>
      <td>${member.paid ? "Paid" : "Unpaid"}</td>
      <td>${member.notified ? "Notified" : "Not Notified"}</td>
      <td>Rs.${member.fine}</td>
      <td>
        <button class="btn" onclick="markAsPaid(${index})">${member.paid ? "Mark Unpaid" : "Mark Paid"}</button>
        <button class="btn" onclick="sendReminder(${index})">Send Reminder</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to apply a fine for lost/damaged books or late submission
function applyFine() {
  const fineId = document.getElementById("fine-id").value.trim();
  const fineAmount = parseFloat(document.getElementById("fine-amount").value.trim());

  if (!fineId || isNaN(fineAmount)) {
    alert("Please enter valid member ID and fine amount.");
    return;
  }

  const member = members.find(m => m.id === fineId);
  if (!member) {
    alert("Member not found.");
    return;
  }

  member.fine += fineAmount; // Add the fine to the member's total fine
  addWebNotification(member.name, `A fine of Rs.${fineAmount} has been applied to your account for lost/damaged book or late submission.`);
  renderMembers(); // Update the table
}

// Function to send a reminder to a member
function sendReminder(index) {
  const member = members[index];
  const message = `Hello ${member.name}, your payment for the ${member.plan} plan is due. Please make the payment to avoid penalties.`;

  // Check notification preferences
  if (notificationSettings.email) {
    sendEmail(member.email, message);
  }
  if (notificationSettings.sms) {
    sendSMS(member.phone, message);
  }
  if (notificationSettings.web) {
    addWebNotification(member.name, message);
  }

  member.notified = true; // Mark member as notified
  renderMembers();
}

// Mock functions for sending notifications
function sendEmail(email, message) {
  console.log(`Email sent to ${email}: ${message}`);
}
function sendSMS(phone, message) {
  console.log(`SMS sent to ${phone}: ${message}`);
}
function addWebNotification(name, message) {
  notifications.push({ name, message });
  renderNotifications();
}

// Function to render notifications
function renderNotifications() {
  const list = document.getElementById("notifications-list");
  list.innerHTML = ""; // Clear existing notifications

  notifications.forEach((notif) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${notif.name}: ${notif.message}`;
    list.appendChild(listItem);
  });
}

// Function to save notification settings
function saveNotificationSettings() {
  notificationSettings.email = document.getElementById("notify-email").checked;
  notificationSettings.sms = document.getElementById("notify-sms").checked;
  notificationSettings.web = document.getElementById("notify-web").checked;
  alert("Notification settings saved!");
}

// Function to add a new member
document.getElementById("add-member-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const fee = plans[plan];

  if (!id || !name || !email || !phone) {
    alert("Please fill out all fields.");
    return;
  }

  const newMember = {
    id,
    name,
    email,
    phone,
    plan,
    fee,
    fine: 0, // Initialize fine as 0
    paid: false,
    notified: false,
  };

  members.push(newMember);
  renderMembers(); // Update the table
  document.getElementById("add-member-form").reset();
});

// Initial rendering
renderMembers();
renderNotifications();
