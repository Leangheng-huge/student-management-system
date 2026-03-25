const API = 'http://localhost:8080/api/students';

let editIndex = null;
let subjectFieldCount = 0;
let students = [];

const defaultSubjects = ['Mathematics', 'English', 'Science'];

function init() {
  defaultSubjects.forEach(s => addSubjectField(s));
  loadStudents();
}

// ── API CALLS ────────────────────────────────────────

// GET all students
async function loadStudents() {
  try {
    const res = await fetch(API);
    students = await res.json();
    renderTable();
    updateStats();
  } catch (err) {
    console.error('Failed to load students:', err);
  }
}

// POST - add student
async function addStudent() {
  const name = document.getElementById('studentName').value.trim();
  if (!name) { alert('Please enter a student name.'); return; }

  const subjects = getSubjectsFromList('subjectsList');
  if (subjects.length === 0) { alert('Please add at least one subject.'); return; }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subjects })
    });

    if (!res.ok) throw new Error('Failed to add student');

    document.getElementById('studentName').value = '';
    document.querySelectorAll('#subjectsList .subject-score').forEach(el => el.value = '');

    await loadStudents();
  } catch (err) {
    console.error('Error adding student:', err);
    alert('Failed to add student. Is the backend running?');
  }
}

// PUT - update student
async function saveEdit() {
  const name = document.getElementById('editName').value.trim();
  if (!name) { alert('Name required.'); return; }

  const subjects = getSubjectsFromList('editSubjectsList');
  if (subjects.length === 0) { alert('Add at least one subject.'); return; }

  const student = students[editIndex];

  try {
    const res = await fetch(`${API}/${student.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subjects })
    });

    if (!res.ok) throw new Error('Failed to update student');

    closeModal();
    await loadStudents();
  } catch (err) {
    console.error('Error updating student:', err);
    alert('Failed to update student.');
  }
}

// DELETE - delete student
async function deleteStudent(index) {
  const student = students[index];
  if (!confirm(`Delete ${student.name}?`)) return;

  try {
    const res = await fetch(`${API}/${student.id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Failed to delete student');

    await loadStudents();
  } catch (err) {
    console.error('Error deleting student:', err);
    alert('Failed to delete student.');
  }
}

// ── FORM HELPERS ─────────────────────────────────────

function addSubjectField(name = '') {
  const id = `subj_${subjectFieldCount++}`;
  const newSubjectInput = document.getElementById('newSubjectName');

  if (!name && newSubjectInput.value.trim()) {
    name = newSubjectInput.value.trim();
    newSubjectInput.value = '';
  }

  if (!name) { newSubjectInput.focus(); return; }

  const row = document.createElement('div');
  row.className = 'subject-row';
  row.id = id;
  row.innerHTML = `
    <span class="subject-name">${escHtml(name)}</span>
    <input type="number" class="subject-score" min="0" max="100" placeholder="0–100" data-subject="${escHtml(name)}" />
    <button class="remove-btn" onclick="removeSubject('${id}')" title="Remove">✕</button>
  `;
  document.getElementById('subjectsList').appendChild(row);
}

function removeSubject(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function addEditSubjectField() {
  const inp = document.getElementById('editNewSubjectName');
  const name = inp.value.trim();
  if (!name) { inp.focus(); return; }
  inp.value = '';
  appendEditSubjectRow(name, '');
}

function appendEditSubjectRow(name, score) {
  const id = `editsubj_${subjectFieldCount++}`;
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.id = id;
  row.innerHTML = `
    <span class="subject-name">${escHtml(name)}</span>
    <input type="number" class="subject-score" min="0" max="100" value="${score}" data-subject="${escHtml(name)}" />
    <button class="remove-btn" onclick="removeSubject('${id}')" title="Remove">✕</button>
  `;
  document.getElementById('editSubjectsList').appendChild(row);
}

function getSubjectsFromList(listId) {
  const rows = document.querySelectorAll(`#${listId} .subject-row`);
  const subjects = [];
  rows.forEach(row => {
    const name = row.querySelector('.subject-name').textContent.trim();
    const score = parseFloat(row.querySelector('.subject-score').value) || 0;
    subjects.push({ name, score: Math.min(100, Math.max(0, score)) });
  });
  return subjects;
}

// ── RENDER ───────────────────────────────────────────

function editStudent(index) {
  editIndex = index;
  const s = students[index];
  document.getElementById('editName').value = s.name;
  document.getElementById('editSubjectsList').innerHTML = '';
  s.subjects.forEach(sub => appendEditSubjectRow(sub.name, sub.score));
  document.getElementById('editModal').classList.add('active');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  editIndex = null;
}

function renderTable() {
  const tbody = document.getElementById('studentBody');
  const empty = document.getElementById('emptyState');
  const wrapper = document.getElementById('tableWrapper');

  if (students.length === 0) {
    empty.style.display = 'block';
    wrapper.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  wrapper.style.display = 'block';
  tbody.innerHTML = '';

  students.forEach((s, i) => {
    const total = s.total ?? s.subjects.reduce((acc, sub) => acc + sub.score, 0);
    const avg = s.average ?? (s.subjects.length ? total / s.subjects.length : 0);
    const grade = s.grade ?? getGrade(avg);
    const detailId = `detail_${i}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--muted)">${i + 1}</td>
      <td><span class="student-name">${escHtml(s.name)}</span></td>
      <td>
        ${s.subjects.length} subject${s.subjects.length !== 1 ? 's' : ''}
        <br><button class="expand-btn" onclick="toggleDetail('${detailId}', this)">▶ view scores</button>
      </td>
      <td><strong style="font-size:1.1rem">${total}</strong> <span style="color:var(--muted);font-size:0.75rem">/ ${s.subjects.length * 100}</span></td>
      <td>${typeof avg === 'number' ? avg.toFixed(1) : avg}</td>
      <td><span class="grade-badge grade-${grade}">${grade}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="editStudent(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent(${i})">Del</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    const detailTr = document.createElement('tr');
    detailTr.className = 'subject-detail-row';
    detailTr.id = detailId;
    const tags = s.subjects.map(sub => {
      const color = sub.score >= 90 ? '#4ade80' : sub.score >= 70 ? '#60a5fa' : sub.score >= 60 ? '#fbbf24' : '#f87171';
      return `<span class="subject-tag">${escHtml(sub.name)}: <strong style="color:${color}">${sub.score}</strong></span>`;
    }).join('');
    detailTr.innerHTML = `<td colspan="7" class="subject-detail-cell"><div class="subject-tags">${tags}</div></td>`;
    tbody.appendChild(detailTr);
  });
}

function toggleDetail(id, btn) {
  const row = document.getElementById(id);
  const open = row.classList.toggle('open');
  btn.textContent = open ? '▼ hide scores' : '▶ view scores';
}

function updateStats() {
  document.getElementById('statTotal').textContent = students.length;

  if (students.length === 0) {
    ['statAvg', 'statTop', 'statLow'].forEach(id =>
      document.getElementById(id).textContent = '—'
    );
    return;
  }

  const avgs = students.map(s => s.average ?? 0);
  const classAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length;

  document.getElementById('statAvg').textContent = classAvg.toFixed(1);
  document.getElementById('statTop').textContent = Math.max(...avgs).toFixed(1);
  document.getElementById('statLow').textContent = Math.min(...avgs).toFixed(1);
}

function getGrade(avg) {
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── INIT ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  init();

  document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  document.getElementById('newSubjectName').addEventListener('keydown', e => {
    if (e.key === 'Enter') addSubjectField();
  });
});

window.addSubjectField = addSubjectField;
window.removeSubject = removeSubject;
window.addEditSubjectField = addEditSubjectField;
window.addStudent = addStudent;
window.deleteStudent = deleteStudent;
window.editStudent = editStudent;
window.saveEdit = saveEdit;
window.closeModal = closeModal;
window.toggleDetail = toggleDetail;
