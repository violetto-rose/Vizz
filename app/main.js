import { loadSemesterData } from './data-loader.js';
import { createSemesterSelector } from './ui/semester-selector.js';
import { createStudentVisualizer } from './ui/student-visualizer.js';

const state = {
  currentSemester: null,
  semesterData: {},
  students: [],
  currentStudent: null
};

async function init() {
  const appEl = document.getElementById('app');

  // Create semester selector
  const selector = createSemesterSelector(['5thSem', '7thSem'], async (semester) => {
    if (!state.semesterData[semester]) {
      try {
        state.semesterData[semester] = await loadSemesterData(semester);
        state.students = extractStudents(state.semesterData[semester]);
      } catch (error) {
        console.error('Failed to load semester data:', error);
        return;
      }
    }

    state.currentSemester = semester;
    renderVisualizer();
  });

  appEl.appendChild(selector);

  // Create visualizer container
  const visualizerContainer = document.createElement('div');
  visualizerContainer.id = 'visualizer';
  appEl.appendChild(visualizerContainer);

  function renderVisualizer() {
    if (state.currentSemester && state.students.length > 0) {
      const visualizer = createStudentVisualizer(state.students, state.currentSemester);
      visualizerContainer.innerHTML = '';
      visualizerContainer.appendChild(visualizer);
    }
  }
}

function extractStudents(data) {
  if (!data || !data.rows || data.rows.length === 0) return [];

  // Try to find student ID and name columns
  const firstRow = data.rows[0];
  const columns = Object.keys(firstRow);

  let idCol = columns.find(col =>
    col.toLowerCase().includes('id') ||
    col.toLowerCase().includes('roll') ||
    col.toLowerCase().includes('student')
  );

  let nameCol = columns.find(col =>
    col.toLowerCase().includes('name') ||
    col.toLowerCase().includes('student')
  );

  // Fallback to first two columns if not found
  if (!idCol && columns.length > 0) idCol = columns[0];
  if (!nameCol && columns.length > 1) nameCol = columns[1];

  return data.rows.map(row => ({
    id: String(row[idCol] || ''),
    name: String(row[nameCol] || row[idCol] || ''),
    data: row
  })).filter(student => student.id && student.id.trim() !== '');
}

init();


