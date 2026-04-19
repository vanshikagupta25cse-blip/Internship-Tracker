// DOM elements
const darkModeToggle = document.getElementById("darkModeToggle");
const dashboard = {
  totalApps: document.getElementById("totalApps"),
  upcomingDeadlines: document.getElementById("upcomingDeadlines"),
  offersCount: document.getElementById("offersCount"),
  acceptedCount: document.getElementById("acceptedCount"),
};

const kanban = {
  applied: document.getElementById("applied-cards"),
  interview: document.getElementById("interview-cards"),
  offer: document.getElementById("offer-cards"),
  accepted: document.getElementById("accepted-cards"),
};

const form = document.getElementById("internshipForm");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const exportCsv = document.getElementById("exportCsv");

// Local storage key
const LS_KEY = "internships";

// Initial data
let internships = JSON.parse(localStorage.getItem(LS_KEY)) || [];

// Status mapping to columns
const statusMap = {
  applied: "applied",
  interview: "interview",
  offer: "offer",
  accepted: "accepted",
  rejected: "accepted",
};

// Status text labels
const statusLabels = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Theme toggle
darkModeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  if (isDark) {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }
});

// Load saved theme
window.addEventListener("load", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }
});

// Render all cards
function render() {
  // Clear all columns
  Object.values(kanban).forEach(col => (col.innerHTML = ""));

  // Filter by search and status filter
  const query = searchInput.value.toLowerCase();
  const filter = statusFilter.value;

  const visible = internships.filter(item => {
    const matchesSearch =
      item.company.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query);
    const matchesFilter = filter === "" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Group by status
  const groups = { applied: [], interview: [], offer: [], accepted: [] };

  visible.forEach(item => {
    const groupKey = statusMap[item.status] || "applied";
    groups[groupKey].push(item);
  });

  // Render each group
  for (const [key, items] of Object.entries(groups))