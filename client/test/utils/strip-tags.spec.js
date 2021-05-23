import { stripTags } from '@/utils';

describe('stripTags', () => {
  test('should return string without HTML tags', () => {
    const inputText = `
      <div class="container">
        <h2>Header of the section</h2>
        <p>paragraph</p>
      </div>
    `;
    const expectedOutput = 'Header of the section paragraph';

    expect(stripTags(inputText)).toEqual(expectedOutput);
  });
});
