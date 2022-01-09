const logger = param => store => next => action => {
    console.log("logging:", param);
    // console.log("store:", store);
    // console.log("next:", next);
    // console.log("action:", action);
    next(action);
};

export default logger;