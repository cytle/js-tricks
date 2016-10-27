
const getLocalISODateTime = date => {
  if (date instanceof Date) {
    const m = date.getMinutes() - date.getTimezoneOffset();
    date = new Date(date);

    date.setMinutes(m);
    return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '');
  }

  return null;
};

export const formatTime = (timestamp) =>
  (timestamp ? getLocalISODateTime(new Date(timestamp)) : '');

