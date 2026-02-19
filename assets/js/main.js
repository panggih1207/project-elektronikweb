document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // 1. Smooth scroll navbar
    // ==========================
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 64;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
   
     
    
    // ==========================
    // 2. Mobile menu toggle
    // ==========================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close menu ketika klik link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ==========================
    // 3. Search filter layanan
    // ==========================
    const searchServiceInput = document.getElementById('searchService');
    const serviceCards = document.querySelectorAll('.service-card');

    if (searchServiceInput && serviceCards.length > 0) {
        searchServiceInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase();

            serviceCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : '';
                const cardService = card.dataset.service ? card.dataset.service.toLowerCase() : '';

                if (
                    cardText.includes(searchTerm) ||
                    cardCategory.includes(searchTerm) ||
                    cardService.includes(searchTerm)
                ) {
                    card.classList.remove('hidden');
                    card.style.display = "block";
                } else {
                    card.classList.add('hidden');
                    card.style.display = "none";
                }
            });
        });
    }

    // ==========================
    // Helper localStorage
    // ==========================
    const getLocalStorageData = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    };

    const setLocalStorageData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // ==========================
    // 4. Form konsultasi
    // ==========================
    const consultationForm = document.getElementById('consultationForm');

    if (consultationForm) {
        consultationForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const consultName = document.getElementById('consultName').value.trim();
            const consultWa = document.getElementById('consultWa').value.trim();
            const consultType = document.getElementById('consultType').value.trim();
            const consultIssue = document.getElementById('consultIssue').value.trim();
            const consultPhoto = document.getElementById('consultPhoto').files[0];

            if (!consultName || !consultWa || !consultType || !consultIssue) {
                alert('Mohon lengkapi semua field konsultasi yang wajib diisi.');
                return;
            }

            const newConsultation = {
                id: Date.now(),
                date: new Date().toISOString(),
                name: consultName,
                whatsapp: consultWa,
                type: consultType,
                issue: consultIssue,
                photoFileName: consultPhoto ? consultPhoto.name : 'N/A'
            };

            const consultations = getLocalStorageData('consultations');
            consultations.push(newConsultation);
            setLocalStorageData('consultations', consultations);

            alert('Konsultasi Anda telah terkirim! Kami akan segera menghubungi Anda.');
            consultationForm.reset();
        });
    }

    // ==========================
    // 5. Form order servis + summary
    // ==========================
    const orderForm = document.getElementById('orderForm');
    const orderSummaryDiv = document.getElementById('orderSummary');

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
        orderForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const orderName = document.getElementById('orderName').value.trim();
            const orderWa = document.getElementById('orderWa').value.trim();
            const orderAddress = document.getElementById('orderAddress').value.trim();
            const orderServiceSelect = document.getElementById('orderService');
            const orderService = orderServiceSelect.value.trim();
            const orderDesc = document.getElementById('orderDesc').value.trim();
            const orderDate = document.getElementById('orderDate').value.trim();
            const orderTypeInput = document.querySelector('input[name="orderType"]:checked');

            if (!orderName || !orderWa || !orderAddress || !orderService || !orderDesc || !orderDate || !orderTypeInput) {
                alert('Mohon lengkapi semua field pemesanan servis yang wajib diisi.');
                return;
            }

            const orderType = orderTypeInput.value;

            const orders = getLocalStorageData('orders');

            const newOrder = {
                id: generateOrderId(orders),
                dateCreated: new Date().toISOString(),
                serviceDate: orderDate,
                name: orderName,
                whatsapp: orderWa,
                address: orderAddress,
                service: orderService,
                description: orderDesc,
                orderType: orderType === 'datang' ? 'Datang ke Lokasi Kami' : 'Panggilan ke Rumah/Kantor',
                status: 'Pending'
            };

            orders.push(newOrder);
            setLocalStorageData('orders', orders);

            // Tampilkan summary
            if (orderSummaryDiv) {
                document.getElementById('summaryName').textContent = newOrder.name;
                document.getElementById('summaryWa').textContent = newOrder.whatsapp;
                document.getElementById('summaryAddress').textContent = newOrder.address;
                document.getElementById('summaryService').textContent =
                    orderServiceSelect.options[orderServiceSelect.selectedIndex].text;
                document.getElementById('summaryOrderType').textContent = newOrder.orderType;
                document.getElementById('summaryDesc').textContent = newOrder.description;
                document.getElementById('summaryDate').textContent = newOrder.serviceDate;

                orderSummaryDiv.classList.remove('hidden');
            }

            alert(`Pesanan Anda dengan ID ${newOrder.id} telah diterima. Kami akan segera menghubungi Anda!`);
            orderForm.reset();
        });
    }

});
