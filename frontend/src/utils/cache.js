export const setCacheData = (key, value, expireInMinutes) => {
  const dateNow = new Date();
  const item = {
    value: value,
    expiry: dateNow.getTime() + expireInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCacheData = (key) => {
  const itemString = localStorage.getItem(key);
  if (!itemString) {
    return undefined;
  }
  const item = JSON.parse(itemString);
  const dateNow = new Date();
  if (dateNow.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return undefined;
  }
  return item.value;
};
