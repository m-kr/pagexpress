import { getAllFieldsValues } from '@/utils';

const componentData = {
  images: {
    src: '/public/background.jpg',
  },
  title: 'Welcome to my page',
  html: '<p>Html content with <a href="#">link</a></p>',
  extends: ['default', 'plain'],
  fieldset: [
    {
      title: 'Item First',
      link: {
        url: '/about-us',
        label: 'About us',
      },
    },
    {
      title: 'Item Second',
      link: {
        url: '/contact',
        label: 'Contact',
      },
    },
  ],
};

describe('getAllFieldsValues', () => {
  test('should contain direct text fields values', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining([componentData.title])
    );
  });

  test('should strip html tags from returned values', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining(['Html content with link'])
    );
  });

  test('should contain fields values from arrays', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining(componentData.extends)
    );
  });

  test('should contain fields values from objects in arrays', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining([
        componentData.fieldset[0].title,
        componentData.fieldset[1].title,
      ])
    );
  });

  test('should contain fields values direct objects', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining([componentData.images.src])
    );
  });

  test('should contain fields values from nested objects', () => {
    expect(getAllFieldsValues(componentData)).toEqual(
      expect.arrayContaining([
        componentData.fieldset[0].link.url,
        componentData.fieldset[0].link.label,
        componentData.fieldset[1].link.url,
        componentData.fieldset[1].link.label,
      ])
    );
  });
});
