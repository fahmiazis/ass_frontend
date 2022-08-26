/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
const notifState = {
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    data: [],
    delete: false,
    delall: false,
    update: false,
    upall: false,
    notifDis: null,
    notifStock: null,
    notifMut: null
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
                isLoading: false,
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
        case 'DEL_NOTIF_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DEL_NOTIF_FULFILLED': {
            return {
                ...state,
                delete: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'DEL_NOTIF_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DELALL_NOTIF_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DELALL_NOTIF_FULFILLED': {
            return {
                ...state,
                delall: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'DELALL_NOTIF_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UP_NOTIF_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UP_NOTIF_FULFILLED': {
            return {
                ...state,
                update: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'UP_NOTIF_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'NOTIF_DIS_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'NOTIF_DIS_FULFILLED': {
            return {
                ...state,
                notifDis: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'NOTIF_DIS_REJECTED': {
            return {
                ...state,
                isLoading: false,
                notifDis: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'NOTIF_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'NOTIF_STOCK_FULFILLED': {
            return {
                ...state,
                notifStock: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'NOTIF_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                notifStock: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'NOTIF_MUT_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'NOTIF_MUT_FULFILLED': {
            return {
                ...state,
                notifMut: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'NOTIF_MUT_REJECTED': {
            return {
                ...state,
                isLoading: false,
                notifMut: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPALL_NOTIF_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPALL_NOTIF_FULFILLED': {
            return {
                ...state,
                upall: true,
                isLoading: false,
                alertMsg: 'delete notif Succesfully'
            };
        }
        case 'UPALL_NOTIF_REJECTED': {
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
