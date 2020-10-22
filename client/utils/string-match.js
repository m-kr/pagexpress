export const stringMatch = (keyword, checkingString) => {
  if (!keyword) return true;

  const keywordWithoutSpaces = keyword.replace(/\s/g, '');
  const regex = new RegExp(keywordWithoutSpaces, 'i');
  const cleanStringToTest = checkingString.replace(/\s/g, '');

  return regex.test(cleanStringToTest);
};
