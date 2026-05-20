let selectedSeats = [];
let totalPrice = 0;

// Load info from local storage
const movieData = JSON.parse(localStorage.getItem("movie"));
const theatreData = localStorage.getItem("theatre");
const timeData = localStorage.getItem("time");

const screenType = localStorage.getItem("screenType") || "2D";

if (movieData) document.getElementById("movieTitleDisplay").innerText = movieData.name;
if (theatreData) document.getElementById("theatreDisplay").innerText = theatreData;
if (timeData) document.getElementById("timeDisplay").innerText = timeData;
document.getElementById("screenTypeDisplay").innerText = screenType;

let baseMultiplier = 1;
if (screenType.includes("IMAX")) baseMultiplier = 1.5;
else if (screenType.includes("4DX")) baseMultiplier = 2.0;
else if (screenType.includes("Director's Cut") || screenType.includes("INSIGNIA") || screenType.includes("VIP") || screenType.includes("P[XL]")) baseMultiplier = 3.0;
else if (screenType.includes("3D")) baseMultiplier = 1.2;
else if (screenType.includes("Dolby Atmos") || screenType.includes("ScreenX")) baseMultiplier = 1.3;

const premiumPrice = Math.floor(200 * baseMultiplier);
const reclinerPrice = Math.floor(400 * baseMultiplier);

document.getElementById("pricingDisplay").innerText = `Premium: ₹${premiumPrice} | Recliner: ₹${reclinerPrice}`;

const container = document.getElementById("seatContainer");

// Layout configuration
const rows = [
  { id: 'A', type: 'premium', seats: 20, price: premiumPrice },
  { id: 'B', type: 'premium', seats: 20, price: premiumPrice },
  { id: 'C', type: 'premium', seats: 24, price: premiumPrice },
  { id: 'D', type: 'premium', seats: 24, price: premiumPrice },
  { id: 'E', type: 'premium', seats: 26, price: premiumPrice },
  { id: 'F', type: 'premium', seats: 26, price: premiumPrice },
  { id: 'G', type: 'premium', seats: 28, price: premiumPrice },
  { id: 'H', type: 'premium', seats: 28, price: premiumPrice },
  { id: 'I', type: 'premium', seats: 30, price: premiumPrice },
  { id: 'J', type: 'premium', seats: 30, price: premiumPrice },
  { id: 'R1', type: 'recliner', seats: 16, price: reclinerPrice },
  { id: 'R2', type: 'recliner', seats: 16, price: reclinerPrice },
  { id: 'R3', type: 'recliner', seats: 18, price: reclinerPrice }
];

// Generate seats
rows.forEach((row, rowIndex) => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("seat-row");
  if (row.type === 'recliner' && rows[rowIndex-1] && rows[rowIndex-1].type !== 'recliner') {
    rowDiv.classList.add("recliner-row");
  } else if (row.type === 'recliner' && rowIndex === 0) {
    rowDiv.classList.add("recliner-row");
  }

  // Row Label
  const label = document.createElement("div");
  label.classList.add("row-label");
  label.innerText = row.id;
  rowDiv.appendChild(label);

  for (let i = 1; i <= row.seats; i++) {
    // Add aisle in the middle
    if (i === Math.floor(row.seats / 2) + 1) {
      const aisle = document.createElement("div");
      aisle.classList.add("aisle");
      rowDiv.appendChild(aisle);
    }

    const seat = document.createElement("div");
    seat.classList.add("seat");
    if (row.type === 'recliner') seat.classList.add("recliner");
    
    const seatId = `${row.id}${i}`;
    seat.innerText = i; 

    // Randomly occupy some seats for realism
    if (Math.random() < 0.15) {
      seat.classList.add("occupied");
    } else {
      seat.onclick = () => toggleSeat(seat, seatId, row.price);
    }

    rowDiv.appendChild(seat);
  }
  
  // Right Row Label
  const labelRight = document.createElement("div");
  labelRight.classList.add("row-label");
  labelRight.style.marginRight = '0';
  labelRight.style.marginLeft = '15px';
  labelRight.innerText = row.id;
  rowDiv.appendChild(labelRight);

  container.appendChild(rowDiv);
});

function toggleSeat(seatElement, seatId, price) {
  if (seatElement.classList.contains("selected")) {
    seatElement.classList.remove("selected");
    selectedSeats = selectedSeats.filter(s => s.id !== seatId);
    totalPrice -= price;
  } else {
    seatElement.classList.add("selected");
    selectedSeats.push({ id: seatId, price: price });
    totalPrice += price;
  }
  updateCheckout();
}

function updateCheckout() {
  const proceedBtn = document.getElementById("proceedBtn");
  document.getElementById("total").innerText = totalPrice;
  
  if (selectedSeats.length > 0) {
    document.getElementById("selectedSeats").innerText = selectedSeats.map(s => s.id).join(", ");
    proceedBtn.disabled = false;
  } else {
    document.getElementById("selectedSeats").innerText = "None";
    proceedBtn.disabled = true;
  }
}

function goToPayment() {
  if (selectedSeats.length === 0) return;
  
  // Save formatted data for next page
  localStorage.removeItem("concertData");
  localStorage.removeItem("cricketMatch");
  localStorage.setItem("seats", JSON.stringify(selectedSeats.map(s => s.id)));
  localStorage.setItem("amount", totalPrice);

  window.location.href = "payment.html";
}