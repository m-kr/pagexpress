export const getSlug = stringToSlugify =>
  stringToSlugify.replace(/\s\s+/g, ' ').replace(/\s/, '-').toLowerCase();
