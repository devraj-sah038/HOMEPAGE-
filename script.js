document.addEventListener("DOMContentLoaded", () => {
  // Check if userName exists in localStorage
  // ------------------- USER NAME HANDLING -------------------
let userName = localStorage.getItem("userName");
if (!userName) {
    userName = prompt("Please enter your name:", "Devraj");
    if (!userName || userName.trim() === "") {
        userName = "Guest";
    }
    localStorage.setItem("userName", userName);
}

  // Function to update greeting and date
  function updateGreetingAndDate() {
    const greetingElement = document.getElementById('greeting');
    const dateElement = document.getElementById('today-date');
    
    const now = new Date();
    const hour = now.getHours();

    let greetingText = "";
    if (hour < 12) {
      greetingText = `Good Morning ${userName}`;
    } else if (hour < 18) {
      greetingText = `Good Afternoon ${userName}`;
    } else {
      greetingText = `Good Evening ${userName}`;
    }

    greetingElement.textContent = greetingText;

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);

    dateElement.textContent = `Today is the ${formattedDate}`;
  }

  updateGreetingAndDate();

  // Initialize FlipClock (make sure jQuery and FlipClock are loaded)
  const clock = $('.flip-clock').FlipClock({
    clockFace: 'TwelveHourClock',
    showSeconds: true
  });

   // ------------------- PROFILE IMAGE HANDLING -------------------
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    document.getElementById('profileImage').src = savedImage;
  }

  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profileImage').src = e.target.result;
        localStorage.setItem('profileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Load shortcuts from localStorage and display
  function loadShortcuts() {
    const container = document.getElementById("shortcuts-grid");
    container.innerHTML = ""; // clear existing
    const shortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");

    // Add default shortcuts if none saved yet
    if (shortcuts.length === 0) {
      const defaultShortcuts = [
        { name: "YouTube", url: "https://www.youtube.com" },
        { name: "Gmail", url: "https://mail.google.com" },
        { name: "Classroom", url: "https://classroom.google.com" },
        { name: "Instagram", url: "https://www.instagram.com" },
        { name: "Facebook", url: "https://www.facebook.com" }
      ];
      localStorage.setItem("shortcuts", JSON.stringify(defaultShortcuts));
      shortcuts.push(...defaultShortcuts);
    }

    shortcuts.forEach(({ name, url }) => {
      const shortcut = document.createElement("div");
      shortcut.className = "shortcut";
      shortcut.setAttribute("data-url", url);

      const hostname = new URL(url).hostname;

      const img = document.createElement("img");
      img.src = `https://logo.clearbit.com/${hostname}`;
      img.alt = name;
      img.onerror = function () {
        this.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
      };

      const label = document.createElement("span");
      label.textContent = name;

      shortcut.appendChild(img);
      shortcut.appendChild(label);
      container.appendChild(shortcut);

      shortcut.addEventListener("click", () => window.open(url, "_blank"));
    });
  }

  loadShortcuts();

  // Add Shortcut Function with persistence
  window.addShortcut = function() {
    const nameInput = document.getElementById("shortcut-name");
    const urlInput = document.getElementById("shortcut-url");
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (!name || !url) return alert("Please enter both name and URL");

    const shortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");

    shortcuts.push({ name, url });
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

    loadShortcuts();

    nameInput.value = "";
    urlInput.value = "";
  }

  // Reset page: clear all localStorage and reload
  document.getElementById("reset-page").addEventListener("click", () => {
    if (confirm("Do you want to refresh the page? All unsaved changes will be lost.")) {
      localStorage.clear();
      location.reload();
    }
  });

  // Online/offline status notification
  const statusDiv = document.getElementById("status-message");
  const statusText = document.getElementById("status-text");
  const statusIcon = document.getElementById("status-icon");
  const closeBtn = document.getElementById("close-btn");

  function showStatus(message, online) {
    statusText.textContent = message;
    statusIcon.textContent = online ? "📶" : "❌";
    statusDiv.className = online ? "online" : "offline";
    statusDiv.style.display = "flex";

    if (online) {
      setTimeout(() => {
        statusDiv.style.display = "none";
      }, 3000);
    }
  }

  function updateOnlineStatus() {
    if (navigator.onLine) {
      showStatus("You are currently online", true);
    } else {
      showStatus("You are currently offline", false);
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  closeBtn.addEventListener("click", () => {
    statusDiv.style.display = "none";
  });

  updateOnlineStatus();
});
