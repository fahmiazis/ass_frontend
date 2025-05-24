/* eslint-disable import/no-anonymous-default-export */
const dokumenState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDokumen: [],
    detailDokumen: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    dataDoc: [],
    appdoc: null,
    rejdoc: null,
    isShow: null
};

export default (state=dokumenState, action) => {
        switch(action.type){
            case 'SHOW_DOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SHOW_DOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: true,
                    dataShow: action.payload.config.url,
                    alertMsg: 'show document succesfully',
                };
            }
            case 'SHOW_DOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add dokumen Succesfully'
                };
            }
            case 'ADD_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailDokumen: action.payload.data.result,
                    alertMsg: 'get detail dokumen Succesfully'
                };
            }
            case 'GET_DETAIL_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update dokumen Succesfully'
                };
            }
            case 'UPDATE_DOKUMEN_REJECTED': {
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
            case 'APPROVE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'APPROVE_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    rejdoc: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'REJECT_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejdoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_USER_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_USER_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get document io Succesfully',
                };
            }
            case 'GET_USER_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isShow: null
                }
            }
            default: {
                return state;
            }
        }
    }