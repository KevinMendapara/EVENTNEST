// --- TMDB API CONFIGURATION ---
// Get a free key at https://www.themoviedb.org/
const TMDB_API_KEY = "867744ecc894f0582dea35e80fd71a4d";

// Helper function to fetch movie poster & rating from TMDB API dynamically
async function fetchTMDBData(movieName, fallbackImg) {
  const result = { poster: fallbackImg, rating: null, poster_path: null };
  if (!TMDB_API_KEY || TMDB_API_KEY === "YOUR_API_KEY_HERE") {
    return result;
  }
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}&language=en-US&page=1`);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const movie = data.results[0];

      // Poster: always fallback to provided fallbackImg if TMDB has no poster.
      if (movie && movie.poster_path) {
        result.poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        result.poster_path = movie.poster_path;
      }

      if (movie && typeof movie.vote_average === 'number') {
        result.rating = movie.vote_average;
      }
    }
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
  }
  // Ensure we never return an empty poster.
  if (!result.poster) result.poster = fallbackImg;
  return result;
}

// Comprehensive Multi-Tier Image Proxy Fallback Builder
function getImageFallbacks(primaryUrl) {
  const fallbacks = [];
  if (!primaryUrl) {
    return ['images/main_hero.png'];
  }
  
  if (!primaryUrl.startsWith('http')) {
    return [primaryUrl, 'images/main_hero.png'];
  }

  // Extract the original clean URL if already proxied to prevent double proxying
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

  // Build sequential fallback list (will be attempted in this exact order on error)
  
  // 1. Direct URL (if current url is already proxied, try direct)
  if (rawUrl !== primaryUrl) {
    fallbacks.push(rawUrl);
  }
  
  // 2. WordPress Photon CDN (Extremely fast, free, never blocks referrers, rarely blocked by ISPs)
  fallbacks.push(`https://i0.wp.com/${cleanUrl}`);
  
  // 3. Hard backup to local event placeholder immediately
  fallbacks.push('images/main_hero.png');

  // Filter out any entries that match the primaryUrl to avoid redundant loading loops
  const unique = [...new Set(fallbacks)];
  return unique.filter(url => url !== primaryUrl);
}


let movies = [
  // HOLLYWOOD
  {
    name: "Dune: Part Two",
    genre: "Sci-Fi",
    rating: 8.8,
    img: "images/dune_part_two_ver14.jpg",
    duration: "2h 46m",
    industry: "Hollywood"
  },
  {
    name: "Deadpool & Wolverine",
    genre: "Action",
    rating: 8.5,
    img: "https://image.tmdb.org/t/p/w500/8cdWv65xpTM51wE6a04j6O7Zf5K.jpg",
    duration: "2h 7m",
    industry: "Hollywood"
  },
  {
    name: "Inside Out 2",
    genre: "Animation",
    rating: 8.2,
    img: "https://image.tmdb.org/t/p/w500/vpnVM9B6pxm68voNM5JTtFuWIEQ.jpg",
    duration: "1h 36m",
    industry: "Hollywood"
  },
  {
    name: "Furiosa: A Mad Max Saga",
    genre: "Action",
    rating: 8.0,
    img: "https://image.tmdb.org/t/p/w500/iADOnt612viCHuKQj8tG3s5T266.jpg",
    duration: "2h 28m",
    industry: "Hollywood"
  },
  {
    name: "Oppenheimer",
    genre: "Drama",
    rating: 8.6,
    img: "https://image.tmdb.org/t/p/w500/8Gxv8gS681w7dO4w9bBrSY17c42.jpg",
    duration: "3h 0m",
    industry: "Hollywood"
  },

  // BOLLYWOOD / INDIAN CINEMA
  {
    name: "Kalki 2898 AD",
    genre: "Sci-Fi",
    rating: 8.5,
    img: "https://image.tmdb.org/t/p/w500/tuwF471W3bDTUr4t02wGv252vlu.jpg",
    duration: "3h 1m",
    industry: "Bollywood"
  },
  {
    name: "Fighter",
    genre: "Action",
    rating: 7.5,
    img: "https://image.tmdb.org/t/p/w500/z5CC245tOCe72vYr9nw9cs5X36f.jpg",
    duration: "2h 46m",
    industry: "Bollywood"
  },
  {
    name: "Jawan",
    genre: "Action",
    rating: 8.0,
    img: "https://image.tmdb.org/t/p/w500/144aW4rT73Kz0a7Zg6xS4o8U1e0.jpg",
    duration: "2h 49m",
    industry: "Bollywood"
  },
  {
    name: "Animal",
    genre: "Drama",
    rating: 7.2,
    img: "https://image.tmdb.org/t/p/w500/68JU5mU527jCkuwCC9nE137f4ae.jpg",
    duration: "3h 21m",
    industry: "Bollywood"
  },
  {
    name: "Dunki",
    genre: "Comedy",
    rating: 7.5,
    img: "https://image.tmdb.org/t/p/w500/khPzH2dOdfU3H2r5m9wK6A9dK6q.jpg",
    duration: "2h 41m",
    industry: "Bollywood"
  }
];

let upcomingMovies = [
  {
    name: "Spider-Man: Brand New Day",
    genre: "Action",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/r54UBcUBzQ8v9J8e2d4Vd5h8xK4.jpg",
    duration: "TBA",
    industry: "Hollywood"
  },
  {
    name: "King",
    genre: "Action",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/d5r5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Bollywood"
  },
  {
    name: "Avengers: Doomsday",
    genre: "Action",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/7WsyCh2kWFLgzI7Ice3LaEXHT68.jpg",
    duration: "TBA",
    industry: "Hollywood"
  },
  {
    name: "Dune: Part Three",
    genre: "Sci-Fi",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/o79f5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Hollywood"
  },
  {
    name: "Toxic",
    genre: "Action",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/5v5eP34hF68yJ7gD5W8W6iK8kP.jpg",
    duration: "TBA",
    industry: "Bollywood"
  },
  {
    name: "Odyssey",
    genre: "Sci-Fi",
    rating: "N/A",
    img: "https://image.tmdb.org/t/p/w500/gEU2QvH353eGo32b2gR3fNu36CB.jpg",
    duration: "TBA",
    industry: "Hollywood"
  }
];

function handleMovieImgLoad(img) {
  const loadedSrc = img.src;
  const safeName = img.alt.replace(/'/g, "\\'");
  const card = img.closest('.movie-card');
  if (card) {
     card.setAttribute("onclick", `goToDetails('${safeName}','${loadedSrc}')`);
     const btn = card.querySelector('.book-btn');
     if (btn) btn.setAttribute("onclick", `event.stopPropagation(); goToDetails('${safeName}','${loadedSrc}')`);
  }
}

function handleMovieImgError(img) {
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
    img.src = 'images/main_hero.png';
    console.log(`All fallbacks failed for ${img.alt}. Swapped to local placeholder.`);
    handleMovieImgLoad(img);
  }
}

async function displayMovies(data, containerId = "movieList") {
  let container = document.getElementById(containerId);
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `<p class="text-white">No movies found matching your criteria.</p>`;
    return;
  }

  container.innerHTML = "";

  // Render all posters instantly using static data
  const movieCardsHtml = data.map((m, index) => {
    const posterImg = m.img;
    const fallbacks = getImageFallbacks(posterImg);

    // Escape single quotes in movie names for inline event handlers
    const safeName = m.name.replace(/'/g, "\\'");
    const imgId = `${containerId}-img-${index}`;

    return `
      <div class="movie-card" onclick="goToDetails('${safeName}','${posterImg}')">
        <img src="${posterImg}" 
             id="${imgId}" 
             class="movie-img" 
             alt="${m.name}" 
             data-fallbacks='${JSON.stringify(fallbacks)}' 
             data-fallback-index="0" 
             onerror="handleMovieImgError(this)" 
             onload="handleMovieImgLoad(this)"
             referrerpolicy="no-referrer">
        <div class="movie-content">
          <div>
            <h3 class="movie-title">${m.name}</h3>
            <p class="movie-meta">
               <span class="badge bg-secondary mb-1">${m.industry}</span><br>
               ${m.genre} • ${m.duration} <br>
               <span class="movie-rating" id="${containerId}-rating-${index}"><i class="bi bi-star-fill"></i> ${m.rating}</span>
            </p>
          </div>
          <button class="book-btn mt-3" onclick="event.stopPropagation(); goToDetails('${safeName}','${posterImg}')">Book Tickets</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = movieCardsHtml.join('');

  // Fetch TMDB posters asynchronously in the background
  if (TMDB_API_KEY && TMDB_API_KEY !== "YOUR_API_KEY_HERE") {
    data.forEach(async (m, index) => {
      const imgElement = document.getElementById(`${containerId}-img-${index}`);
      if (imgElement) {
        const TMDBData = await fetchTMDBData(m.name, m.img);
        
        // 1. Live Rating Update
        if (TMDBData.rating) {
          const ratingEl = document.getElementById(`${containerId}-rating-${index}`);
          if (ratingEl) {
            ratingEl.innerHTML = `<i class="bi bi-star-fill"></i> ${TMDBData.rating.toFixed(1)}`;
          }
        }
        
        // 2. Poster Update & Fallback Chain Setup
        if (TMDBData.poster && TMDBData.poster !== m.img) {
          // Check if we are already displaying this TMDB poster via proxy (to avoid redundant reload)
          const isAlreadySamePoster = TMDBData.poster_path && m.img.includes(TMDBData.poster_path);
          if (isAlreadySamePoster) {
            return;
          }

          const newFallbacks = getImageFallbacks(TMDBData.poster);
          // Insert the original fallback image to the chain as well, if not already present
          if (!newFallbacks.includes(m.img)) {
            newFallbacks.splice(newFallbacks.length - 1, 0, m.img);
          }

          imgElement.setAttribute('data-fallbacks', JSON.stringify(newFallbacks));
          imgElement.setAttribute('data-fallback-index', '0');
          imgElement.src = TMDBData.poster;
        }
      }
    });
  }
}

function goToDetails(name, img) {
  localStorage.setItem("movie", JSON.stringify({ name, img }));
  window.location.href = "movies_details.html";
}

// Search and Filter logic
document.getElementById('search')?.addEventListener('input', filterMovies);
document.getElementById('genreFilter')?.addEventListener('change', filterMovies);

const citySelect = document.getElementById('citySelect');
if (citySelect) {
  // Set the selected city on load if exists
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    citySelect.value = savedCity;
  }
  
  citySelect.addEventListener('change', function() {
    localStorage.setItem("selectedCity", this.value);
  });
}

function filterMovies() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const genreTerm = document.getElementById('genreFilter').value;

  const filteredMovies = movies.filter(movie => {
    const matchSearch = movie.name.toLowerCase().includes(searchTerm);
    const matchGenre = genreTerm === "" || movie.genre === genreTerm;
    return matchSearch && matchGenre;
  });

  const filteredUpcoming = upcomingMovies.filter(movie => {
    const matchSearch = movie.name.toLowerCase().includes(searchTerm);
    const matchGenre = genreTerm === "" || movie.genre === genreTerm;
    return matchSearch && matchGenre;
  });

  displayMovies(filteredMovies, "movieList");
  displayMovies(filteredUpcoming, "upcomingMovieList");
}

// Initial render
displayMovies(movies, "movieList");
displayMovies(upcomingMovies, "upcomingMovieList");