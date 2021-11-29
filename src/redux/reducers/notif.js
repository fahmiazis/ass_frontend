/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
const notifState = {
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    data: []
}

export default (state=notifState, action) => {
    switch(action.type){
        case 'GET_NOTIF_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_NOTIF_FULFILLED': {
            return {
                ...state,
                isGet: true,
                data: action.payload.data.result,
                alertMsg: 'get notif Succesfully'
            };
        }
        case 'GET_NOTIF_REJECTED': {
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
