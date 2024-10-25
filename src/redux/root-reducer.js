import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import tokenListReducer from './token-list-reducer/tokenList.reducer';
import modalListReducer from './modal-list-reducer/modalList.reducer';
import historyListReducer from './txhistory-list-reducer/txHistory.reducer';
import poolListReducer from './pool-list-reducer/poolList.reducer';

// whitelist includes reducer state key that needs to persist
const persistConfig = {
    key: 'tokens',
    storage,
    whitelist: ['token', 'modal', 'history', 'pool'],
};

const rootReducer = combineReducers({
    token: tokenListReducer,
    modal: modalListReducer,
    history: historyListReducer,
    pool: poolListReducer
});

export default persistReducer(persistConfig, rootReducer);
