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

export const workFlowsLoaded = workFlowsList => {
    return ({
    type: actions.WORK_FLOWS_LOADED,
    payload: {
        workFlowsList
    }});
}

export const workFlowAdded = workFlow => {
    return ({
    type: actions.WORK_FLOW_ADDED,
    payload: {
        workFlow
    }});
}

export const workFlowEdited = workFlow => {
    return ({
    type: actions.WORK_FLOW_EDITED,
    payload: {
        workFlow
    }});
}

export const workFlowDeleted = workFlowId => {
    return ({
    type: actions.WORK_FLOW_DELETED,
    payload: {
        workFlowId
    }});
}

export const workFlowOpened = workFlow => {
    return ({
    type: actions.WORK_FLOW_OPENED,
    payload: {
        openedWorkFlow: workFlow
    }});
}

export const nodeAdded = node => {
    return ({
    type: actions.NODE_ADDED,
    payload: {
        node
    }});
}

export const nodeDeleted = nodeId => {
    return ({
    type: actions.NODE_DELETED,
    payload: {
        nodeId
    }});
}
