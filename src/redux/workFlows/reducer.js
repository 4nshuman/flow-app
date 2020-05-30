import * as actions from './actionTypes';

const initialState = {
    users: {},
    currentUser: {},
    workflows: {}
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case actions.USER_LOGGED_IN:
            return {
                ...state,
                user: {
                    userEmail: action.payload.email
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