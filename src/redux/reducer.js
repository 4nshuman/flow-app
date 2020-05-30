import * as actions from './actionTypes';

const initialState = {
    currentUser: null,
    workFlows: null
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case actions.USER_LOGGED_IN:
            return {
                ...state,
                currentUser: {
                    userEmail: action.payload.email,
                    userName: action.payload.name,
                    uID: action.payload.uID
                }
            };
        case actions.USER_LOGGED_OUT:
            return {
                ...state,
                currentUser: null
            };
        case actions.WORK_FLOWS_ADDED:
            return {
                ...state,
                workFlows: action.payload.workFlows
            };
        default:
            return state;
    }
}