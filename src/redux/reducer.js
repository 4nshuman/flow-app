import * as actions from './actionTypes';

const initialState = {
    currentUser: null,
    workFlows: [],
    openWorkFlow: {},
}

export default function reducer(state = initialState, action){
    const openWorkFlow = {...state.openWorkFlow};
    const workFlows = [...state.workFlows];
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
        case actions.WORK_FLOWS_LOADED:
            return {
                ...state,
                workFlows: action.payload.workFlowsList
            };
        case actions.WORK_FLOW_ADDED:
            workFlows.push(action.payload.workFlow)
            return {
                ...state,
                workFlows
            };
        case actions.WORK_FLOW_EDITED:
            const item = action.payload.workFlow
            const editedWorkflowList = workFlows.map((workFlow) => {
                if(item.id === workFlow.id){
                    return item;
                }
                else{
                    return workFlow;
                }
              });
            return {
                ...state,
                workFlows: editedWorkflowList
            };
        case actions.WORK_FLOW_DELETED:
            const deletedWorkFlowList = workFlows.filter((workFlow) => (
                workFlow.id !== action.payload.workFlowId
            ));
            return {
                ...state,
                workFlows: deletedWorkFlowList
            };
        case actions.WORK_FLOW_OPENED:
            return {
                ...state,
                openWorkFlow: action.payload.openedWorkFlow
            };
        case actions.NODE_ADDED:
            openWorkFlow.nodes.push(action.payload.node);
            openWorkFlow.isComplete = false;
            return {
                ...state,
                openWorkFlow
            };
        case actions.NODE_DELETED:
            const updatedNodeList = openWorkFlow.nodes.filter((node) => (
                node.nodeId !== action.payload.nodeId
            ));
            openWorkFlow.nodes = updatedNodeList;
            return {
                ...state,
                openWorkFlow
            };
        default:
            return state;
    }
}