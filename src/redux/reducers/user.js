/* eslint-disable import/no-anonymous-default-export */
const userState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isGetRole: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataUser: [],
    dataRole: [],
    detailUser: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isChange: false,
    isReset: false,
    addRole: null,
    updateRole: null,
    isDetailRole: null,
    detailRole: {},
};

export default (state=userState, action) => {
        switch(action.type){
            case 'EXPORT_MASTER_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_USER_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataUser: action.payload.data.result.rows,
                    alertMsg: 'get user Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGetRole: true,
                    dataRole: action.payload.data.result,
                    alertMsg: 'get user Succesfully',
                };
            }
            case 'GET_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetailRole: true,
                    detailRole: action.payload.data.result,
                    alertMsg: 'get detail user Succesfully'
                };
            }
            case 'GET_DETAIL_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetailRole: false
                };
            }
            case 'ADD_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    addRole: true,
                    alertMsg: 'add role Succesfully'
                };
            }
            case 'ADD_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    addRole: false,
                    alertMsg: 'add role failed'

                };
            }
            case 'UPDATE_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    updateRole: true,
                    alertMsg: 'update role Succesfully'
                };
            }
            case 'UPDATE_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    updateRole: false,
                };
            }
            case 'NEXT_DATA_USER_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataUser: action.payload.data.result.rows,
                    alertMsg: 'add user Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailUser: action.payload.data.result,
                    alertMsg: 'get detail user Succesfully'
                };
            }
            case 'GET_DETAIL_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_MASTER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'CHANGE_PW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CHANGE_PW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isChange: true,
                    alertMsg: 'change pw succesfully'
                };
            }
            case 'CHANGE_PW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'unable connect to server',
                };
            }
            case 'RESET_PW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'RESET_PW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReset: true,
                    alertMsg: 'reset pw succesfully'
                };
            }
            case 'RESET_PW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'unable connect to server',
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isUpdate: false,
                    isChange: false,
                    isReset: false,
                    addRole: null,
                    updateRole: null,
                    isDetailRole: null,
                }
            }
            // case 'USERS_LOADED': {
            //     return {
            //         loadedAt: moment(),
            //         users: payload
            //     }
            // }
            default: {
                return state;
            }
        }
    }