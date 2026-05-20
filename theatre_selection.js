const cityTheatres = {
  "Mumbai": [
    { 
      name: "PVR ICON: Infiniti Mall, Andheri (W)", 
      screens: [
        { type: "2D Dolby Atmos", times: ["10:00 AM", "12:30 PM", "3:15 PM"] },
        { type: "IMAX 3D", times: ["6:00 PM", "9:45 PM"] }
      ] 
    },
    { 
      name: "INOX: R City, Ghatkopar", 
      screens: [
        { type: "3D", times: ["11:00 AM", "2:00 PM"] },
        { type: "4DX 3D", times: ["5:30 PM", "8:15 PM", "11:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Seawoods Grand Central, Navi Mumbai", 
      screens: [
        { type: "2D", times: ["09:30 AM", "1:15 PM", "4:45 PM"] },
        { type: "VIP 2D", times: ["7:30 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "PVR: IMAX, Phoenix Palladium, Lower Parel", 
      screens: [
        { type: "IMAX 2D", times: ["09:15 AM", "1:00 PM"] },
        { type: "IMAX 3D", times: ["4:30 PM", "8:15 PM", "11:45 PM"] }
      ] 
    },
    { 
      name: "INOX: Insignia at Atria Mall, Worli", 
      screens: [
        { type: "INSIGNIA 2D", times: ["11:30 AM", "3:45 PM", "7:00 PM"] },
        { type: "INSIGNIA 3D", times: ["10:15 PM"] }
      ] 
    },
    { 
      name: "PVR: Oberoi Mall, Goregaon (E)", 
      screens: [
        { type: "2D", times: ["10:30 AM", "1:45 PM", "5:00 PM"] },
        { type: "3D", times: ["8:30 PM", "11:15 PM"] }
      ] 
    },
    { 
      name: "INOX: Megaplex, Inorbit Mall, Malad (W)", 
      screens: [
        { type: "IMAX 3D", times: ["11:00 AM", "2:30 PM"] },
        { type: "ScreenX 2D", times: ["6:00 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Viviana Mall, Thane", 
      screens: [
        { type: "4DX 3D", times: ["10:00 AM", "1:15 PM", "4:30 PM"] },
        { type: "VIP 2D", times: ["7:45 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "PVR: Phoenix Marketcity, Kurla", 
      screens: [
        { type: "4DX 2D", times: ["12:00 PM", "3:30 PM"] },
        { type: "P[XL] 3D", times: ["7:00 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "Metro INOX Cinema: Marine Lines", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:45 AM", "1:30 PM", "5:15 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Regal Cinema: Colaba", 
      screens: [
        { type: "2D", times: ["12:30 PM", "3:30 PM", "6:30 PM", "9:30 PM"] }
      ] 
    },
    { 
      name: "Miraj Cinemas: R Mall, Thane", 
      screens: [
        { type: "3D", times: ["10:15 AM", "1:45 PM", "5:15 PM"] },
        { type: "2D", times: ["8:45 PM", "11:30 PM"] }
      ] 
    },
    { 
      name: "PVR: Maison, Jio World Drive, BKC", 
      screens: [
        { type: "Director's Cut 2D", times: ["11:00 AM", "2:45 PM", "6:30 PM"] },
        { type: "Director's Cut 3D", times: ["10:00 PM"] }
      ] 
    }
  ],
  "Delhi": [
    { 
      name: "PVR: Select City Walk, Saket", 
      screens: [
        { type: "2D", times: ["10:30 AM", "1:30 PM"] },
        { type: "4DX 3D", times: ["4:30 PM", "8:00 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "INOX: Nehru Place", 
      screens: [
        { type: "IMAX 2D", times: ["11:15 AM", "2:15 PM"] },
        { type: "IMAX 3D", times: ["6:00 PM", "9:00 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: DLF Avenue", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:00 AM", "12:00 PM", "3:45 PM", "7:15 PM", "10:15 PM"] }
      ] 
    }
  ],
  "Bangalore": [
    { 
      name: "PVR: Forum Mall, Koramangala", 
      screens: [
        { type: "2D", times: ["10:00 AM", "1:00 PM", "4:00 PM"] },
        { type: "IMAX 3D", times: ["7:00 PM", "10:00 PM"] }
      ] 
    },
    { 
      name: "INOX: Garuda Mall", 
      screens: [
        { type: "3D", times: ["11:30 AM", "2:45 PM", "6:15 PM"] },
        { type: "VIP 3D", times: ["9:30 PM"] }
      ] 
    },
    { 
      name: "Cinepolis: Nexus Shantiniketan", 
      screens: [
        { type: "4DX 3D", times: ["09:45 AM", "1:15 PM"] },
        { type: "2D", times: ["5:00 PM", "8:30 PM"] }
      ] 
    }
  ],
  "Default": [
    { 
      name: "PVR Cinemas (Central)", 
      screens: [
        { type: "2D", times: ["10:00 AM", "1:00 PM", "4:30 PM"] },
        { type: "IMAX 3D", times: ["8:00 PM", "10:30 PM"] }
      ] 
    },
    { 
      name: "INOX Multiplex", 
      screens: [
        { type: "3D", times: ["11:00 AM", "2:30 PM", "6:00 PM"] },
        { type: "4DX", times: ["9:15 PM"] }
      ] 
    },
    { 
      name: "Cinepolis Mega Mall", 
      screens: [
        { type: "2D Dolby Atmos", times: ["09:30 AM", "12:45 PM", "4:00 PM"] },
        { type: "VIP 2D", times: ["7:30 PM", "10:45 PM"] }
      ] 
    },
    { 
      name: "Carnival Cinemas", 
      screens: [
        { type: "IMAX 2D", times: ["10:15 AM", "1:45 PM"] },
        { type: "IMAX 3D", times: ["5:15 PM", "8:45 PM"] }
      ] 
    },
    { 
      name: "Miraj Cinemas", 
      screens: [
        { type: "2D", times: ["11:30 AM", "3:00 PM", "6:30 PM", "9:45 PM"] }
      ] 
    }
  ]
};

let selectedCity = localStorage.getItem("selectedCity") || "Default";
if (!cityTheatres[selectedCity]) {
  selectedCity = "Default"; // fallback if city is not in our specific list
}

let theatres = cityTheatres[selectedCity];

let container = document.getElementById("theatreList");
container.innerHTML = `<h5 class="mb-4 text-secondary">Showing theatres in <strong class="text-white">${selectedCity === "Default" ? "your area" : selectedCity}</strong></h5>`;

theatres.forEach(t => {
  let screensHtml = t.screens.map(screen => `
    <div class="mt-3">
      <div class="mb-2" style="color: #46b864; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
        <i class="bi bi-display me-1"></i> ${screen.type}
      </div>
      <div class="d-flex flex-wrap gap-2">
      ${screen.times.map(time =>
        `<button onclick="selectTime('${t.name}','${time}', '${screen.type}')"
         class="btn btn-outline-light btn-sm fw-bold px-3 py-2 border-secondary" style="transition: all 0.2s ease;" onmouseover="this.style.borderColor='#e50914'; this.style.color='#e50914';" onmouseout="this.style.borderColor=''; this.style.color='';">${time}</button>`
      ).join("")}
      </div>
    </div>
  `).join("");

  container.innerHTML += `
    <div class="card p-4 mb-4 text-white shadow" style="background-color: #1e1e1e; border: 1px solid #333; border-radius: 8px;">
      <h4 class="mb-1" style="color: #fff;"><i class="bi bi-camera-reels" style="color: #e50914;"></i> ${t.name}</h4>
      ${screensHtml}
    </div>
  `;
});

function selectTime(theatre, time, screenType) {
  localStorage.setItem("theatre", theatre);
  localStorage.setItem("time", time);
  localStorage.setItem("screenType", screenType);
  window.location.href = "seat_selection_movie.html";
}