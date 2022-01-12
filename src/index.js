import configureStore from './store/configureStore';
import { bugAdded, bugResolved, bugRemoved, bugAssignedToUser, getUnresolvedBugs, getBugsbyUser, addBug, loadBugs, resolveBug, assignBugToUser } from './store/bugs';
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
store.dispatch(bugAssignedToUser({ id: 2, userId: 1 }));

store.dispatch(projectAdded({ name: "project 1" }));

const unresolvedBugs = getUnresolvedBugs(store.getState());
const userBugs = getBugsbyUser(1)(store.getState());   //currying
console.log(unresolvedBugs, userBugs);


store.dispatch((dispatch, getState) => {         //dispatching function
    //call an API
    //when the promise is resolved => dispatch()
    dispatch({ type: "bugReceivedSample", bugs: [1, 2, 3] });
    console.log(getState());
    //when the promise is rejected => dispatch()
}
);

store.dispatch({ type: 'error', payload: { message: "An error occurred" } });


/**** API ****/
/* get */
// store.dispatch(
//     actions.apiCallBegan({
//         url: '/bugs',
//         onSuccess: 'bugs/bugsRecieved'
//     })
// );
store.dispatch(loadBugs());
// setTimeout(() => store.dispatch(loadBugs()), 2000);

/*post*/
// store.dispatch(addBug({ description: "a" }));        //add bug from server(api)

/*put*/
// setTimeout(() => store.dispatch(resolveBug(1)), 2000);
setTimeout(() => store.dispatch(assignBugToUser(4, 2)), 2000);
