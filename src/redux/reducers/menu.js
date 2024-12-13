/* eslint-disable import/no-anonymous-default-export */
const menuState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataMenu: [],
    dataName: [],
    nameMenu: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detailApp: [],
    link: '',
    isAll: false,
    dataAll: []
};

export default (state=menuState, action) => {
        switch(action.type){
            case 'GET_MENU_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataMenu: action.payload.data.result.rows,
                    alertMsg: 'get approve Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ALL_MENU_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result,
                    nameMenu: action.payload.data.name,
                    alertMsg: 'get data all Succesfully'
                };
            }
            case 'GET_ALL_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_MENU_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    detailApp: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_DETAIL_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_NAME_MENU_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NAME_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataName: action.payload.data.result.rows,
                    alertMsg: 'get approve Succesfully',
                };
            }
            case 'GET_NAME_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CREATE_MENU_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isAddDetail: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAddDetail: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CREATE_NAME_MENU_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_NAME_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isAdd: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_NAME_MENU_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_MENU_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDelete: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'DELETE_MENU_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_MENU_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_MENU_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isUpdate: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'UPDATE_MENU_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_MENU': {
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