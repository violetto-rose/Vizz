export function createSemesterSelector(semesters, onSelect) {
  const container = document.createElement('div');
  container.className = 'mb-6 p-4 bg-white rounded-lg shadow-sm border';

  const title = document.createElement('h1');
  title.className = 'text-xl font-semibold mb-4 text-gray-800';
  title.textContent = 'Student Progress Visualizer';

  const selectContainer = document.createElement('div');
  selectContainer.className = 'flex items-center gap-3';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-gray-700';
  label.textContent = 'Select Semester:';

  const select = document.createElement('select');
  select.className = 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choose a semester...';
  select.appendChild(defaultOption);

  // Add semester options
  semesters.forEach(semester => {
    const option = document.createElement('option');
    option.value = semester;
    option.textContent = semester;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    if (e.target.value) {
      onSelect(e.target.value);
    }
  });

  selectContainer.appendChild(label);
  selectContainer.appendChild(select);

  container.appendChild(title);
  container.appendChild(selectContainer);

  return container;
}
