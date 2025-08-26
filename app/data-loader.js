export async function loadSemesterData(semester) {
  const path = `./public/${semester}.xlsx`;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: true
    });

    return {
      semester,
      rows,
      columns: rows.length > 0 ? Object.keys(rows[0]) : []
    };

  } catch (error) {
    console.error(`Error loading ${semester}:`, error);
    throw error;
  }
}
