/* eslint-disable import/no-anonymous-default-export */
const notifState = {
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDis: [],
    noDis: [],
}

export default (state=notifState, action) => {
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
        default: {
            return state;
        }
    }
}