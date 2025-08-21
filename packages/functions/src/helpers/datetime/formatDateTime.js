export default function formatDateTime(dateStr = new Date(), format = 'yyyy-mm-dd') {
  if (!dateStr) {
    return null;
  }
  const date = new Date(dateStr);
  const formatMap = {
    yyyy: date.getFullYear(),
    mm: ('0' + (date.getMonth() + 1)).slice(-2),
    dd: ('0' + date.getDate()).slice(-2)
  };
  return format.replace(/yyyy|mm|dd/g, match => formatMap[match]);
}
