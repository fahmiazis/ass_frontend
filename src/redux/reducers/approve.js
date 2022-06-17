/* eslint-disable import/no-anonymous-default-export */
const approveState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataApprove: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detailApp: [],
    link: ''
};

export default (state=approveState, action) => {
        switch(action.type){
            case 'GET_APPROVE_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_APPROVE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataApprove: action.payload.data.result.rows,
                    alertMsg: 'get approve Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_APPROVE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    detailApp: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_DETAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_NAME_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NAME_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataName: action.payload.data.result.rows,
                    alertMsg: 'get approve Succesfully',
                };
            }
            case 'GET_NAME_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CREATE_APPROVE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_APPROVE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isAddDetail: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_APPROVE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAddDetail: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CREATE_NAME_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_NAME_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isAdd: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_NAME_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_APPROVE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_APPROVE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDelete: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'DELETE_APPROVE_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_APPROVE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_APPROVE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isUpdate: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'UPDATE_APPROVE_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_APPROVE': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: false,
                    isExport: false,
                    isLoading: false
                }
            }
            default: {
                return state;
            }
        }
    }