// import { createStore } from 'redux';
// import { devToolsEnhancer } from 'redux-devtools-extension';
// import reducer from './bugs';

// export default function configureStore() {
//     const store = createStore(reducer, devToolsEnhancer({ trace: true }));
//     return store;
// };


//refacrot by redux toolkit:
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducer';
import logger from './middleware/logger';
import toast from './middleware/toast';
import api from './middleware/api';
// import func from './middleware/func';

export default function () {
    return configureStore({
        reducer,
        // middleware: [
        //     logger({ destination: "console" }),
        //     func
        // ]
        middleware: [...getDefaultMiddleware(), logger({ destination: "console" }), toast, api]
    });
};
