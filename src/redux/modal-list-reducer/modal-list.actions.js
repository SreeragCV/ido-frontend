import ModalListActionTypes from './modal-list.types';

export const updateModalSearchToken = (name) => ({
    type: ModalListActionTypes.UPDATE_MODAL_SEARCH_TOKEN,
    payload: name,
});

export const updateModalTokenList = (tokens) => ({
    type: ModalListActionTypes.UPDATE_MODAL_lIST,
    payload: tokens,
});