/* eslint-disable import/no-anonymous-default-export */
const assetState = {
    isAdd: false,
    isUpload: null,
    isUpdate: false,
    isSubmit: false,
    isGet: false,
    getStock: false,
    stockDetail: false,
    isDetail: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataAsset: [],
    assetAll: [],
    dataStock: [],
    detailStock: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isGetAll: false,
    detailAsset: {},
    getDetail: false,
    isUpdateNew: false,
    isSync: null
};

export default (state=assetState, action) => {
        switch(action.type){
            case 'GET_ASSET_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ASSET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataAsset: action.payload.data.result.rows,
                    alertMsg: 'get asset Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ASSET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ASSETALL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ASSETALL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetAll: true,
                    assetAll: action.payload.data.result.rows,
                    alertMsg: 'get asset Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ASSETALL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_PENDING': {
                return {
                    ...state,
                    stockDetail: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    getDetail: true,
                    detailAsset: action.payload.data.result,
                    alertMsg: 'get stock Succesfully',
                };
            }
            case 'GET_DETAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
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
            case 'UPDATE_ASSET_PENDING': {
                return {
                    ...state,
                    isUpdate: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_ASSET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isUpdate: true,
                };
            }
            case 'UPDATE_ASSET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_ASSETNEW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_ASSETNEW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isUpdateNew: true,
                };
            }
            case 'UPDATE_ASSETNEW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_ASSET_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_ASSET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_ASSET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response !== null && action.payload.response !== undefined &&action.payload.response.data.message,
                    alertUpload: action.payload.response !== null && action.payload.response !== undefined &&action.payload.response.data.result
                };
            }
            case 'SUBMIT_STOCK_PENDING': {
                return {
                    ...state,
                    isSubmit: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_STOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isSubmit: true,
                };
            }
            case 'SUBMIT_STOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmit: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_ASSET_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_ASSET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    isGetAll: true,
                    dataAsset: action.payload.data.result.rows,
                    assetAll: action.payload.data.result.rows,
                    alertMsg: 'add depo Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_ASSET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SYNC_ASSET_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SYNC_ASSET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSync: true,
                    alertMsg: 'get detail faktur Succesfully',
                };
            }
            case 'SYNC_ASSET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSync: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_ASSET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: null,
                    isGet: false,
                    isExport: false,
                    isUpdate: false,
                    isUpdateNew: false,
                    isSync: null
                }
            }
            case 'RESET_DATA': {
                return {
                    ...state,
                    dataAsset: []
                }
            }
            default: {
                return state;
            }
        }
    }