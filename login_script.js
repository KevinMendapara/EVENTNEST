let generatedOTP = "";

// SWITCH FORMS
function showRegister() {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("otpForm").classList.remove("active");
  document.getElementById("registerForm").classList.add("active");
}

function showLogin() {
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("otpForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
}

// SHOW PASSWORD
function togglePassword(id) {
  let input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// EMAIL VALIDATION
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PASSWORD STRENGTH
document.getElementById("password").addEventListener("input", function () {
  let pass = this.value;
  let bar = document.getElementById("strengthBar");

  if (pass.length < 6) {
    bar.style.width = "30%";
    bar.style.background = "red";
  } else if (pass.length < 10) {
    bar.style.width = "60%";
    bar.style.background = "orange";
  } else {
    bar.style.width = "100%";
    bar.style.background = "green";
  }
});

// REGISTER
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim().toLowerCase();
  let age = Number(document.getElementById("age").value);
  let password = document.getElementById("password").value.trim();

  if (!isValidEmail(email)) return alert("Invalid Email");

  // Store temporary user info in localStorage for OTP verification step
  localStorage.setItem("temp_user", JSON.stringify({ name, email, age, password }));

  // GENERATE OTP
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert("Your OTP is: " + generatedOTP); // demo purpose

  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("otpForm").classList.add("active");
});

// OTP VERIFY
document.getElementById("otpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let otp = document.getElementById("otpInput").value;

  if (otp === generatedOTP) {
    let tempUser = JSON.parse(localStorage.getItem("temp_user"));
    
    // Save to Supabase (if configured), else LocalStorage
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        supabaseClient.from('users').insert([tempUser]).then(({data, error}) => {
            if (error) {
                alert("Error saving to cloud database: " + error.message);
            } else {
                alert("Account Created in Cloud Database!");
                localStorage.setItem("user", JSON.stringify(tempUser));
                localStorage.removeItem("temp_user");
                showLogin();
            }
        });
    } else {
        localStorage.setItem("user", JSON.stringify(tempUser));
        localStorage.removeItem("temp_user");
        alert("Account Created (Saved to Local Storage)!");
        showLogin();
    }
  } else {
    alert("Wrong OTP");
  }
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value.trim().toLowerCase();
  let password = document.getElementById("loginPassword").value.trim();
  let remember = document.getElementById("rememberMe").checked;

  // HARDCODED ADMIN LOGIN Redirect
  if (email === "admin@eventnest.com" && password === "admin123") {
      if (remember) localStorage.setItem("session", "true");
      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("userProfile", JSON.stringify({ name: "Admin", email, role: "admin" }));
      alert("Welcome to Admin Portal!");
      window.location.href = "admin.html";
      return;
  }

  if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
      supabaseClient.from('users').select('*').eq('email', email).eq('password', password).then(({data, error}) => {
          if (error || !data || data.length === 0) {
              alert("Invalid credentials from Cloud DB");
          } else {
              completeLogin(email, remember, data[0]);
          }
      });
  } else {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user && user.email === email && user.password === password) {
          completeLogin(email, remember, user);
      } else {
          alert("Invalid credentials from Local Storage");
      }
  }

  function completeLogin(email, remember, userObj) {
      if (remember) localStorage.setItem("session", "true");
      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("userProfile", JSON.stringify(userObj));
      alert("Login Success!");
      window.location.href = "index.html";
  }
});

// JWT Parser Helper for Social Auth
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

// Initialize Social Auth SDKs
window.onload = function () {
  // --- Google Identity Services ---
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com", // TODO: Set your Google Client ID
      callback: handleGoogleCredentialResponse
    });

    // Render for Sign In Form
    const loginBtn = document.getElementById("g_id_signin_login");
    if (loginBtn) {
      google.accounts.id.renderButton(
        loginBtn,
        { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", width: 182 }
      );
    }

    // Render for Sign Up Form
    const registerBtn = document.getElementById("g_id_signin_register");
    if (registerBtn) {
      google.accounts.id.renderButton(
        registerBtn,
        { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", width: 182 }
      );
    }
  } else {
    console.warn("Google SDK failed to load.");
  }

  // --- Apple Sign In SDK ---
  if (typeof AppleID !== 'undefined' && AppleID.auth) {
    AppleID.auth.init({
      clientId: 'YOUR_APPLE_CLIENT_ID_HERE', // TODO: Set your Apple Client ID (Service ID)
      scope: 'name email',
      redirectURI: 'https://yourdomain.com/callback', // TODO: Set your registered redirect URI
      state: 'origin:web',
      usePopup: true
    });
  } else {
    console.warn("Apple SDK failed to load.");
  }
};

// Handle Google Response
function handleGoogleCredentialResponse(response) {
  const jwt = response.credential;
  const decodedToken = parseJwt(jwt);

  if (decodedToken) {
    const { name, email, picture } = decodedToken;
    console.log("Google Auth Success:", { name, email, picture });

    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("userProfile", JSON.stringify({ name, email, picture, provider: "Google" }));

    alert(`Successfully authenticated with Google!\nWelcome ${name}`);
    window.location.href = "index.html";
  }
}

// Handle Apple Response
async function handleAppleLogin() {
  try {
    const response = await AppleID.auth.signIn();
    const idToken = response.authorization.id_token;
    const decodedToken = parseJwt(idToken);
    
    if (decodedToken) {
      const email = decodedToken.email;
      // Apple only provides the 'user' object with name on the FIRST ever login.
      let name = "Apple User"; 
      
      if (response.user && response.user.name) {
        name = `${response.user.name.firstName} ${response.user.name.lastName}`.trim();
      }

      console.log("Apple Auth Success:", { name, email });

      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("userProfile", JSON.stringify({ name, email, provider: "Apple" }));

      alert(`Successfully authenticated with Apple!\nWelcome ${name}`);
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Apple Sign-In Error:", error);
    if (error.error !== 'popup_closed_by_user') {
      alert("Apple Sign-In failed. Please try again.");
    }
  }
}