/* eslint-disable import/no-anonymous-default-export */
const tempmailState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataEmail: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detEmail: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    draftEmail: {},
    isDraft: null,
    isSend: null,
    draftAjuan: null,
    isResmail: null,
    dataResmail: {}
};

export default (state=tempmailState, action) => {
        switch(action.type){
            case 'GET_ALL_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'GET_ALL_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data email"
                };
            }
            case 'GET_RESMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_RESMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isResmail: true,
                    dataResmail: action.payload.data.result,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'GET_RESMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isResmail: false,
                    alertMsg: "Failed get data email"
                };
            }
            case 'GET_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataEmail: action.payload.data.result.rows,
                    page: action.payload.data.pageInfo,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'GET_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DRAFT_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DRAFT_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    draftEmail: action.payload.data,
                    isDraft: true,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'DRAFT_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDraft: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'AJUAN_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'AJUAN_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    draftEmail: action.payload.data,
                    draftAjuan: true,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'AJUAN_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    draftAjuan: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SEND_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SEND_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: true,
                    alertMsg: 'send email Succesfully'
                };
            }
            case 'SEND_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detEmail: action.payload.data.result,
                    alertMsg: 'get detail email Succesfully',
                };
            }
            case 'DETAIL_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataEmail: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_TEMPMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_TEMPMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_TEMPMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'RESET_TEMPMAIL': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: false,
                    isExport: false,
                    isLoading: false,
                    isUpload: false,
                    isDraft: null,
                    isSend: null,
                    draftAjuan: null,
                    isResmail: null,
                }
            }
            default: {
                return state;
            }
        }
    }