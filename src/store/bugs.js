import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import * as actions from './api';
import moment from 'moment';

let lastId = 0;

const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {
        bugsRequested: (bugs, action) => {
            bugs.loading = true;
        }
        ,
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload;
            bugs.loading = false;
            bugs.lastFetch = Date.now();
        }
        ,
        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false;
        }
        ,
        bugAssignedToUser: (bugs, action) => {
            const { id: bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            bugs.list[index].userId = userId;
        }
        ,
        bugAdded: (bugs, action) => {
            bugs.list.push(   //way1-add bug in the client
                {
                    id: ++lastId,
                    description: action.payload.description,
                    resolved: false
                }
            );
            // bugs.list.push(action.payload);   //way2-add bug from server(api)
        }
        ,
        //resolveBug>command - bugResolved>event
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
            bugs.list[index].resolved = true;
        }
        ,
        bugRemoved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
            bugs.list.splice(index, 1);
        }
    }
});

//in real application these events shouldn't export,because these just modify store (not server)
// so in UI layer(index.js) just access to commands or selectors like getUnresolvedBugs,loadBug ,addBug,assignBugToUser ...
export const {
    bugAdded,
    bugRemoved,
    bugResolved,
    bugAssignedToUser,
    bugsReceived,
    bugsRequested
    , bugsRequestFailed
} = slice.actions;

export default slice.reducer;


//Action creators

const url = "/bugs";
// export const loadBugs = () => actions.apiCallBegan({
//     url,
//     onStart: bugsRequested.type,
//     onSuccess: bugsReceived.type,
//     onError: bugsRequestFailed.type
// });

// ()=> fn(dispatch,getState)
export const loadBugs = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 10) return;    //need to refactor to seperate file and config file for 10 number

    dispatch(
        actions.apiCallBegan({
            url,
            onStart: bugsRequested.type,
            onSuccess: bugsReceived.type,
            onError: bugsRequestFailed.type
        })
    );
};

// export const addBug = bug => actions.apiCallBegan({
//     url,
//     method: "post",
//     data: bug,
//     onSuccess: bugAdded.type
// });

export const resolveBug = id => actions.apiCallBegan({
    url: url + '/' + id,
    method: 'patch',
    data: { resolved: true },
    onSuccess: bugResolved.type
});

export const assignBugToUser = (bugId, userId) => actions.apiCallBegan({
    url: url + '/' + bugId,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type
});

//Selector
// Memoization
// bugs=>get unresolved bugs from the cashe
export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => !bug.resolved)
);

export const getBugsbyUser = userId => createSelector(        //currying
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
);
