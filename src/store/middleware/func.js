const func = ({ dispatch, getState }) => next => action => {
    if (typeof action === "function")
        action(dispatch, getState);         //if action's type = function , we can call it
    else
        next(action);
}

export default func;
