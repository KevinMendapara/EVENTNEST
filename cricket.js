const iplMatches = [
    {
        title: "Mumbai Indians vs Chennai Super Kings",
        date: "25 May 2026",
        time: "7:30 PM",
        venue: "Wankhede Stadium, Mumbai",
        team1Logo: "images/mi_badge.png",
        team2Logo: "images/csk_badge.png",
        bg1: "#004B8D",
        bg2: "#F9CD05",
        price: 1500
    },
    {
        title: "Royal Challengers Bengaluru vs Kolkata Knight Riders",
        date: "26 May 2026",
        time: "7:30 PM",
        venue: "M. Chinnaswamy Stadium, Bangalore",
        team1Logo: "images/rcb_badge.png",
        team2Logo: "images/kkr_badge.png",
        bg1: "#D11C21",
        bg2: "#3A225D",
        price: 2000
    },
    {
        title: "Delhi Capitals vs Sunrisers Hyderabad",
        date: "28 May 2026",
        time: "3:30 PM",
        venue: "Arun Jaitley Stadium, Delhi",
        team1Logo: "images/dc_badge.png",
        team2Logo: "images/srh_badge.png",
        bg1: "#004C93",
        bg2: "#F7A721",
        price: 1200
    },
    {
        title: "Rajasthan Royals vs Gujarat Titans",
        date: "30 May 2026",
        time: "7:30 PM",
        venue: "Sawai Mansingh Stadium, Jaipur",
        team1Logo: "images/rr_badge.png",
        team2Logo: "images/gt_badge.png",
        bg1: "#E73895",
        bg2: "#1C1C2B",
        price: 1800
    },
    {
        title: "Punjab Kings vs Lucknow Super Giants",
        date: "1 June 2026",
        time: "3:30 PM",
        venue: "PCA Stadium, Mohali",
        team1Logo: "images/pbks_badge.png",
        team2Logo: "images/lsg_badge.png",
        bg1: "#DD1F2D",
        bg2: "#004B8D",
        price: 1100
    }
];

const intlMatches = [
    {
        title: "India vs Australia (Men's T20)",
        date: "10 June 2026",
        time: "7:00 PM",
        venue: "Eden Gardens, Kolkata",
        team1Logo: "images/ind.png",
        team2Logo: "images/aus.png",
        bg1: "#FF9933",
        bg2: "#000080",
        price: 2500
    },
    {
        title: "India vs England (Women's T20)",
        date: "15 June 2026",
        time: "7:00 PM",
        venue: "Narendra Modi Stadium, Ahmedabad",
        team1Logo: "images/ind.png",
        team2Logo: "images/eng.png",
        bg1: "#138808",
        bg2: "#CF142B",
        price: 1000
    },
    {
        title: "India vs South Africa (Men's ODI)",
        date: "20 June 2026",
        time: "1:30 PM",
        venue: "M. A. Chidambaram Stadium, Chennai",
        team1Logo: "images/ind.png",
        team2Logo: "images/sa.png",
        bg1: "#000080",
        bg2: "#007749",
        price: 2200
    },
    {
        title: "India vs New Zealand (Men's T20)",
        date: "25 June 2026",
        time: "7:00 PM",
        venue: "Rajiv Gandhi Intl Stadium, Hyderabad",
        team1Logo: "images/ind.png",
        team2Logo: "images/nz.png",
        bg1: "#FF9933",
        bg2: "#000000",
        price: 2000
    }
];

function displayMatches(matches, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = matches.map(m => {
        const safeTitle = m.title.replace(/'/g, "\\'");
        
        // Dynamic image banner
        const matchBanner = `
        <div class="match-banner" style="background: linear-gradient(135deg, ${m.bg1} 50%, ${m.bg2} 50%); position: relative; width: 100%; height: 180px; display: flex; justify-content: space-around; align-items: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); transform: translateZ(30px);">
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); z-index: 1;"></div>
            
            <div class="team-logo-container" style="width: 100px; height: 100px; z-index: 2; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 8px; backdrop-filter: blur(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                <img src="${m.team1Logo}" alt="Team 1" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='images/eventnest_logo_v2.jpg';">
            </div>
            
            <div class="vs-badge" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #e50914; color: #fff; font-weight: 900; font-size: 1.2rem; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; border-radius: 50%; z-index: 3; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-style: italic; border: 2px solid rgba(255,255,255,0.2);">VS</div>
            
            <div class="team-logo-container" style="width: 100px; height: 100px; z-index: 2; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 8px; backdrop-filter: blur(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                <img src="${m.team2Logo}" alt="Team 2" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='images/eventnest_logo_v2.jpg';">
            </div>
            
            <!-- Diagonal line for visual effect -->
            <div style="position: absolute; left: 50%; top: -20px; bottom: -20px; width: 4px; background: rgba(255,255,255,0.3); transform: rotate(15deg); z-index: 1;"></div>
        </div>
        `;

        return `
        <div class="col-md-4 col-sm-6">
            <div class="cricket-card" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.2">
                ${matchBanner}
                <div class="cricket-content" style="transform: translateZ(40px);">
                    <div class="cricket-title">${m.title}</div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted"><i class="bi bi-calendar"></i> ${m.date}</span>
                        <span class="text-muted"><i class="bi bi-clock"></i> ${m.time}</span>
                    </div>
                    <p class="text-muted mb-3"><i class="bi bi-geo-alt"></i> ${m.venue}</p>
                    <button class="book-btn" onclick="bookMatch('${safeTitle}', '${m.venue}', '${m.date}', '${m.time}', ${m.price}, '${m.team1Logo}', '${m.team2Logo}')">
                        <i class="bi bi-ticket-perforated"></i> Book Seats — ₹${m.price.toLocaleString()} onwards
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function bookMatch(title, venue, date, time, basePrice, team1Logo, team2Logo) {
    localStorage.setItem("cricketMatch", JSON.stringify({ title, venue, date, time, basePrice, team1Logo, team2Logo }));
    window.location.href = "stadium_seat_selection.html";
}

document.addEventListener('DOMContentLoaded', () => {
    displayMatches(iplMatches, 'iplList');
    displayMatches(intlMatches, 'intlList');
    
    // Initialize 3D Tilt Effect
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".cricket-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }
});
