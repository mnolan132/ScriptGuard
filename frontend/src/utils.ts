//This functions validates that the input data in the email field is an email address
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//This function ensures the first letters are capatalised
const capataliseFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export { validateEmail, capataliseFirstLetter };
