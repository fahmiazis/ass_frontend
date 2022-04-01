/* eslint-disable import/no-anonymous-default-export */
const pengState = {
    isGet: false,
    isLoading: false,
    isError: false,
    isUpload: false,
    isUpdate: false,
    alertMsg: '',
    dataPeng: [],
    dataApp: [],
    dataDoc: [],
    dataShow: '',
    isShow: false,
    detailIo: [],
    isDetail: false
}

export default (state=pengState, action) => {
    switch(action.type){
        case 'GET_PENGADAAN_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_PENGADAAN_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isGet: true,
                dataPeng: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'GET_PENGADAAN_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isGet: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DETAIL_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DETAIL_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isDetail: true,
                detailIo: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'DETAIL_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_APPROVEIO_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_APPROVEIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isGet: true,
                dataApp: action.payload.data.result,
                alertMsg: 'get approve io Succesfully',
            };
        }
        case 'GET_APPROVEIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isGet: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_DOCIO_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isGet: true,
                dataDoc: action.payload.data.result,
                alertMsg: 'get document io Succesfully',
            };
        }
        case 'GET_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isGet: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPLOAD_DOCIO_PENDING': {
            return {
                ...state,
                isUpload: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpload: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'UPLOAD_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isUpload: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'APPROVE_DOCIO_PENDING': {
            return {
                ...state,
                isUpdate: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpdate: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'APPROVE_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isUpdate: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REJECT_DOCIO_PENDING': {
            return {
                ...state,
                isUpdate: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REJECT_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpdate: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'REJECT_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isUpdate: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SHOW_PENDING': {
            return {
                ...state,
                isShow: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SHOW_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isShow: true,
                dataShow: action.payload.config.url,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'SHOW_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isShow: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'RESET': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpload: false,
                isUpdate: false,
                isGet: false,
            }
        }
        default: {
            return state;
        }
    }
}
