export const stripTags = inputText =>
  inputText
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\r?\n|\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
