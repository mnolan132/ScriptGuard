const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const capataliseFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export { validateEmail, capataliseFirstLetter };
