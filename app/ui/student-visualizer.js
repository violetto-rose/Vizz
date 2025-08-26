export function createStudentVisualizer(students, semester) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  // Student selector
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'p-4 bg-white rounded-lg shadow-sm border';

  const selectorTitle = document.createElement('h2');
  selectorTitle.className = 'text-lg font-semibold mb-3 text-gray-800';
  selectorTitle.textContent = `Students in ${semester}`;

  const selectContainer = document.createElement('div');
  selectContainer.className = 'flex items-center gap-3';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-gray-700';
  label.textContent = 'Select Student:';

  const select = document.createElement('select');
  select.className = 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choose a student...';
  select.appendChild(defaultOption);

  // Add student options
  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = `${student.name} (${student.id})`;
    select.appendChild(option);
  });

  selectContainer.appendChild(label);
  selectContainer.appendChild(select);

  selectorContainer.appendChild(selectorTitle);
  selectorContainer.appendChild(selectContainer);

  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'p-4 bg-white rounded-lg shadow-sm border';
  chartContainer.style.display = 'none';

  const chartTitle = document.createElement('h3');
  chartTitle.className = 'text-lg font-semibold mb-4 text-gray-800';
  chartTitle.textContent = 'Student Progress';

  const canvas = document.createElement('canvas');
  canvas.id = 'studentChart';
  canvas.height = 300;

  chartContainer.appendChild(chartTitle);
  chartContainer.appendChild(canvas);

  let currentChart = null;

  select.addEventListener('change', (e) => {
    const selectedStudentId = e.target.value;

    if (!selectedStudentId) {
      chartContainer.style.display = 'none';
      return;
    }

    const selectedStudent = students.find(s => s.id === selectedStudentId);
    if (!selectedStudent) return;

    chartContainer.style.display = 'block';

    // Destroy previous chart if exists
    if (currentChart) {
      currentChart.destroy();
    }

    // Create new chart
    const chartData = prepareChartData(selectedStudent);

    currentChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: `${selectedStudent.name} - ${semester}`,
          data: chartData.values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Score/Grade'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Subjects/Courses'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  });

  container.appendChild(selectorContainer);
  container.appendChild(chartContainer);

  return container;
}

function prepareChartData(student) {
  const data = student.data;
  const columns = Object.keys(data);

  // Filter out non-numeric columns and student identification columns
  const numericColumns = columns.filter(col => {
    const value = data[col];
    const isNumeric = typeof value === 'number' ||
                     (typeof value === 'string' && !isNaN(parseFloat(value)) && value.trim() !== '');

    const isIdColumn = col.toLowerCase().includes('id') ||
                      col.toLowerCase().includes('name') ||
                      col.toLowerCase().includes('roll') ||
                      col.toLowerCase().includes('student');

    return isNumeric && !isIdColumn;
  });

  const labels = numericColumns;
  const values = numericColumns.map(col => {
    const value = data[col];
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  });

  return { labels, values };
}
