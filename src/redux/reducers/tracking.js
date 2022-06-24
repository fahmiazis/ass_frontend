/* eslint-disable import/no-anonymous-default-export */
const trackingState = {
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDis: [],
    noDis: [],
    dataMut: [],
    noMut: [],
    isGetStock: false,
    dataStock: []
}

export default (state=trackingState, action) => {
    switch(action.type){
        case 'GET_TRACK_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_TRACK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataDis: action.payload.data.result.rows,
                noDis: action.payload.data.noDis,
                alertMsg: 'get data tracking Succesfully'
            };
        }
        case 'GET_TRACK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isGet: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'TRACK_MUT_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'TRACK_MUT_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGetMut: true,
                dataMut: action.payload.data.result.rows,
                noMut: action.payload.data.noMut,
                alertMsg: 'get data tracking Succesfully'
            };
        }
        case 'TRACK_MUT_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'TRACK_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'TRACK_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGetStock: true,
                dataStock: action.payload.data.result.rows,
                alertMsg: 'get data tracking Succesfully'
            };
        }
        case 'TRACK_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        default: {
            return state;
        }
    }
}