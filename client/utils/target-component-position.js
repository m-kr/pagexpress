import { currentComponentPosition } from './';

export const targetComponentPosition = ({
  components,
  previousComponentId,
  nextComponentId,
  actionType = 'add',
}) => {
  let targetPosition = 0;

  if (previousComponentId) {
    targetPosition =
      currentComponentPosition(components, previousComponentId) + 1;
  } else if (nextComponentId) {
    targetPosition = currentComponentPosition(components, nextComponentId);
  } else {
    targetPosition =
      actionType === 'copy' ? components.length : components.length - 1;
  }

  return targetPosition;
};
