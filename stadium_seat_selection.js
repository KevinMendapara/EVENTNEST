const matchData = JSON.parse(localStorage.getItem("cricketMatch"));

if (!matchData) {
    window.location.href = "cricket.html";
} else {
    // Basic population
    document.getElementById('matchTitleText').innerText = matchData.title.toUpperCase() + " - TATA IPL 2026";
    document.getElementById('matchDateTime').innerText = `${matchData.date} | ${matchData.time}`;
    
    // Set Logos (Handling missing logos gracefully)
    const logo1 = document.getElementById('logo1');
    const logo2 = document.getElementById('logo2');
    
    if (logo1) {
        logo1.onerror = function() {
            logo1.onerror = null;
            logo1.src = 'images/eventnest_logo_v2.jpg';
        };
        if (matchData.team1Logo) {
            logo1.src = matchData.team1Logo;
        } else {
            logo1.style.display = 'none';
        }
    }
    
    if (logo2) {
        logo2.onerror = function() {
            logo2.onerror = null;
            logo2.src = 'images/eventnest_logo_v2.jpg';
        };
        if (matchData.team2Logo) {
            logo2.src = matchData.team2Logo;
        } else {
            logo2.style.display = 'none';
        }
    }
}

// Layout configuration
const CENTER_X = 500;
const CENTER_Y = 500;

// Category colors and prices
const CATEGORIES = [
    { price: 1500, color: '#E91E63' }, // Pink
    { price: 1800, color: '#8E24AA' }, // Purple
    { price: 2000, color: '#00BCD4' }, // Cyan
    { price: 2200, color: '#009688' }, // Teal
    { price: 2500, color: '#F57C00' }, // Orange
    { price: 3500, color: '#9E9E9E' }, // Grey
    { price: 4500, color: '#D32F2F' }, // Red
];

// Stands Mapping
const stands = [
    // --- INNER RING (r: 160 to 250) ---
    { id: 'g', name: 'G BLOCK (VIDA)', cat: 0, r1: 160, r2: 250, a1: -25, a2: 25 },
    { id: 'f', name: 'F BLOCK (JIO)', cat: 4, r1: 160, r2: 250, a1: 28, a2: 70 },
    { id: 'e', name: 'E BLOCK (BKT)', cat: 3, r1: 160, r2: 250, a1: 73, a2: 125 },
    { id: 'd', name: 'D BLOCK (VIDA)', cat: 1, r1: 160, r2: 250, a1: 128, a2: 175 },
    { id: 'club1', name: 'CLUB HOUSE LOWER', cat: 6, r1: 160, r2: 230, a1: 178, a2: 240 },
    { id: 'l', name: 'L BLOCK (PREMIUM)', cat: 1, r1: 160, r2: 250, a1: 243, a2: 265 },
    { id: 'k', name: 'K BLOCK (JIO)', cat: 4, r1: 160, r2: 250, a1: 268, a2: 300 },
    { id: 'h', name: 'H BLOCK (JIO)', cat: 3, r1: 160, r2: 250, a1: 303, a2: 332 },

    // --- OUTER RING (r: 255 to 350) ---
    { id: 'g1', name: 'G1 BLOCK', cat: 0, r1: 255, r2: 360, a1: -30, a2: 30 },
    { id: 'f1', name: 'F1 BLOCK', cat: 5, r1: 255, r2: 360, a1: 33, a2: 75 },
    { id: 'd1', name: 'D1 BLOCK', cat: 0, r1: 255, r2: 360, a1: 78, a2: 175 },
    
    // Bottom outer ring has slightly smaller inner radius
    { id: 'b1', name: 'B1 BLOCK', cat: 2, r1: 235, r2: 340, a1: 178, a2: 215 },
    { id: 'club2', name: 'CLUB HOUSE UPPER', cat: 2, r1: 235, r2: 340, a1: 218, a2: 255 },
    { id: 'l1', name: 'L1 BLOCK', cat: 2, r1: 255, r2: 360, a1: 258, a2: 327 }
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    var startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    var endOuter   = polarToCartesian(x, y, outerRadius, startAngle);
    var startInner = polarToCartesian(x, y, innerRadius, endAngle);
    var endInner   = polarToCartesian(x, y, innerRadius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", startOuter.x, startOuter.y, 
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");
    return d;
}

// Initialize layout and price list
function initLayout() {
    const svg = document.getElementById('stadiumSvg');
    const priceList = document.getElementById('priceList');

    // 1. Draw central pitch
    svg.innerHTML = `
        <circle cx="${CENTER_X}" cy="${CENTER_Y}" r="145" fill="#2E7D32" stroke="#fff" stroke-width="4"/>
        <rect x="${CENTER_X - 12}" y="${CENTER_Y - 40}" width="24" height="80" fill="#fff"/>
    `;

    // 2. Draw Stands
    stands.forEach(stand => {
        const cat = CATEGORIES[stand.cat];
        stand.price = cat.price;
        stand.color = cat.color;

        const pathData = describeArc(CENTER_X, CENTER_Y, stand.r1, stand.r2, stand.a1, stand.a2);
        
        // Calculate text position (middle of the arc)
        const midAngle = (stand.a1 + stand.a2) / 2;
        const midRadius = (stand.r1 + stand.r2) / 2;
        const textPos = polarToCartesian(CENTER_X, CENTER_Y, midRadius, midAngle);
        
        // Create path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", stand.color);
        path.setAttribute("class", "stand-path");
        path.setAttribute("data-cat", stand.cat);
        path.addEventListener('click', () => openStand(stand));
        
        // Hover effects
        path.onmouseover = () => highlightCategory(stand.cat);
        path.onmouseout = () => resetHighlight();

        // Create text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", textPos.x);
        text.setAttribute("y", textPos.y);
        text.setAttribute("class", "stand-text light");
        
        // Rotate text to align with arc
        let rot = midAngle;
        if (rot > 90 && rot < 270) rot += 180; // Keep text upright
        text.setAttribute("transform", `rotate(${rot}, ${textPos.x}, ${textPos.y})`);
        
        // Wrap text
        const words = stand.name.split(' ');
        if(words.length > 2) {
            text.innerHTML = `<tspan x="${textPos.x}" dy="-5">${words[0]} ${words[1]}</tspan><tspan x="${textPos.x}" dy="12">${words.slice(2).join(' ')}</tspan>`;
        } else {
            text.textContent = stand.name;
        }

        // Pointer events through to path
        text.style.pointerEvents = "none";

        svg.appendChild(path);
        svg.appendChild(text);
    });

    // 3. Build Price List Sidebar
    CATEGORIES.forEach((cat, index) => {
        const li = document.createElement('li');
        li.className = 'price-item';
        li.dataset.cat = index;
        li.innerHTML = `
            <div class="price-left">
                <div class="price-color-box" style="background-color: ${cat.color}"></div>
                <div class="price-value" style="color: ${cat.color}">Rs. ${cat.price}</div>
            </div>
            <i class="bi bi-chevron-down"></i>
        `;
        
        li.onmouseover = () => highlightCategory(index);
        li.onmouseout = () => resetHighlight();
        li.onclick = () => openCategory(index);
        
        priceList.appendChild(li);
    });
}

function openCategory(catIndex) {
    const stand = stands.find(s => s.cat === catIndex);
    if (stand) openStand(stand);
}

// Highlight logic
function highlightCategory(catIndex) {
    // Highlight list item
    document.querySelectorAll('.price-item').forEach(item => {
        if(parseInt(item.dataset.cat) === catIndex) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Highlight SVG paths
    document.querySelectorAll('.stand-path').forEach(path => {
        if(parseInt(path.dataset.cat) === catIndex) {
            path.classList.remove('dimmed');
        } else {
            path.classList.add('dimmed');
        }
    });
}

function resetHighlight() {
    document.querySelectorAll('.price-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.stand-path').forEach(path => path.classList.remove('dimmed'));
}


// --- SEAT SELECTION LOGIC ---
let selectedSeats = [];
let currentStand = null;

function openStand(stand) {
    currentStand = stand;
    
    document.getElementById('modalStandTitle').innerText = stand.name;
    document.getElementById('modalStandColor').style.backgroundColor = stand.color;
    document.getElementById('modalStandPrice').innerText = stand.price;
    
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = '';
    
    // Generate realistic seating block (approx 8 rows, 14 cols)
    const rows = 8;
    const cols = 14;
    
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row Label
        const labelL = document.createElement('div');
        labelL.style.color = '#888';
        labelL.style.width = '20px';
        labelL.style.textAlign = 'right';
        labelL.style.paddingRight = '5px';
        labelL.style.fontWeight = 'bold';
        labelL.style.fontSize = '0.85rem';
        labelL.style.display = 'flex';
        labelL.style.alignItems = 'center';
        labelL.innerText = String.fromCharCode(65 + r);
        rowDiv.appendChild(labelL);

        for (let c = 1; c <= cols; c++) {
            // Aisle split in middle
            if (c === 8) {
                const aisle = document.createElement('div');
                aisle.style.width = '20px';
                rowDiv.appendChild(aisle);
            }

            const seatId = `${stand.id.toUpperCase()}-${String.fromCharCode(65 + r)}${c}`;
            const seatDiv = document.createElement('div');
            seatDiv.className = 'stadium-seat';
            seatDiv.innerText = c;
            
            // Randomly occupy some seats, deterministic
            const isOccupied = (seatId.charCodeAt(0) + seatId.charCodeAt(seatId.length-1) + c * r) % 7 === 0;
            if (isOccupied) {
                seatDiv.classList.add('occupied');
            } else {
                // Check if already selected
                const existing = selectedSeats.find(s => s.id === seatId);
                if (existing) {
                    seatDiv.classList.add('selected');
                }
                
                seatDiv.onclick = () => toggleSeat(seatDiv, seatId, stand.price);
            }
            rowDiv.appendChild(seatDiv);
        }
        grid.appendChild(rowDiv);
    }
    
    document.getElementById('seatModal').style.display = 'flex';
}

function closeStand() {
    document.getElementById('seatModal').style.display = 'none';
}

function toggleSeat(element, id, price) {
    if (element.classList.contains('occupied')) return;
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s.id !== id);
    } else {
        element.classList.add('selected');
        selectedSeats.push({ id, price, stand: currentStand.name });
    }
    updateCheckout();
}

function updateCheckout() {
    const count = selectedSeats.length;
    const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    
    document.getElementById('selectedCount').innerText = count;
    document.getElementById('totalPrice').innerText = total;
    
    const panel = document.getElementById('checkoutPanel');
    
    if (count > 0) {
        document.getElementById('selectedSeatsText').innerText = selectedSeats.map(s => s.id).join(', ');
        document.getElementById('proceedBtn').disabled = false;
        panel.style.display = 'flex';
    } else {
        document.getElementById('selectedSeatsText').innerText = 'None';
        document.getElementById('proceedBtn').disabled = true;
        panel.style.display = 'none';
    }
}

function goToPayment() {
    if (selectedSeats.length === 0) return;
    
    const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    
    localStorage.removeItem("concertData");
    localStorage.removeItem("movie");
    localStorage.setItem("seats", JSON.stringify(selectedSeats.map(s => s.id)));
    localStorage.setItem("amount", total);

    // Clear old data to avoid conflicts
    localStorage.removeItem("movie");
    localStorage.removeItem("concertData");
    
    window.location.href = "payment.html";
}

// Bootstrap layout
document.addEventListener('DOMContentLoaded', initLayout);
