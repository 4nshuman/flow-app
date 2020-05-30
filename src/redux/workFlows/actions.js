import * as actions from './actionTypes';

export const userLoggedIn = user => ({
    type: actions.USER_LOGGED_IN,
    payload: {
        email: user.email,
        isSignedIn: true
    }
});