import reducer from "./reducerIndex";
import {applyMiddleware, createStore, compose} from "redux";
// import {createLogger} from "redux-logger";
import thunk from "redux-thunk";

// const logger = createLogger({
//     collapsed: true,
// });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer,
    // composeEnhancers(applyMiddleware(thunk, logger)),
    composeEnhancers(applyMiddleware(thunk)),
);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducerIndex", () => {
        const nextRootReducer = require("./reducerIndex");
        store.replaceReducer(nextRootReducer);
    });
}

export default store;