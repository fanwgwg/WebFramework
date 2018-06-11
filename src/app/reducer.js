import * as Actions from './action';
import {timeRanges} from './Constants';

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    searchTimeFilter: timeRanges.ANYTIME,
    searchTagFilter: [0],
    inSearch: false,
    inDetail: false,
};

const reducer = (state = initialState, action) => {
    console.log(`actions: ${action.type}`);
    switch (action.type) {
        case Actions.UPDATE_ROUTE:
            return state;
        case Actions.SIGN_IN_SUCCEED:
            return {
                ...state,
                isAuthenticated: true,
                currentUser: action.data.user,
                token: action.data.token,
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
        case Actions.SET_SEARCH:
            return {
                ...state,
                inSearch: action.data,
            };
        case Actions.SET_DETAIL:
            return {
                ...state,
                inDetail: action.data,
            };
        case Actions.SELECT_EVENT:
            return state;
        default:
            return initialState;
    }
};

export default reducer;
