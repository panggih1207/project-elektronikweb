document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth scroll untuk navbar ke section
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header height if necessary
                const headerOffset = 64; // Approximate height of the fixed header
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // 2. Search filter layanan
    const searchServiceInput = document.getElementById('searchService');
    const serviceCards = document.querySelectorAll('.service-card');

    if (searchServiceInput && serviceCards.length > 0) {
        searchServiceInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            serviceCards.forEach(card => {
                // Get text content of the card and data-service attribute
                const cardText = card.textContent.toLowerCase();
                const cardService = card.dataset.service ? card.dataset.service.toLowerCase() : '';

                // Check if the search term is found in text content or data-service
                if (cardText.includes(searchTerm) || cardService.includes(searchTerm)) {
                    card.classList.remove('hidden'); // Show card
                } else {
                    card.classList.add('hidden'); // Hide card
                }
            });
        });
    }

    // Fungsi untuk mendapatkan data dari localStorage
    const getLocalStorageData = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    };

    // Fungsi untuk menyimpan data ke localStorage
    const setLocalStorageData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // 3. Form konsultasi
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah submit form default

            // Ambil nilai input
            const consultName = document.getElementById('consultName').value.trim();
            const consultWa = document.getElementById('consultWa').value.trim();
            const consultType = document.getElementById('consultType').value.trim();
            const consultIssue = document.getElementById('consultIssue').value.trim();
            const consultPhoto = document.getElementById('consultPhoto').files[0]; // File object, not saved to local storage

            // Validasi wajib isi
            if (!consultName || !consultWa || !consultType || !consultIssue) {
                alert('Mohon lengkapi semua field konsultasi yang wajib diisi.');
                return;
            }

            // Buat objek konsultasi
            const newConsultation = {
                id: Date.now(), // ID unik berdasarkan timestamp
                date: new Date().toISOString(), // Tanggal otomatis
                name: consultName,
                whatsapp: consultWa,
                type: consultType,
                issue: consultIssue,
                // Catatan: File foto tidak disimpan di localStorage secara langsung.
                // Jika ingin menyimpannya, perlu di-encode ke Base64 (tidak disarankan untuk file besar)
                // atau di-upload ke server.
                photoFileName: consultPhoto ? consultPhoto.name : 'N/A'
            };

            // Ambil data konsultasi yang sudah ada, tambahkan yang baru, lalu simpan
            const consultations = getLocalStorageData('consultations');
            consultations.push(newConsultation);
            setLocalStorageData('consultations', consultations);

            alert('Konsultasi Anda telah terkirim! Kami akan segera menghubungi Anda.');
            consultationForm.reset(); // Reset form
        });
    }

    // 4. Form order servis
    const orderForm = document.getElementById('orderForm');
    const orderSummaryDiv = document.getElementById('orderSummary');

    // Fungsi untuk menghasilkan ID order otomatis
    const generateOrderId = (existingOrders) => {
        const lastOrder = existingOrders[existingOrders.length - 1];
        let lastIdNum = 0;
        if (lastOrder && lastOrder.id) {
            const match = lastOrder.id.match(/ORD-(\d+)/);
            if (match && match[1]) {
                lastIdNum = parseInt(match[1]);
            }
        }
        const nextIdNum = lastIdNum + 1;
        return `ORD-${String(nextIdNum).padStart(4, '0')}`;
    };

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah submit form default

            // Ambil nilai input
            const orderName = document.getElementById('orderName').value.trim();
            const orderWa = document.getElementById('orderWa').value.trim();
            const orderAddress = document.getElementById('orderAddress').value.trim();
            const orderService = document.getElementById('orderService').value.trim();
            const orderDesc = document.getElementById('orderDesc').value.trim();
            const orderDate = document.getElementById('orderDate').value.trim();
            const orderType = document.querySelector('input[name="orderType"]:checked').value;

            // Validasi wajib isi
            if (!orderName || !orderWa || !orderAddress || !orderService || !orderDesc || !orderDate || !orderType) {
                alert('Mohon lengkapi semua field pemesanan servis yang wajib diisi.');
                return;
            }

            // Ambil data order yang sudah ada untuk membuat ID
            const orders = getLocalStorageData('orders');

            // Buat objek order
            const newOrder = {
                id: generateOrderId(orders), // ID order otomatis
                dateCreated: new Date().toISOString(), // Tanggal pembuatan order
                serviceDate: orderDate, // Tanggal servis yang dipilih user
                name: orderName,
                whatsapp: orderWa,
                address: orderAddress,
                service: orderService,
                description: orderDesc,
                orderType: orderType === 'datang' ? 'Datang ke Lokasi Kami' : 'Panggilan ke Rumah/Kantor',
                status: 'Pending' // Status default
            };

            // Tambahkan order baru dan simpan
            orders.push(newOrder);
            setLocalStorageData('orders', orders);

            // Tampilkan ringkasan order di div id="orderSummary"
            if (orderSummaryDiv) {
                document.getElementById('summaryName').textContent = newOrder.name;
                document.getElementById('summaryWa').textContent = newOrder.whatsapp;
                document.getElementById('summaryAddress').textContent = newOrder.address;
                document.getElementById('summaryService').textContent = document.getElementById('orderService').options[document.getElementById('orderService').selectedIndex].text; // Get display text
                document.getElementById('summaryOrderType').textContent = newOrder.orderType;
                document.getElementById('summaryDesc').textContent = newOrder.description;
                document.getElementById('summaryDate').textContent = newOrder.serviceDate;
                orderSummaryDiv.classList.remove('hidden'); // Tampilkan div ringkasan
            }

            alert(`Pesanan Anda dengan ID ${newOrder.id} telah diterima. Kami akan segera menghubungi Anda!`);
            orderForm.reset(); // Reset form
        });
    }

});
