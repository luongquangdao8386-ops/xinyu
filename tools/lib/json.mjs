// Ghi JSON dễ đọc và dễ so sánh thay đổi: mỗi phần tử của mảng đối tượng nằm trên một dòng.
export function vietJson(v, lui = '') {
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (v.every((x) => x === null || typeof x !== 'object')) return JSON.stringify(v);
    return `[\n${v.map((x) => `${lui}  ${JSON.stringify(x)}`).join(',\n')}\n${lui}]`;
  }
  if (v && typeof v === 'object') {
    return `{\n${Object.entries(v).map(([k, x]) => `${lui}  ${JSON.stringify(k)}: ${vietJson(x, lui + '  ')}`).join(',\n')}\n${lui}}`;
  }
  return JSON.stringify(v);
}
