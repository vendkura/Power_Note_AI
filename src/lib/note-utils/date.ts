export const getTodayDate = () => {
  const today = new Date();
  return getDbDate(today);
};

export const getDbDate = (date: Date) => {
  const copyDate = new Date(date);
  copyDate.setHours(0, 1, 0, 0);
  return copyDate;
};
