document.addEventListener('DOMContentLoaded', () => {
    // ---- Navigation Logic ----
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const topbarTitle = document.getElementById('topbar-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove('active');
            });

            // Show target section
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Re-trigger animation by doing a small reflow hack
                targetSection.style.animation = 'none';
                targetSection.offsetHeight; /* trigger reflow */
                targetSection.style.animation = null; 
                targetSection.classList.add('active');
            }

            // Update Topbar Title
            if(item.querySelector('span')) {
                topbarTitle.textContent = item.querySelector('span').textContent;
            }
        });
    });

    // ---- 3D Tilt Effect Logic for Cards ----
    const cards = document.querySelectorAll('.stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    });

    function handleMouseMove(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation degrees (max 15 degrees)
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease-out';
    }

    function handleMouseLeave(e) {
        const card = this;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }

    // ---- Dynamic Data Loading ----
    async function loadAdminData() {
        // Load Bookings (Orders)
        let orders = [];
        if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
            const { data, error } = await supabaseClient.from('orders').select('*').order('date', { ascending: false });
            if (!error && data) orders = data;
        } else {
            orders = JSON.parse(localStorage.getItem('orders')) || [];
        }

        // Load Users
        let users = [];
        if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
            const { data, error } = await supabaseClient.from('users').select('*');
            if (!error && data) users = data;
        } else {
            const localUser = JSON.parse(localStorage.getItem('user'));
            if (localUser) users.push(localUser);
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (userProfile && !users.find(u => u.email === userProfile.email)) users.push(userProfile);
        }

        // Extract unique emails from orders to guarantee we show active mail IDs of users who booked
        orders.forEach(order => {
            if (order.user && order.user !== 'Guest' && !users.find(u => u.email === order.user)) {
                users.push({ email: order.user });
            }
        });

        // Add currently logged in user just in case
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser && !users.find(u => u.email === loggedInUser)) {
            users.push({ email: loggedInUser });
        }

        renderBookings(orders);
        renderUsers(users);
        renderEvents();
    }

    function renderBookings(orders) {
        const dashboardBody = document.getElementById('dashboard-bookings-body');
        const mainBody = document.getElementById('bookings-table-body');
        const loadingText = document.getElementById('bookings-loading-text');
        const tableContainer = document.getElementById('bookings-table-container');

        if (dashboardBody) dashboardBody.innerHTML = '';
        if (mainBody) mainBody.innerHTML = '';

        if (orders.length === 0) {
            if (loadingText) loadingText.textContent = "No bookings found yet.";
            return;
        }

        if (loadingText) loadingText.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'block';

        orders.forEach((order, index) => {
            const orderId = order.id || `#EN-${Math.floor(10000 + Math.random() * 90000)}`;
            const rowHTML = `
                <tr>
                    <td>${orderId}</td>
                    <td>${order.user || 'Guest'}</td>
                    <td>${order.title || order.category || 'Unknown Event'}</td>
                    <td>₹${order.amount || 0}</td>
                    <td>${order.seats || 'N/A'}</td>
                    <td>${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                    <td><span class="status-badge status-active">Success</span></td>
                </tr>
            `;
            if (mainBody) mainBody.innerHTML += rowHTML;
            if (dashboardBody && index < 3) dashboardBody.innerHTML += `
                <tr>
                    <td>${orderId}</td>
                    <td>${order.user || 'Guest'}</td>
                    <td>${order.title || 'Event'}</td>
                    <td>₹${order.amount || 0}</td>
                    <td><span class="status-badge status-active">Success</span></td>
                </tr>
            `;
        });
    }

    function renderUsers(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        tbody.innerHTML = `
            <tr>
                <td>admin@eventnest.com</td>
                <td>Superadmin</td>
                <td>System</td>
                <td><button class="btn-red" style="padding: 5px 10px; font-size: 0.8rem; background: #333;"><i class="fas fa-lock"></i></button></td>
            </tr>
        `;
        users.forEach(user => {
            if (user.email === 'admin@eventnest.com') return; // Skip default admin
            tbody.innerHTML += `
                <tr>
                    <td>${user.email || 'Unknown'}</td>
                    <td>Customer</td>
                    <td>${user.age ? user.age + ' yrs' : 'N/A'}</td>
                    <td><button class="btn-red user-manage-btn" style="padding: 5px 10px; font-size: 0.8rem;">Manage</button></td>
                </tr>
            `;
        });
        
        document.querySelectorAll('.user-manage-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const user = users[index > 0 ? index : index]; // Approximation
                const newRole = prompt(`Manage user: ${user.email}\nCurrent Role: Customer\n\nEnter new role (e.g., Admin, Customer, Banned):`, "Customer");
                if (newRole) {
                    alert(`User ${user.email} role updated to ${newRole}`);
                }
            });
        });
    }

    // Load custom events from localStorage or use defaults
    let eventsList = JSON.parse(localStorage.getItem('admin_custom_events')) || [
        { id: 1, name: "MI vs CSK", category: "Sports", date: "12 Apr 2026", img: "images/mi.png", status: "Active" },
        { id: 2, name: "Inception Re-release", category: "Movies", date: "15 Apr 2026", img: "images/movie2.jpg", status: "Draft" }
    ];

    function saveEvents() {
        localStorage.setItem('admin_custom_events', JSON.stringify(eventsList));
    }

    function renderEvents() {
        const tbody = document.getElementById('events-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        eventsList.forEach((ev, idx) => {
            const statusClass = ev.status === 'Active' ? 'status-active' : 'status-draft';
            tbody.innerHTML += `
                <tr>
                    <td><img src="${ev.img}" style="width: 40px; height: 40px; object-fit: cover; border-radius:4px;" alt="poster" onerror="this.onerror=null; this.src='images/eventnest_logo_v2.jpg';"></td>
                    <td>${ev.name}</td>
                    <td>${ev.category}</td>
                    <td>${ev.date}</td>
                    <td><span class="status-badge ${statusClass}">${ev.status}</span></td>
                    <td>
                        <button class="btn-red edit-event-btn" data-index="${idx}" style="padding: 5px 10px; font-size: 0.8rem;">Edit</button>
                        <button class="btn-red delete-event-btn" data-index="${idx}" style="padding: 5px 10px; font-size: 0.8rem; background: #333; margin-left: 5px;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll('.edit-event-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                const ev = eventsList[idx];
                const newName = prompt("Edit Event Name:", ev.name);
                if (newName !== null) ev.name = newName;
                const newCat = prompt("Edit Category:", ev.category);
                if (newCat !== null) ev.category = newCat;
                const newImg = prompt("Edit Image URL:", ev.img);
                if (newImg !== null) ev.img = newImg;
                
                alert("Event updated successfully!");
                saveEvents();
                renderEvents();
            });
        });

        document.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                if (confirm(`Are you sure you want to delete "${eventsList[idx].name}"?`)) {
                    eventsList.splice(idx, 1);
                    saveEvents();
                    renderEvents();
                }
            });
        });
    }

    // Call init
    loadAdminData();

    // ---- Button Interactivity ----
    const buttons = document.querySelectorAll('.btn-red');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim().toLowerCase();
            if (this.classList.contains('edit-event-btn') || this.classList.contains('user-manage-btn')) return; // Handled separately
            
            if (btnText.includes('export')) {
                alert('Success: Report has been exported to CSV format.');
            } 
            else if (btnText.includes('add new event')) {
                const name = prompt('Enter Event Name:');
                if (!name) return;
                const cat = prompt('Enter Category:');
                const date = prompt('Enter Date (e.g. 20 May 2026):');
                const img = prompt('Enter Image URL:');
                eventsList.push({ id: Date.now(), name, category: cat || 'General', date: date || 'TBD', img: img || 'images/placeholder.jpg', status: 'Active' });
                saveEvents();
                renderEvents();
                alert(`Event "${name}" has been added to Active events and will show on the main website.`);
            }
            else if (btnText.includes('add venue')) {
                const venue = prompt('Enter the new venue name:');
                if (venue) {
                    const capacity = prompt('Enter seating capacity:');
                    alert(`Venue "${venue}" with capacity ${capacity} successfully added to the database.`);
                }
            }
            else if (btnText.includes('create code')) {
                const code = prompt('Enter new Promo Code (e.g., WINTER50):');
                if (code) {
                    alert(`Promo Code "${code}" is now active!`);
                }
            }
            else if (btnText.includes('save changes')) {
                alert('Platform settings saved successfully.');
            }
            else if (this.innerHTML.includes('fa-search')) {
                const searchInput = this.previousElementSibling;
                if (searchInput && searchInput.value) {
                    alert(`Searching database for Booking ID: ${searchInput.value}`);
                } else {
                    alert('Please enter a booking ID to search.');
                }
            }
            else if (this.innerHTML.includes('fa-lock')) {
                alert('User account locked successfully.');
            }
        });
    });

    // ---- Theme Toggle Logic ----
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.add('light-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Theme';
            themeBtn.style.background = '#fff';
            themeBtn.style.color = '#333';
        }

        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
            if (document.documentElement.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i> Theme';
                themeBtn.style.background = '#fff';
                themeBtn.style.color = '#333';
            } else {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i> Theme';
                themeBtn.style.background = '#333';
                themeBtn.style.color = '#fff';
            }
        });
    }
});
