/* Refactored JavaScript for timeline-project */

/* Refactored JavaScript for timeline-project */

// Data storage for categories, pakets, statuses, executors
let categories = JSON.parse(localStorage.getItem('categories')) || ['Vtuber Design & Rigging', 'Vtuber Design'];
let pakets = JSON.parse(localStorage.getItem('pakets')) || ['Full Body', 'Half Body', 'Bust Up'];
let statuses = JSON.parse(localStorage.getItem('statuses')) || ['done', 'pending', 'in progress'];
let executors = JSON.parse(localStorage.getItem('executors')) || ['dina', 'nayf', 'nopal', 'fatur'];

// Timeline data loaded from localStorage
let timelineData = JSON.parse(localStorage.getItem('timelineData')) || [];

// Tabelbantu data as global variable
const tabelbantuData = [
  {
    kategori: "Vtuber Design & Rigging",
    jenis: "Full Body",
    stage1: 1,
    stage2: 2,
    stage3: 3,
    stage4: 2
  },
  {
    kategori: "Vtuber Design & Rigging",
    jenis: "Half Body",
    stage1: 1,
    stage2: 2,
    stage3: 2,
    stage4: 1
  },
  {
    kategori: "Vtuber Design & Rigging",
    jenis: "Bust Up",
    stage1: 1,
    stage2: 1,
    stage3: 1,
    stage4: 1
  },
  {
    kategori: "Design Emotes",
    jenis: "Basic",
    stage1: 1,
    stage2: 1,
    stage3: 1,
    stage4: 0
  },
  {
    kategori: "Design Emotes",
    jenis: "Standart",
    stage1: 1,
    stage2: 1,
    stage3: 1,
    stage4: 0
  }
  // Add more entries as needed
];

// Current editing context for modal
let currentEditType = null;
let selectedItemIndex = null;

// Formatters
const rupiahFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const pointFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 });

// Utility functions for menu toggling
function toggleMenu(menuId) {
  const menu = document.getElementById(menuId);
  menu.classList.toggle('hidden');
}

function closeAllMenusExcept(exceptId) {
  ['categoryMenu', 'paketMenu', 'statusMenu'].forEach(id => {
    if (id !== exceptId) {
      document.getElementById(id).classList.add('hidden');
    }
  });
}

function closeAllMenus() {
  ['categoryMenu', 'paketMenu', 'statusMenu'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}

// Modal management
function showModal(type) {
  currentEditType = type;
  selectedItemIndex = null;
  const modalTitle = document.getElementById('modalTitle');
  modalTitle.textContent = 'Edit ' + type.charAt(0).toUpperCase() + type.slice(1) + 's';
  document.getElementById('itemInput').value = '';
  renderItemList();
  document.getElementById('editModal').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('editModal').classList.add('hidden');
}

// Render item list in modal
function renderItemList() {
  const listEl = document.getElementById('itemList');
  listEl.innerHTML = '';
  const items = getCurrentItems();
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.className = 'cursor-pointer p-2 hover:bg-indigo-100 rounded text-base leading-6';
    li.addEventListener('click', () => {
      selectedItemIndex = index;
      document.getElementById('itemInput').value = item;
      highlightSelectedItem(index);
    });
    listEl.appendChild(li);
  });
}

function highlightSelectedItem(index) {
  const listEl = document.getElementById('itemList');
  Array.from(listEl.children).forEach((li, i) => {
    if (i === index) {
      li.classList.add('bg-indigo-300');
    } else {
      li.classList.remove('bg-indigo-300');
    }
  });
}

function getCurrentItems() {
  if (currentEditType === 'category') return categories;
  if (currentEditType === 'paket') return pakets;
  if (currentEditType === 'status') return statuses;
  if (currentEditType === 'executor') return executors;
  return [];
}

function setCurrentItems(items) {
  if (currentEditType === 'category') {
    categories = items;
    localStorage.setItem('categories', JSON.stringify(categories));
    updateCategorySelects();
  }
  if (currentEditType === 'paket') {
    pakets = items;
    localStorage.setItem('pakets', JSON.stringify(pakets));
  }
  if (currentEditType === 'status') {
    statuses = items;
    localStorage.setItem('statuses', JSON.stringify(statuses));
  }
  if (currentEditType === 'executor') {
    executors = items;
    localStorage.setItem('executors', JSON.stringify(executors));
    updateExecutorSelects();
  }
}

// Update all category selects in timeline table
function updateCategorySelects() {
  const selects = document.querySelectorAll('tbody#timelineTableBody select.category-select');
  selects.forEach(select => {
    const currentValue = select.value;
    select.innerHTML = categories.map(cat => `<option value="${cat}" ${cat === currentValue ? 'selected' : ''}>${cat}</option>`).join('');
  });
}

// Update all executor selects in timeline table
function updateExecutorSelects() {
  const selects = document.querySelectorAll('tbody#timelineTableBody select.executor-select');
  selects.forEach(select => {
    const currentValue = select.value;
    select.innerHTML = executors.map(exec => `<option value="${exec}" ${exec === currentValue ? 'selected' : ''}>${exec}</option>`).join('');
  });
}

// Format input values
function formatRupiahInput(input) {
  let value = input.value.replace(/[^0-9]/g, '');
  if (value === '') {
    input.value = '';
    return;
  }
  input.value = 'Rp ' + rupiahFormatter.format(parseInt(value)).replace('Rp', '').trim();
}

function formatPointInput(input) {
  let value = input.value.replace(/[^0-9]/g, '');
  if (value === '') {
    input.value = '';
    return;
  }
  input.value = pointFormatter.format(parseInt(value)) + ' poin';
}

// Create executor select HTML
function createExecutorSelect(selectedExecutor) {
  return `<select class="executor-select w-full bg-red-500 text-white rounded px-3 py-2 text-sm text-center leading-6">${executors.map(exec => `<option value="${exec}" ${exec === selectedExecutor ? 'selected' : ''}>${exec}</option>`).join('')}</select>`;
}

// Render timeline table rows
function renderTimelineTable() {
  const tbody = document.getElementById('timelineTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  timelineData.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.classList.add('bg-white');
    tr.dataset.index = index;

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-normal text-sm text-gray-700 max-w-xs" style="min-width: 120px;">
        <input type="date" class="w-full border border-gray-300 rounded px-3 py-2 text-sm leading-6" value="${row.tanggal || ''}">
      </td>
      <td class="px-4 py-3 whitespace-normal text-sm text-gray-700 max-w-xs" style="min-width: 140px;">
        <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm leading-6" value="${row.client || ''}">
      </td>
      <td class="px-4 py-3 whitespace-normal text-sm max-w-xs" style="min-width: 140px;">
        <select class="category-select bg-green-700 text-white rounded px-3 py-2 text-sm leading-6 w-full">
          ${categories.map(cat => `<option value="${cat}" ${cat === row.category ? 'selected' : ''}>${cat}</option>`).join('')}
        </select>
      </td>
      <td class="px-4 py-3 whitespace-normal text-sm max-w-xs" style="min-width: 140px;">
        <select class="bg-blue-700 text-white rounded px-3 py-2 text-sm leading-6 w-full">
          ${pakets.map(pak => `<option value="${pak}" ${pak === row.paket ? 'selected' : ''}>${pak}</option>`).join('')}
        </select>
      </td>
      ${renderStageCell('stage1', row)}
      ${renderPriceCell('stage1', row)}
      ${renderStatusCell('stage1', row)}
      ${renderStageCell('stage2', row)}
      ${renderPriceCell('stage2', row)}
      ${renderStatusCell('stage2', row)}
      ${renderStageCell('stage3', row)}
      ${renderPriceCell('stage3', row)}
      ${renderStatusCell('stage3', row)}
      ${renderAnimRiggingCell(row)}
      ${renderPriceCellWithPoints('animRigging', row)}
      ${renderAnimRiggingStatusCell(row)}
      <td class="px-4 py-3 whitespace-normal text-xs text-gray-700" style="min-width: 140px;">
        <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm leading-6" value="${row.note || ''}">
      </td>
      <td class="px-4 py-3 whitespace-normal text-xs bg-brown-600 text-white rounded text-center" style="min-width: 140px;">
        <select class="w-full bg-brown-600 text-white rounded px-3 py-2 text-sm leading-6 text-center">
          <option value="Belum" ${row.backupData === 'Belum' ? 'selected' : ''}>Belum</option>
          <option value="Sudah DI backup" ${row.backupData === 'Sudah DI backup' ? 'selected' : ''}>Sudah DI backup</option>
        </select>
      </td>
      <td class="px-4 py-3 text-sm text-center">
        <button class="deleteBtn bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);

    addRowEventListeners(tr);
  });
}

// Render stage date and executor cell
function renderStageCell(stage, row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs bg-red-500 text-white rounded text-center" style="min-width: 140px;">
      <input type="date" class="w-full bg-red-500 text-white rounded px-3 py-1 text-sm leading-6 text-center" value="${row[stage + 'Date'] || ''}">
      ${createExecutorSelect(row[stage + 'Executor'])}
    </td>
  `;
}

// Render price cell with points and price inputs
function renderPriceCell(stage, row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs text-gray-700" style="min-width: 100px;">
      <div class="flex flex-col">
        <input type="text" class="border border-gray-300 rounded px-3 py-1 text-sm leading-6 mb-1" placeholder="Poin" value="${row[stage + 'HargaPoin'] || ''}">
        <input type="text" class="border border-gray-300 rounded px-3 py-1 text-sm leading-6" placeholder="Harga" value="${row[stage + 'Harga'] || ''}">
      </div>
    </td>
  `;
}

// Render price cell with points and price inputs for animRigging (same as other stages)
function renderPriceCellWithPoints(stage, row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs text-gray-700" style="min-width: 100px;">
      <div class="flex flex-col">
        <input type="text" class="border border-gray-300 rounded px-3 py-1 text-sm leading-6 mb-1" placeholder="Poin" value="${row[stage + 'HargaPoin'] || ''}">
        <input type="text" class="border border-gray-300 rounded px-3 py-1 text-sm leading-6" placeholder="Harga" value="${row[stage + 'Harga'] || ''}">
      </div>
    </td>
  `;
}

// Render status select cell
function renderStatusCell(stage, row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs bg-green-700 text-white rounded text-center" style="min-width: 100px;">
      <select class="w-full bg-green-700 text-white rounded px-3 py-2 text-sm leading-6 text-center">
        ${statuses.map(status => `<option value="${status}" ${status === row[stage + 'Status'] ? 'selected' : ''}>${status}</option>`).join('')}
      </select>
    </td>
  `;
}

// Render Animasi / Rigging date and executor cell
function renderAnimRiggingCell(row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs bg-red-500 text-white rounded text-center" style="min-width: 140px;">
      <input type="date" class="w-full bg-red-500 text-white rounded px-3 py-1 text-sm leading-6 text-center" value="${row.animRiggingDate || ''}">
      ${createExecutorSelect(row.animRiggingExecutor)}
    </td>
  `;
}

// Render Animasi / Rigging status cell
function renderAnimRiggingStatusCell(row) {
  return `
    <td class="px-4 py-3 whitespace-normal text-xs bg-green-700 text-white rounded text-center" style="min-width: 100px;">
      <select class="w-full bg-green-700 text-white rounded px-3 py-2 text-sm leading-6 text-center">
        ${statuses.map(status => `<option value="${status}" ${status === row.animRiggingStatus ? 'selected' : ''}>${status}</option>`).join('')}
      </select>
    </td>
  `;
}

// Add event listeners to row inputs/selects
function addRowEventListeners(tr) {
  const inputs = tr.querySelectorAll('input, select');

  inputs.forEach(input => {
    if (input.placeholder === 'Harga') {
      input.addEventListener('blur', () => formatRupiahInput(input));
    } else if (input.placeholder === 'Poin') {
      input.addEventListener('blur', () => formatPointInput(input));
    }
    input.addEventListener('change', () => {
      updateTimelineDataFromRow(tr);
      autoFillStageDates(tr);
    });
  });

  // Also trigger autofill when category or paket select changes
  const categorySelect = tr.querySelector('select.category-select');
  const paketSelect = tr.querySelector('select.paket-select');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      autoFillStageDates(tr);
    });
  }
  if (paketSelect) {
    paketSelect.addEventListener('change', () => {
      autoFillStageDates(tr);
    });
  }

  tr.querySelector('.deleteBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this row?')) {
      const index = parseInt(tr.dataset.index);
      if (!isNaN(index)) {
        timelineData.splice(index, 1);
        saveTimelineData();
        renderTimelineTable();
      }
    }
  });
}

// Update timelineData from a table row
function updateTimelineDataFromRow(tr) {
  const index = parseInt(tr.dataset.index);
  if (isNaN(index)) return;

  const inputs = tr.querySelectorAll('input, select');
  const row = {
    tanggal: inputs[0].value,
    client: inputs[1].value,
    category: inputs[2].value,
    paket: inputs[3].value,
    stage1Date: inputs[4].value,
    stage1Executor: inputs[5].value,
    stage1HargaPoin: inputs[6].value,
    stage1Harga: inputs[7].value,
    stage1Status: inputs[8].value,
    stage2Date: inputs[9].value,
    stage2Executor: inputs[10].value,
    stage2HargaPoin: inputs[11].value,
    stage2Harga: inputs[12].value,
    stage2Status: inputs[13].value,
    stage3Date: inputs[14].value,
    stage3Executor: inputs[15].value,
    stage3HargaPoin: inputs[16].value,
    stage3Harga: inputs[17].value,
    stage3Status: inputs[18].value,
    animRiggingDate: inputs[19].value,
    animRiggingExecutor: inputs[20].value,
    animRiggingHargaPoin: inputs[21].value,
    animRiggingHarga: inputs[22].value,
    animRiggingStatus: inputs[23].value,
    note: inputs[24].value,
    backupData: inputs[25].value,
  };

  timelineData[index] = row;
  saveTimelineData();
}

// Save timelineData to localStorage
function saveTimelineData() {
  localStorage.setItem('timelineData', JSON.stringify(timelineData));
}

// Auto-fill stage dates based on tanggal, category, paket and tabelbantuData
function autoFillStageDates(tr) {
  const tanggalInput = tr.querySelector('input[type="date"]');
  const categorySelect = tr.querySelector('select.category-select');
  const paketSelect = tr.querySelector('select.paket-select');

  if (!tanggalInput || !tanggalInput.value || !categorySelect || !categorySelect.value || !paketSelect || !paketSelect.value) {
    return;
  }

  const baseDate = new Date(tanggalInput.value);
  if (isNaN(baseDate.getTime())) return;

  const match = tabelbantuData.find(item =>
    item.kategori.toLowerCase() === categorySelect.value.toLowerCase() && item.jenis.toLowerCase() === paketSelect.value.toLowerCase()
  );

  if (!match) return;

  const dateInputs = Array.from(tr.querySelectorAll('input[type="date"]')).filter(input => input !== tanggalInput);

  if (dateInputs.length < 4) return;

  const stage1Date = new Date(baseDate);
  stage1Date.setDate(stage1Date.getDate() + match.stage1);
  dateInputs[0].value = stage1Date.toISOString().substring(0, 10);

  const stage2Date = new Date(baseDate);
  stage2Date.setDate(stage2Date.getDate() + match.stage2);
  dateInputs[1].value = stage2Date.toISOString().substring(0, 10);

  const stage3Date = new Date(baseDate);
  stage3Date.setDate(stage3Date.getDate() + match.stage3);
  dateInputs[2].value = stage3Date.toISOString().substring(0, 10);

  const animRiggingDate = new Date(baseDate);
  animRiggingDate.setDate(animRiggingDate.getDate() + match.stage4);
  dateInputs[3].value = animRiggingDate.toISOString().substring(0, 10);
}

// Add Timeline Row button logic
document.getElementById('addTimelineRowBtn')?.addEventListener('click', () => {
  timelineData.push({
    tanggal: '',
    client: '',
    category: categories[0] || '',
    paket: pakets[0] || '',
    stage1Date: '',
    stage1Executor: executors[0] || 'dina',
    stage1HargaPoin: '',
    stage1Harga: '',
    stage1Status: statuses[0] || '',
    stage2Date: '',
    stage2Executor: executors[0] || 'dina',
    stage2HargaPoin: '',
    stage2Harga: '',
    stage2Status: statuses[0] || '',
    stage3Date: '',
    stage3Executor: executors[0] || 'dina',
    stage3HargaPoin: '',
    stage3Harga: '',
    stage3Status: statuses[0] || '',
    animRiggingDate: '',
    animRiggingExecutor: executors[0] || 'dina',
    animRiggingHargaPoin: '',
    animRiggingHarga: '',
    animRiggingStatus: statuses[0] || '',
    note: '',
    backupData: 'Belum',
  });
  saveTimelineData();
  renderTimelineTable();
});

// Menu button event listeners for managing categories, pakets, statuses, executors
document.getElementById('categoryMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  showModal('category');
  closeAllMenus();
});
document.getElementById('paketMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  showModal('paket');
  closeAllMenus();
});
document.getElementById('statusMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  showModal('status');
  closeAllMenus();
});
document.getElementById('executorMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  showModal('executor');
  closeAllMenus();
});

// Modal buttons event listeners
document.getElementById('addItemBtn')?.addEventListener('click', () => {
  const input = document.getElementById('itemInput');
  const val = input.value.trim();
  if (!val) return alert('Please enter a value.');
  const items = getCurrentItems();
  if (items.includes(val)) return alert('Item already exists.');
  items.push(val);
  setCurrentItems(items);
  input.value = '';
  renderItemList();
});

document.getElementById('updateItemBtn')?.addEventListener('click', () => {
  if (selectedItemIndex === null) return alert('Select an item to update.');
  const input = document.getElementById('itemInput');
  const val = input.value.trim();
  if (!val) return alert('Please enter a value.');
  const items = getCurrentItems();
  if (items.includes(val) && items[selectedItemIndex] !== val) return alert('Item already exists.');
  items[selectedItemIndex] = val;
  setCurrentItems(items);
  renderItemList();
});

document.getElementById('deleteItemBtn')?.addEventListener('click', () => {
  if (selectedItemIndex === null) return alert('Select an item to delete.');
  if (!confirm('Are you sure you want to delete this item?')) return;
  const items = getCurrentItems();
  items.splice(selectedItemIndex, 1);
  setCurrentItems(items);
  selectedItemIndex = null;
  document.getElementById('itemInput').value = '';
  renderItemList();
});

document.getElementById('closeModalBtn')?.addEventListener('click', () => {
  hideModal();
});

// Close menus when clicking outside
document.addEventListener('click', () => {
  closeAllMenus();
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTimelineTable();
  renderItemList();
});
