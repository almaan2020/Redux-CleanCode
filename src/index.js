import configureStore from './store/configureStore';
import { bugAdded, bugResolved, bugRemoved, bugAssignedToUser, getUnresolvedBugs, getBugsbyUser } from './store/bugs';
import { projectAdded } from './store/projects';
import { userAdded } from './store/users';

const store = configureStore();

store.subscribe(() => {
    console.log("Store Changed!", store.getState());
});

// store.dispatch(actions.bugAdded("Bug1"));
// store.dispatch(actions.bugResolved(1));
// store.dispatch(actions.bugRemoved(1));

store.dispatch(userAdded({ name: "User1" }));
store.dispatch(userAdded({ name: "User2" }));

store.dispatch(bugAdded({ description: "Bug1" }));
store.dispatch(bugAdded({ description: "Bug2" }));
store.dispatch(bugResolved({ id: 1 }));
store.dispatch(bugRemoved({ id: 1 }));
store.dispatch(bugAssignedToUser({ bugId: 2, userId: 1 }));

store.dispatch(projectAdded({ name: "project 1" }));

const unresolvedBugs = getUnresolvedBugs(store.getState());
const userBugs = getBugsbyUser(1)(store.getState());   //currying
console.log(unresolvedBugs, userBugs);


store.dispatch((dispatch, getState) => {         //dispatching function
    //call an API
    //when the promise is resolved => dispatch()
    dispatch({ type: "bugReceived", bugs: [1, 2, 3] });
    console.log(getState());
    //when the promise is rejected => dispatch()
}
);

store.dispatch({ type: 'error', payload: { message: "An error occurred" } });


