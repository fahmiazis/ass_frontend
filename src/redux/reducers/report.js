/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
const reportState = {
    isGet: false,
    isLoading: false,
    isError: false,
    isExp: false,
    reportIo: false,
    alertMsg: '',
    dataIo: [],
    dataRep: [],
    dataMut: [],
    dataExp: []
};

export default (state=reportState, action) => {
    switch(action.type){
        case 'GET_REPORT_DISPOSAL_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORT_DISPOSAL_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataRep: action.payload.data.result.rows,
                alertMsg: 'get disposal Succesfully',
            };
        }
        case 'GET_REPORT_DISPOSAL_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_REPORT_MUTASI_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORT_MUTASI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataMut: action.payload.data.result.rows,
                alertMsg: 'get disposal Succesfully',
            };
        }
        case 'GET_REPORT_MUTASI_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_REPORT_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                reportIo: false,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORT_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                reportIo: true,
                dataIo: action.payload.data.result,
                alertMsg: 'get report Succesfully',
            };
        }
        case 'GET_REPORT_IO_REJECTED': {
            return {
                ...state,
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