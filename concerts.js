// ================= CONCERT DATA =================
let concerts = [
  {
    name: "Arijit Singh",
    city: "Mumbai",
    month: "March",
    date: "15 March 2026",
    time: "7:00 PM",
    venue: "Jio World Garden",
    price: 500,
    img: "images/arijit.jpg"
  },
  {
    name: "Neha Kakkar",
    city: "Delhi",
    month: "April",
    date: "10 April 2026",
    time: "6:30 PM",
    venue: "Indira Gandhi Arena",
    price: 400,
    img: "images/neha.jpg"
  },
  {
    name: "Badshah",
    city: "Bangalore",
    month: "May",
    date: "22 May 2026",
    time: "8:00 PM",
    venue: "Manpho Convention Centre",
    price: 600,
    img: "images/badshah.jpg"
  },
  {
    name: "Shreya Ghoshal",
    city: "Mumbai",
    month: "June",
    date: "05 June 2026",
    time: "7:30 PM",
    venue: "Dome, NSCI",
    price: 550,
    img: "images/shreya.jpg"
  },
  {
    name: "Yo Yo Honey Singh",
    city: "Delhi",
    month: "May",
    date: "12 May 2026",
    time: "8:30 PM",
    venue: "JLN Stadium",
    price: 800,
    img: "images/honey-singh.jpg"
  },
  {
    name: "Aditya Gadhvi",
    city: "Mumbai",
    month: "April",
    date: "25 April 2026",
    time: "7:00 PM",
    venue: "Nesco Center",
    price: 600,
    img: "images/aditya_gadhvi.jpg"
  },
  {
    name: "Diljit Dosanjh",
    city: "Bangalore",
    month: "June",
    date: "18 June 2026",
    time: "8:00 PM",
    venue: "Bhartiya City",
    price: 1200,
    img: "images/diljit%20dosanjh.jpg"
  }
];


// Comprehensive Multi-Tier Image Proxy Fallback Builder
function getImageFallbacks(primaryUrl) {
  const fallbacks = [];
  if (!primaryUrl) {
    return ['images/c_hero.jpg'];
  }
  
  if (!primaryUrl.startsWith('http')) {
    // If it's a local path, still try Wikipedia as backup for Aditya Gadhvi
    if (primaryUrl.includes('aditya_gadhvi.jpg')) {
      fallbacks.push('https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aditya_Gadhvi_At_An_Event_In_Ahmedabad_2020.jpg/960px-Aditya_Gadhvi_At_An_Event_In_Ahmedabad_2020.jpg');
    }
    fallbacks.push('images/c_hero.jpg');
    return fallbacks;
  }

  // Extract raw URL to prevent double proxying
  let rawUrl = primaryUrl;
  if (primaryUrl.includes('weserv.nl/?url=')) {
    const parts = primaryUrl.split('weserv.nl/?url=');
    if (parts.length > 1) {
      rawUrl = decodeURIComponent(parts[1]);
      if (!rawUrl.startsWith('http')) {
        rawUrl = 'https://' + rawUrl;
      }
    }
  } else if (primaryUrl.includes('.wp.com/')) {
    const parts = primaryUrl.split('.wp.com/');
    if (parts.length > 1) {
      rawUrl = 'https://' + parts[1];
    }
  }

  const cleanUrl = rawUrl.replace(/^https?:\/\//, '');

  if (rawUrl !== primaryUrl) {
    fallbacks.push(rawUrl);
  }
  
  // 2. WordPress Photon CDN (Extremely fast, free, never blocks referrers, rarely blocked by ISPs)
  fallbacks.push(`https://i0.wp.com/${cleanUrl}`);
  
  // 3. Hard backup to local event placeholder immediately
  fallbacks.push('images/c_hero.jpg');

  const unique = [...new Set(fallbacks)];
  return unique.filter(url => url !== primaryUrl);
}

function handleConcertImgError(img) {
  let index = parseInt(img.getAttribute('data-fallback-index') || '0', 10);
  let fallbacks = [];
  try {
    const rawFallbacks = img.getAttribute('data-fallbacks');
    if (rawFallbacks) {
      fallbacks = JSON.parse(rawFallbacks);
    }
  } catch (e) {
    console.error("Error parsing fallbacks:", e);
  }
  
  if (index < fallbacks.length) {
    const nextSrc = fallbacks[index];
    img.setAttribute('data-fallback-index', index + 1);
    console.log(`Failed to load ${img.src}. Trying fallback tier ${index + 1}: ${nextSrc}`);
    img.src = nextSrc;
  } else {
    img.onerror = null;
    img.src = 'images/c_hero.jpg';
    console.log(`All fallbacks failed for ${img.alt}. Swapped to local placeholder.`);
  }
}


// ================= DISPLAY =================
function displayConcerts(data) {
  let container = document.getElementById("concertList");
  if (!container) return;
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No concerts found</p>";
    return;
  }

  data.forEach((c, index) => {
    const imgId = `concert-img-${index}`;
    const fallbacks = getImageFallbacks(c.img);

    container.innerHTML += `
    <div class="card text-white mb-4" style="background: rgba(20, 20, 20, 0.95); border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
      <div class="row g-0 align-items-center">
        <!-- Image Section -->
        <div class="col-md-4 col-lg-3">
          <img src="${c.img}" 
               id="${imgId}"
               class="img-fluid" 
               alt="${c.name}" 
               style="width: 100%; height: 250px; object-fit: cover;"
               data-fallbacks='${JSON.stringify(fallbacks)}'
               data-fallback-index="0"
               onerror="handleConcertImgError(this)"
               loading="lazy"
               referrerpolicy="no-referrer">
        </div>
        
        <!-- Content Section -->
        <div class="col-md-8 col-lg-9">
          <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4">
            
            <!-- Details -->
            <div class="mb-3 mb-md-0">
              <h3 class="card-title fw-bold mb-3" style="font-size: 1.8rem;">${c.name}</h3>
              <div class="d-flex flex-column gap-2 text-light" style="font-size: 1.05rem;">
                <div class="d-flex align-items-center">
                  <i class="bi bi-calendar-event me-2" style="font-size: 1.2rem; color: #E50914;"></i>
                  <span>${c.date}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-clock me-2" style="font-size: 1.2rem; color: #E50914;"></i>
                  <span>${c.time}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-geo-alt me-2" style="font-size: 1.2rem; color: #E50914;"></i>
                  <span>${c.venue}, ${c.city}</span>
                </div>
              </div>
            </div>
            
            <!-- Pricing & Action -->
            <div class="d-flex flex-column align-items-md-end text-md-end mt-3 mt-md-0">
              <p class="mb-3 text-white" style="font-size: 1.6rem; font-weight: bold;">Rs. ${c.price}</p>
              <button onclick="goToDetails('${c.name}','${c.city}','${c.venue}','${c.date}','${c.time}','${c.price}', document.getElementById('${imgId}').src)" class="btn btn-danger btn-lg fw-bold px-4 shadow-sm" style="background-color: #E50914; border: none;">
                Book Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
    `;
  });
}


// ================= NAVIGATION =================
function goToDetails(name, city, venue, date, time, price, img) {
  localStorage.setItem("concertData", JSON.stringify({
    name: name,
    city: city,
    venue: venue,
    date: date,
    time: time,
    price: price,
    img: img
  }));

  window.location.href = "concert_details.html";
}


// ================= FILTER =================
function filterConcerts() {
  let search = document.getElementById("search").value.toLowerCase();
  let city = document.getElementById("cityFilter").value;
  let month = document.getElementById("monthFilter").value;

  let filtered = concerts.filter(c =>
    c.name.toLowerCase().includes(search) &&
    (city === "" || c.city === city) &&
    (month === "" || c.month === month)
  );

  displayConcerts(filtered);
}


// ================= EVENTS =================
document.getElementById("search").addEventListener("input", filterConcerts);
document.getElementById("cityFilter").addEventListener("change", filterConcerts);
document.getElementById("monthFilter").addEventListener("change", filterConcerts);


// ================= INITIAL LOAD =================
displayConcerts(concerts);