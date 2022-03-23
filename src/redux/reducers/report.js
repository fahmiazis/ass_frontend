/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
const reportState = {
    isGet: false,
    isLoading: false,
    isError: false,
    isExp: false,
    alertMsg: '',
    dataRep: [],
    dataMut: [],
    dataExp: []
};

export default (state=reportState, action) => {
    switch(action.type){
        case 'GET_REPORTDIS_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORTDIS_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataRep: action.payload.data.result.rows,
                alertMsg: 'get disposal Succesfully',
            };
        }
        case 'GET_REPORTDIS_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_REPORTMUT_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORTMUT_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataMut: action.payload.data.result.rows,
                alertMsg: 'get disposal Succesfully',
            };
        }
        case 'GET_REPORTMUT_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'EXPORT_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'EXPORT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isExp: true,
                dataExp: action.payload.data.result,
                alertMsg: 'get export Succesfully',
            };
        }
        case 'EXPORT_STOCK_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        default: {
            return state;
        }
    }
}