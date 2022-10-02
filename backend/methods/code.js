exports.getAuthCode = () => {
  const arr = [];

  while (arr.length < 6) {
    const element = Math.floor(Math.random() * 123);
    if (element > 47 && element < 58) arr.push(element);
    else if (element > 64 && element < 91) arr.push(element);
  }

  return String.fromCharCode(...arr);
};
