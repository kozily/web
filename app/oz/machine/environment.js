var environmentIndex = 0;

export const resetEnvironmentIndex = () => {
  environmentIndex = 0;
};

export const makeNewEnvironmentIndex = () => {
  return ++environmentIndex;
};

export const getLastEnvironmentIndex = () => {
  return environmentIndex;
};
