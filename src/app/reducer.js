import * as Actions from './action';
import {timeRanges} from './Constants';

const initialState = {
    isAuthenticated: false,
    searchTimeFilter: timeRanges.ANYTIME,
    searchTagFilter: [0],
};

const reducer = (state = initialState, action) => {
    console.log(`actions: ${action.type}`);
    switch (action.type) {
        case Actions.SIGN_IN_SUCCEED:
            return {
                ...state,
                isAuthenticated: true,
            };
        case Actions.UPDATE_SEARCH_FILTER:
            return {
                ...state,
                searchTimeFilter: action.searchTimeFilter,
                searchTagFilter: action.searchTagFilter,
            };
        case Actions.CLEAR_FILTER:
            return {
                ...state,
                searchTimeFilter: timeRanges.ANYTIME,
                searchTagFilter: [0],
            };
        default:
            return initialState;
    }
};

export default reducer;
