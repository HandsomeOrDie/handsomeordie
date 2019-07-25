import * as ActionTypes from "../constants/ActionTypes";
import {FetchFindPending,FetchFindQuoteSource, quoteRfq} from "../../common/marketApi/index";
const findPending = () => {
    return async dispatch => {
        try {
            const data  =await FetchFindPending();
            console.log(data);
            dispatch({ type: ActionTypes.FIND_PENDING, payload:data.data  });
        } catch (e) {
            console.log(e);
        }
    };
};
const findQuoteSource = (param) => {
    return async dispatch => {
        try {
            const data  =await FetchFindQuoteSource(param);
            console.log(data);
            dispatch({ type: ActionTypes.QUOTE_SOURCE, payload:data.data  });
        } catch (e) {
            console.log(e);
        }
    };
};
const selectQuotesID = (param) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.QUOTE_ID, payload:param  });
        } catch (e) {
            console.log(e);
        }
    };
};
const saveQuoteOutputMessage = (param) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.QUOTE_MESSAGE, payload:param  });
        } catch (e) {
            console.log(e);
        }
    };
};
const send_quoteRfq = (param, cb) => {
    return async dispatch => {
        try {
            const data  =await quoteRfq(param);
            if(data.success){
                cb(data.data);
            }
            dispatch({ type: ActionTypes.QUOTE_RFQ, payload:data  });
        } catch (e) {
            console.log(e);
        }
    };
};

export {  findPending ,findQuoteSource,selectQuotesID,saveQuoteOutputMessage, send_quoteRfq};


