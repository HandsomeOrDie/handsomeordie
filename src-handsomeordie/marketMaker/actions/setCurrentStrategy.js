import * as ActionTypes from "../constants/ActionTypes";

const setCurrentStrategy = (currentStrategy) => {
    // console.log(currentStrategy);
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_CURRENT_STRATEGY, currentStrategy: currentStrategy,isFixed: (currentStrategy && currentStrategy.quoteSpreadFixed && currentStrategy.quoteSpreadFixed!==undefined)?currentStrategy.quoteSpreadFixed:true});
            
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    setCurrentStrategy
};
