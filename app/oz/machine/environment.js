var environmentIndex = 0;

export const resetEnvironmentIndex = () => {
  environmentIndex = 0;
};

export const makeEnvironmentIndex = () => {
  return ++environmentIndex;
};

export const getLastEnvironmentIndex = () => {
  return environmentIndex;
};
