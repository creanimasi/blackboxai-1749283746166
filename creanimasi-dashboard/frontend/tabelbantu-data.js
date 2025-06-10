/**
 * Persistent save/load functionality for TabelBantu table data using localStorage
 */

const tabelbantuStorageKey = 'tabelbantuData';

// Save tabelbantu data persistently in localStorage
export function saveTabelbantuData() {
  const tableRows = document.querySelectorAll('#helperTable tbody tr');
  const data = [];
  tableRows.forEach(row => {
    const cells = row.querySelectorAll('input');
    if (cells.length >= 11) {
      data.push({
        kategori: cells[0].value.trim(),
        jenis: cells[1].value.trim(),
        stage1: parseInt(cells[2].value) || 0,
        stage2: parseInt(cells[3].value) || 0,
        stage3: parseInt(cells[4].value) || 0,
        stage4: parseInt(cells[5].value) || 0,
        poinStage1: cells[7].value.trim(),
        poinStage2: cells[8].value.trim(),
        poinStage3: cells[9].value.trim(),
        poinStage4: cells[10].value.trim(),
      });
    }
  });
  localStorage.setItem(tabelbantuStorageKey, JSON.stringify(data));
}

// Load tabelbantu data from localStorage and populate the table
export function loadTabelbantuData() {
  const dataStr = localStorage.getItem(tabelbantuStorageKey);
  if (!dataStr) return;
  const data = JSON.parse(dataStr);
  const tbody = document.querySelector('#helperTable tbody');
  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${item.kategori}" /></td>
      <td><input type="text" value="${item.jenis}" /></td>
      <td class="stage-col"><input type="number" value="${item.stage1}" /></td>
      <td class="stage-col"><input type="number" value="${item.stage2}" /></td>
      <td class="stage-col"><input type="number" value="${item.stage3}" /></td>
      <td class="stage-col"><input type="number" value="${item.stage4}" /></td>
      <td class="separator-col"></td>
      <td class="poin-stage-col"><input type="text" value="${item.poinStage1}" /></td>
      <td class="poin-stage-col"><input type="text" value="${item.poinStage2}" /></td>
      <td class="poin-stage-col"><input type="text" value="${item.poinStage3}" /></td>
      <td class="poin-stage-col"><input type="text" value="${item.poinStage4}" /></td>
      <td><button class="btn deleteBtn">Delete</button></td>
    `;
    tbody.appendChild(tr);
    const inputs = tr.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', saveTabelbantuData);
    });
  });
  attachDeleteListeners();
}

// Attach delete button listeners
export function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(function(btn) {
    btn.removeEventListener('click', handleDelete);
    btn.addEventListener('click', handleDelete);
  });
}

// Delete row handler
function handleDelete(event) {
  const row = event.target.closest('tr');
  if (row) {
    row.remove();
    saveTabelbantuData();
  }
}

// Add Row button logic
export function setupAddRowButton() {
  const addRowBtn = document.getElementById('addRowBtn');
  if (!addRowBtn) return;
  addRowBtn.addEventListener('click', function() {
    const tbody = document.querySelector('#helperTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="text" value="" /></td>
      <td><input type="text" value="" /></td>
      <td class="stage-col"><input type="number" value="" /></td>
      <td class="stage-col"><input type="number" value="" /></td>
      <td class="stage-col"><input type="number" value="" /></td>
      <td class="stage-col"><input type="number" value="" /></td>
      <td class="separator-col"></td>
      <td class="poin-stage-col"><input type="text" value="" /></td>
      <td class="poin-stage-col"><input type="text" value="" /></td>
      <td class="poin-stage-col"><input type="text" value="" /></td>
      <td class="poin-stage-col"><input type="text" value="" /></td>
      <td><button class="btn deleteBtn">Delete</button></td>
    `;
    tbody.appendChild(newRow);
    attachDeleteListeners();
    // Re-enable immediate save to save new row
    saveTabelbantuData();
  });
}

window.addEventListener('beforeunload', () => {
  saveTabelbantuData();
});

// Initialize TabelBantu persistent functionality
export function initTabelbantuPersistence() {
  loadTabelbantuData();
  attachDeleteListeners();
  setupAddRowButton();
}
