import { stripTags } from './';

export const isString = value =>
  typeof value === 'string' || value instanceof String;

export const getTextFieldsFromArrayField = fieldData => {
  let textFieldsInArray = isString(fieldData[0]) ? fieldData : [];

  if (!textFieldsInArray.length) {
    fieldData.forEach(
      valueInnerItem =>
        (textFieldsInArray = [
          ...textFieldsInArray,
          ...getAllFieldsValues(valueInnerItem),
        ])
    );
  }

  return textFieldsInArray;
};

export const getAllFieldsValues = componentData => {
  let textFields = [];

  Object.keys(componentData).forEach(key => {
    const value = componentData[key];

    if (isString(value)) {
      textFields = [...textFields, value];
    }

    if (Array.isArray(value)) {
      textFields = [...textFields, ...getTextFieldsFromArrayField(value)];
    }

    if (typeof value === 'object' && value !== null) {
      textFields = [...textFields, ...getAllFieldsValues(value)];
    }
  });

  return textFields.map(value => stripTags(value));
};
