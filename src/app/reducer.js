import * as Actions from './action';

const initialState = {
    isAuthenticated: false,
};

const reducer = (state = initialState, action) => {
    console.log(`actions: ${action.type}`);
    switch (action.type) {
        case Actions.SIGN_IN_SUCCEED:
            return {
                ...state,
                isAuthenticated: true,
            };
        default:
            break;
    }
};

export default reducer;
