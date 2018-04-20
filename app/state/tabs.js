import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  activeItem: "code",
});

// payload should be a string indication the tab
export const onActiveTabChange = payload => {
  return {
    type: "CHANGE_TAB",
    payload,
  };
};

export const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case "CHANGE_TAB": {
      return previousState.set("activeItem", action.payload);
    }
    case "RUNTIME_RUN": {
      return previousState.set("activeItem", "runtime");
    }
    default: {
      return previousState;
    }
  }
};
