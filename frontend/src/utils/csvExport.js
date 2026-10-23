export const exportToCSV = (data, filename, headers) => {
  if (!data || !data.length) return;
  const cols = headers || Object.keys(data[0]).map(k => ({ key: k, label: k }));
  const csv = [
    cols.map(c => `"${c.label}"`).join(','),
    ...data.map(row => cols.map(c => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};
