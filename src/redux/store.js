import {createStore} from 'redux';
import currentUser from './currentUser/reducer';

const store = createStore(currentUser);

export default store;