import * as actions from './actionTypes';

export const userLoggedIn = user => ({
    type: actions.USER_LOGGED_IN,
    payload: {
        email: user.email,
        name: user.displayName,
        uID: user.uid
    }
});

export const userLoggedOut = () => ({
    type: actions.USER_LOGGED_OUT
});

export const workFlowsAdded = workFlows => {
    return ({
    type: actions.WORK_FLOWS_ADDED,
    payload: {
        workFlows: workFlows 
    }});
}