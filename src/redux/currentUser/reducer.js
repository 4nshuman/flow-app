import * as actions from './actionTypes';

const initialState = {
    currentUser: {}
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case actions.USER_LOGGED_IN:
            return {
                ...state,
                user: {
                    userEmail: action.payload.email,
                    userName: action.payload.name
                }
            };
        case actions.ITEM_ADDED:
            return [
                ...state,
                {
                    itemId: action.payload.itemId
                }
            ];
        default:
            return state;
    }
}