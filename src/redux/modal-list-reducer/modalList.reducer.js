import ModalListActionTypes from "./modal-list.types";

const INITIAL_STATE = {
  modalList: [],
  modalSearchToken: "",
};

const modalListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ModalListActionTypes.UPDATE_MODAL_SEARCH_TOKEN:
      return {
        ...state,
        modalSearchToken: action.payload,
      };

    case ModalListActionTypes.UPDATE_MODAL_lIST:
      console.log("modalListReducer", action.payload);
      return {
        ...state,
        modalList: [...action.payload],
      };
    default:
      return state;
  }
};

export default modalListReducer;
