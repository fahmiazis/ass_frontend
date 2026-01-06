/* eslint-disable import/no-anonymous-default-export */
const stockState = {
    isAdd: false,
    isUpload: false,
    isUpdateStock: false,
    isUpdateNew: false,
    isSubmit: null,
    isGet: false,
    getReport: false,
    isApprove: false,
    isReject: false,
    isGetApp: false,
    getStock: false,
    stockDetail: false,
    isDetail: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    isAll: false,
    isGetStatus: false,
    alertMsg: '',
    dataAsset: [],
    dataStock: [],
    detailStock: [],
    alertM: '',
    pict: [],
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    stockApp: {},
    dataStatus: [],
    dataRep: [],
    pageRep: {},
    isDokumen: false,
    dataAll: [],
    dataDoc: [],
    rejReject: false,
    rejApprove: false,
    isStockArea: false,
    stockArea: [],
    detailAsset: {},
    getDetail: false,
    isSubrev: null,
    dataAdd: {},
    isImage: false,
    isSubaset: false,
    isFinStock: null,
    noStock: '',
    isApprev: null,
    dataDepo: [],
    dataAset: [],
    isDocStock: null,
    dataSearch: []
};

export default (state=stockState, action) => {
    switch(action.type){
        case 'GET_STOCK_PENDING': {
            return {
                ...state,
                getStock: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                getStock: true,
                dataStock: action.payload.data.result.rows,
                dataDepo: action.payload.data.dataDepo,
                dataAset: action.payload.data.dataAset,
                alertMsg: 'get stock Succesfully',
                page: action.payload.data.pageInfo
            };
        }
        case 'GET_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                getStock: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SEARCH_STOCK_PENDING': {
            return {
                ...state,
                getStock: false,
                isLoading: false,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SEARCH_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                dataSearch: action.payload.data.result.rows,
                alertMsg: 'get stock Succesfully'
            };
        }
        case 'SEARCH_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                getStock: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'STOCK_AREA_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'STOCK_AREA_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isStockArea: true,
                stockArea: action.payload.data.result.rows,
                alertMsg: 'get stock Succesfully',
            };
        }
        case 'STOCK_AREA_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpdateStock: true,
            };
        }
        case 'UPDATE_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_STOCKNEW_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_STOCKNEW_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpdateNew: true,
            };
        }
        case 'UPDATE_STOCKNEW_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DOK_STOCK_PENDING': {
            return {
                ...state,
                isDokumen: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DOK_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isDokumen: true,
                dataDoc: action.payload.data.result,
                alertMsg: 'get document disposal Succesfully'
            };
        }
        case 'DOK_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'CEK_DOC_PENDING': {
            return {
                ...state,
                isDokumen: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'CEK_DOC_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isDokumen: true,
                dataDoc: action.payload.data.result,
                alertMsg: 'get document disposal Succesfully'
            };
        }
        case 'UPLOAD_DOCSTOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_DOCSTOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isDocStock: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'UPLOAD_DOCSTOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isDocStock: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'CEK_DOC_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REPORT_STOCK_PENDING': {
            return {
                ...state,
                getReport: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REPORT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                getReport: true,
                dataRep: action.payload.data.result.rows,
                alertMsg: 'get stock Succesfully',
                pageRep: action.payload.data.pageInfo
            };
        }
        case 'REPORT_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                getReport: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DETAIL_STOCK_PENDING': {
            return {
                ...state,
                stockDetail: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DETAIL_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                stockDetail: true,
                detailStock: action.payload.data.result,
                pict: action.payload.data.pict,
                alertMsg: 'get stock Succesfully',
            };
        }
        case 'DETAIL_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                stockDetail: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isSubmit: true,
                noStock: action.payload.data.noStock,
            };
        }
        case 'SUBMIT_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isSubmit: false,
                alertMsg: "Unable connect to server",
                alertM: action.payload.response !== undefined ? action.payload.response.data.message : ''
            };
        }
        case 'SUBFINAL_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBFINAL_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isFinStock: true,
                alertMsg: 'success submet final Succesfully',
            };
        }
        case 'SUBFINAL_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isFinStock: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_REVISI_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_REVISI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isSubrev: true,
            };
        }
        case 'SUBMIT_REVISI_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isSubrev: false,
                alertMsg: "Unable connect to server",
            };
        }
        case 'APP_REVISI_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APP_REVISI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isApprev: true,
            };
        }
        case 'APP_REVISI_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isApprev: false,
                alertMsg: "Unable connect to server",
            };
        }
        case 'SUBMIT_ASET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_ASET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isSubaset: true,
            };
        }
        case 'SUBMIT_ASET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server",
            };
        }
        case 'APPROVE_STOCK_PENDING': {
            return {
                ...state,
                isApprove: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isApprove: true,
            };
        }
        case 'APPROVE_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isApprove: false,
                rejApprove: true,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REJECT_STOCK_PENDING': {
            return {
                ...state,
                isReject: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REJECT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isReject: true,
            };
        }
        case 'REJECT_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                rejReject: true,
                isReject: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_APPSTOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_APPSTOCK_FULFILLED': {
            return {
                ...state,
                isGetApp: true,
                stockApp: action.payload.data.result,
                isLoading: false,
                alertMsg: 'get approve disposal Succesfully',
            };
        }
        case 'GET_APPSTOCK_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DELETE_STOCK_PENDING': {
            return {
                ...state,
                isDelete: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DELETE_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isDelete: true,
                alertMsg: 'delete stock Succesfully',
            };
        }
        case 'DELETE_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isDelete: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPLOAD_PICTURE_PENDING': {
            return {
                ...state,
                isUpload: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_PICTURE_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpload: true,
                alertMsg: 'upload image stock Succesfully',
            };
        }
        case 'UPLOAD_PICTURE_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isUpload: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPLOAD_IMAGE_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_IMAGE_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isImage: true,
                alertMsg: 'upload image stock Succesfully',
            };
        }
        case 'UPLOAD_IMAGE_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_STATUS_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_STATUS_FULFILLED': {
            return {
                ...state,
                isGetStatus: true,
                dataStatus: action.payload.data.result,
                isLoading: false,
                alertMsg: 'get status stock Succesfully',
            };
        }
        case 'GET_STATUS_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'STATUS_ALL_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'STATUS_ALL_FULFILLED': {
            return {
                ...state,
                isAll: true,
                dataAll: action.payload.data.result,
                isLoading: false,
                alertMsg: 'get status stock Succesfully',
            };
        }
        case 'STATUS_ALL_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DETAIL_ITEM_PENDING': {
            return {
                ...state,
                stockDetail: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DETAIL_ITEM_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                getDetail: true,
                detailAsset: action.payload.data.result,
                alertMsg: 'get stock Succesfully',
            };
        }
        case 'DETAIL_ITEM_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'ADD_STOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'ADD_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isAdd: true,
                dataAdd: action.payload.data.result
            };
        }
        case 'ADD_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server",
                alertM: action.payload.response !== undefined ? action.payload.response.data.message : ''
            };
        }
        case 'DELETE_ADDSTOCK_PENDING': {
            return {
                ...state,
                isDelete: false,
                isLoading: true,
                alertMsg: 'Waiting ...',
            };
            }
        case 'DELETE_ADDSTOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isDeleteAdd: true,
                alertMsg: 'delete stock Succesfully',
            };
        }
        case 'DELETE_ADDSTOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isDeleteAdd: false,
                alertMsg: 'Unable connect to server',
            };
        }
        case 'RESET_STOCK': {
            return {
                ...state,
                isError: false,
                isDelete: false,
                isUpload: false,
                isGet: false,
                isExport: false,
                isApprove: false,
                isReject: false,
                rejReject: false,
                rejApprove: false,
                isUpdateNew: false,
                isUpdateStock: false,
                isSubrev: null,
                isApprev: null,
                isAdd: false,
                isImage: false,
                isSubmit: null,
                isSubaset: false,
                isDocStock: null
            }
        }
        default: {
            return state;
        }
    }
}