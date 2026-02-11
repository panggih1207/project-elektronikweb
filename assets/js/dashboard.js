// ==============================
// YONMUS Dashboard JS (FULL)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // ELEMENT SELECTOR
  // ==========================
  const menuOverview = document.getElementById("menuOverview");
  const menuOrders = document.getElementById("menuOrders");
  const menuConsultations = document.getElementById("menuConsultations");
  const menuServices = document.getElementById("menuServices");
  const menuSettings = document.getElementById("menuSettings");

  const pageOverview = document.getElementById("pageOverview");
  const pageOrders = document.getElementById("pageOrders");
  const pageConsultations = document.getElementById("pageConsultations");
  const pageServices = document.getElementById("pageServices");
  const pageSettings = document.getElementById("pageSettings");

  const statOrders = document.getElementById("statOrders");
  const statConsults = document.getElementById("statConsults");
  const statServices = document.getElementById("statServices");
  const statPending = document.getElementById("statPending");

  const ordersTableBody = document.getElementById("ordersTableBody");
  const consultTableBody = document.getElementById("consultTableBody");
  const serviceTableBody = document.getElementById("serviceTableBody");

  const btnAddService = document.getElementById("btnAddService");

  // ==========================
  // STORAGE FUNCTIONS
  // ==========================
  const getData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // ==========================
  // DEFAULT DATA
  // ==========================
  const initDefaultServices = () => {
    const services = getData("services");
    if (services.length === 0) {
      const defaultServices = [
        { id: "SRV-001", name: "Servis TV LED/LCD", category: "Rumah Tangga", price: 150000 },
        { id: "SRV-002", name: "Servis Mesin Cuci", category: "Rumah Tangga", price: 200000 },
        { id: "SRV-003", name: "Servis Kulkas", category: "Rumah Tangga", price: 250000 },
        { id: "SRV-004", name: "Servis Speaker / Amplifier", category: "Audio", price: 180000 },
        { id: "SRV-005", name: "Perbaikan PCB / Board Elektronik", category: "Industri", price: 300000 },
      ];
      saveData("services", defaultServices);
    }
  };

  initDefaultServices();

  // ==========================
  // NAVIGATION (SHOW/HIDE PAGE)
  // ==========================
  const hideAllPages = () => {
    pageOverview.classList.add("hidden");
    pageOrders.classList.add("hidden");
    pageConsultations.classList.add("hidden");
    pageServices.classList.add("hidden");
    pageSettings.classList.add("hidden");
  };

  const setActiveMenu = (activeMenu) => {
    const menus = [menuOverview, menuOrders, menuConsultations, menuServices, menuSettings];
    menus.forEach((menu) => {
      if (!menu) return;
      menu.classList.remove("bg-white/10", "text-white", "font-semibold");
      menu.classList.add("text-gray-300");
    });

    if (activeMenu) {
      activeMenu.classList.add("bg-white/10", "text-white", "font-semibold");
      activeMenu.classList.remove("text-gray-300");
    }
  };

  const goToPage = (pageName) => {
    hideAllPages();

    if (pageName === "overview") {
      pageOverview.classList.remove("hidden");
      setActiveMenu(menuOverview);
      renderOverview();
    }

    if (pageName === "orders") {
      pageOrders.classList.remove("hidden");
      setActiveMenu(menuOrders);
      renderOrders();
    }

    if (pageName === "consultations") {
      pageConsultations.classList.remove("hidden");
      setActiveMenu(menuConsultations);
      renderConsultations();
    }

    if (pageName === "services") {
      pageServices.classList.remove("hidden");
      setActiveMenu(menuServices);
      renderServices();
    }

    if (pageName === "settings") {
      pageSettings.classList.remove("hidden");
      setActiveMenu(menuSettings);
      renderSettings();
    }
  };

  if (menuOverview) menuOverview.addEventListener("click", () => goToPage("overview"));
  if (menuOrders) menuOrders.addEventListener("click", () => goToPage("orders"));
  if (menuConsultations) menuConsultations.addEventListener("click", () => goToPage("consultations"));
  if (menuServices) menuServices.addEventListener("click", () => goToPage("services"));
  if (menuSettings) menuSettings.addEventListener("click", () => goToPage("settings"));

  // ==========================
  // RENDER OVERVIEW
  // ==========================
  const renderOverview = () => {
    const orders = getData("orders");
    const consultations = getData("consultations");
    const services = getData("services");

    const pendingOrders = orders.filter((o) => o.status === "Pending");

    if (statOrders) statOrders.textContent = orders.length;
    if (statConsults) statConsults.textContent = consultations.length;
    if (statServices) statServices.textContent = services.length;
    if (statPending) statPending.textContent = pendingOrders.length;
  };

  // ==========================
  // ORDERS TABLE
  // ==========================
  const renderOrders = () => {
    const orders = getData("orders");

    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = "";

    if (orders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-6 text-gray-500">
            Belum ada pesanan masuk.
          </td>
        </tr>
      `;
      return;
    }

    orders.forEach((order, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50 transition";

      tr.innerHTML = `
        <td class="py-3 px-4">${order.id}</td>
        <td class="py-3 px-4">${order.name}</td>
        <td class="py-3 px-4">${order.service}</td>
        <td class="py-3 px-4">
          <span class="px-3 py-1 rounded-full text-sm font-semibold
            ${order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
            ${order.status === "Proses" ? "bg-blue-100 text-blue-700" : ""}
            ${order.status === "Selesai" ? "bg-green-100 text-green-700" : ""}
          ">
            ${order.status}
          </span>
        </td>
        <td class="py-3 px-4">${order.date}</td>
        <td class="py-3 px-4 flex gap-2">
          <select class="border px-2 py-1 rounded text-sm" data-index="${index}">
            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Proses" ${order.status === "Proses" ? "selected" : ""}>Proses</option>
            <option value="Selesai" ${order.status === "Selesai" ? "selected" : ""}>Selesai</option>
          </select>

          <button class="btnDeleteOrder bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            data-index="${index}">
            Delete
          </button>
        </td>
      `;

      ordersTableBody.appendChild(tr);
    });

    // Update Status
    const statusDropdowns = ordersTableBody.querySelectorAll("select");
    statusDropdowns.forEach((select) => {
      select.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        const orders = getData("orders");

        orders[index].status = e.target.value;
        saveData("orders", orders);

        renderOrders();
        renderOverview();
      });
    });

    // Delete Order
    const deleteButtons = ordersTableBody.querySelectorAll(".btnDeleteOrder");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        let orders = getData("orders");

        const confirmDelete = confirm("Yakin ingin menghapus pesanan ini?");
        if (!confirmDelete) return;

        orders.splice(index, 1);
        saveData("orders", orders);

        renderOrders();
        renderOverview();
      });
    });
  };

  // ==========================
  // CONSULTATIONS TABLE
  // ==========================
  const renderConsultations = () => {
    const consultations = getData("consultations");

    if (!consultTableBody) return;
    consultTableBody.innerHTML = "";

    if (consultations.length === 0) {
      consultTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-6 text-gray-500">
            Belum ada konsultasi masuk.
          </td>
        </tr>
      `;
      return;
    }

    consultations.forEach((consult, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50 transition";

      tr.innerHTML = `
        <td class="py-3 px-4">${consult.name}</td>
        <td class="py-3 px-4">${consult.wa}</td>
        <td class="py-3 px-4">${consult.type}</td>
        <td class="py-3 px-4">${consult.issue}</td>
        <td class="py-3 px-4 flex gap-2">
          <button class="btnDeleteConsult bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            data-index="${index}">
            Delete
          </button>
        </td>
      `;

      consultTableBody.appendChild(tr);
    });

    const deleteButtons = consultTableBody.querySelectorAll(".btnDeleteConsult");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        let consultations = getData("consultations");

        const confirmDelete = confirm("Yakin ingin menghapus konsultasi ini?");
        if (!confirmDelete) return;

        consultations.splice(index, 1);
        saveData("consultations", consultations);

        renderConsultations();
        renderOverview();
      });
    });
  };

  // ==========================
  // SERVICES CRUD
  // ==========================
  const generateServiceId = () => {
    const services = getData("services");
    const number = services.length + 1;
    return `SRV-${String(number).padStart(3, "0")}`;
  };

  const renderServices = () => {
    const services = getData("services");

    if (!serviceTableBody) return;
    serviceTableBody.innerHTML = "";

    if (services.length === 0) {
      serviceTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-6 text-gray-500">
            Belum ada layanan.
          </td>
        </tr>
      `;
      return;
    }

    services.forEach((service, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50 transition";

      tr.innerHTML = `
        <td class="py-3 px-4">${service.id}</td>
        <td class="py-3 px-4">${service.name}</td>
        <td class="py-3 px-4">${service.category}</td>
        <td class="py-3 px-4">Rp ${service.price.toLocaleString("id-ID")}</td>
        <td class="py-3 px-4 flex gap-2">
          <button class="btnEditService bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            data-index="${index}">
            Edit
          </button>
          <button class="btnDeleteService bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            data-index="${index}">
            Delete
          </button>
        </td>
      `;

      serviceTableBody.appendChild(tr);
    });

    // Delete Service
    serviceTableBody.querySelectorAll(".btnDeleteService").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        let services = getData("services");

        const confirmDelete = confirm("Yakin ingin menghapus layanan ini?");
        if (!confirmDelete) return;

        services.splice(index, 1);
        saveData("services", services);

        renderServices();
        renderOverview();
      });
    });

    // Edit Service
    serviceTableBody.querySelectorAll(".btnEditService").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const services = getData("services");

        openServiceModal("edit", services[index], index);
      });
    });
  };

  // ==========================
  // MODAL (CREATE/EDIT SERVICE)
  // ==========================
  const createModal = () => {
    let modal = document.getElementById("serviceModal");

    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "serviceModal";
    modal.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center hidden z-50";

    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 id="modalTitle" class="text-xl font-bold mb-4">Tambah Layanan</h2>

        <form id="serviceForm" class="space-y-3">
          <div>
            <label class="text-sm font-medium">Nama Layanan</label>
            <input id="serviceName" type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div>
            <label class="text-sm font-medium">Kategori</label>
            <select id="serviceCategory"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Rumah Tangga">Rumah Tangga</option>
              <option value="Audio">Audio</option>
              <option value="Industri">Industri</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Harga Estimasi</label>
            <input id="servicePrice" type="number"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <button type="button" id="btnCloseModal"
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
              Batal
            </button>
            <button type="submit"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  };

  const openServiceModal = (mode = "add", data = null, index = null) => {
    const modal = createModal();
    modal.classList.remove("hidden");

    const modalTitle = document.getElementById("modalTitle");
    const serviceForm = document.getElementById("serviceForm");
    const serviceName = document.getElementById("serviceName");
    const serviceCategory = document.getElementById("serviceCategory");
    const servicePrice = document.getElementById("servicePrice");
    const btnCloseModal = document.getElementById("btnCloseModal");

    modalTitle.textContent = mode === "add" ? "Tambah Layanan" : "Edit Layanan";

    if (mode === "edit" && data) {
      serviceName.value = data.name;
      serviceCategory.value = data.category;
      servicePrice.value = data.price;
    } else {
      serviceName.value = "";
      serviceCategory.value = "Rumah Tangga";
      servicePrice.value = "";
    }

    btnCloseModal.onclick = () => {
      modal.classList.add("hidden");
    };

    serviceForm.onsubmit = (e) => {
      e.preventDefault();

      const name = serviceName.value.trim();
      const category = serviceCategory.value.trim();
      const price = Number(servicePrice.value);

      if (!name || !category || !price) {
        alert("Semua field wajib diisi!");
        return;
      }

      let services = getData("services");

      if (mode === "add") {
        services.push({
          id: generateServiceId(),
          name,
          category,
          price,
        });
      }

      if (mode === "edit" && index !== null) {
        services[index].name = name;
        services[index].category = category;
        services[index].price = price;
      }

      saveData("services", services);

      modal.classList.add("hidden");
      renderServices();
      renderOverview();
    };
  };

  if (btnAddService) {
    btnAddService.addEventListener("click", () => {
      openServiceModal("add");
    });
  }

  // ==========================
  // SETTINGS
  // ==========================
  const renderSettings = () => {
    const settings = JSON.parse(localStorage.getItem("settings")) || {};

    const nameInput = document.getElementById("settingName");
    const waInput = document.getElementById("settingWa");
    const addressInput = document.getElementById("settingAddress");
    const hoursInput = document.getElementById("settingHours");
    const btnSave = document.getElementById("btnSaveSettings");

    if (!nameInput || !btnSave) return;

    nameInput.value = settings.name || "YONMUS";
    waInput.value = settings.wa || "";
    addressInput.value = settings.address || "";
    hoursInput.value = settings.hours || "";

    btnSave.onclick = () => {
      const newSettings = {
        name: nameInput.value.trim(),
        wa: waInput.value.trim(),
        address: addressInput.value.trim(),
        hours: hoursInput.value.trim(),
      };

      localStorage.setItem("settings", JSON.stringify(newSettings));
      alert("Settings berhasil disimpan!");
    };
  };

  // ==========================
  //
