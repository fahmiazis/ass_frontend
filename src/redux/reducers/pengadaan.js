/* eslint-disable import/no-anonymous-default-export */
const pengState = {
    isGet: false,
    isLoading: false,
    isError: false,
    isUpload: false,
    isUpdate: false,
    alertMsg: '',
    dataPeng: [],
    dataSearch: [],
    dataApp: [],
    dataCart: [],
    dataDoc: [],
    dataShow: '',
    isShow: false,
    detailIo: [],
    dataTemp: [],
    isTemp: false,
    isDetail: false,
    updateAsset: false,
    subIsAsset: false,
    updateNoIo: false,
    updateNoAsset: false,
    subBudget: false,
    approve: false,
    reject: false,
    rejApprove: false,
    rejReject: false,
    subEks: false,
    subRevisi: null,
    updateTemp: false,
    errUpload: false,
    getCart: false,
    addCart: false,
    subCart: false,
    delCart: false,
    upCart: false,
    docCart: false,
    dataDocCart: [],
    appall: false,
    rejAppall: false,
    dataAppall: [],
    updateReason: false,
    getRev: false,
    revPeng: [],
    testPods: '',
    dataTest: {},
    appdoc: null,
    rejdoc: null,
    isGetTrack: false,
    trackIo: [],
    podssend: null,
    submitNotAset: null,
    dataErr: [],
    noIo: '',
    isSubIo: null,
    isFinIo: null,
    appRevisi: null
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
        case 'SEARCH_IO_PENDING': {
            return {
                ...state,
                isGet: false,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SEARCH_IO_FULFILLED': {
            return {
                ...state,
                isError: false,
                isGet: true,
                dataSearch: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'SEARCH_IO_REJECTED': {
            return {
                ...state,
                isGet: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_TRACKIO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_TRACKIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGetTrack: true,
                trackIo: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'GET_TRACKIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_REVISI_PENDING': {
            return {
                ...state,
                getRev: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REVISI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                getRev: true,
                revPeng: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'GET_REVISI_REJECTED': {
            return {
                ...state,
                isLoading: false,
                getRev: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GETCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GETCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                getCart: true,
                dataCart: action.payload.data.result,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'GETCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DOCCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DOCCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                docCart: true,
                dataDocCart: action.payload.data.result,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'DOCCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'ADDCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'ADDCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                addCart: true,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'ADDCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                subCart: true,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'SUBCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isSubIo: true,
                noIo: action.payload.data.noIo,
                alertMsg: 'get detail coa Succesfully',
            };
        }
        case 'SUBMIT_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isSubIo: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBFINAL_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBFINAL_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isFinIo: true,
                alertMsg: 'success submet final Succesfully',
            };
        }
        case 'SUBFINAL_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isFinIo: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                upCart: true,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'UPCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
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
                appRevisi: true,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'APP_REVISI_REJECTED': {
            return {
                ...state,
                isLoading: false,
                appRevisi: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DELCART_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DELCART_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                delCart: true,
                alertMsg: 'get data cart Succesfully',
            };
        }
        case 'DELCART_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
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
        case 'TEMP_ASSET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'TEMP_ASSET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isTemp: true,
                dataTemp: action.payload.data.result,
                alertMsg: 'get pengadaan Succesfully',
            };
        }
        case 'TEMP_ASSET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                updateAsset: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'UPDATE_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPLOAD_TEMP_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_TEMP_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                uploadTemp: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'UPLOAD_TEMP_REJECTED': {
            return {
                ...state,
                isLoading: false,
                errUpload: true,
                dataErr: action.payload.response === undefined ? [{mess: 'internal server error'}] : action.payload.response.data.result,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_TEMP_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_TEMP_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                updateTemp: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'UPDATE_TEMP_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'NO_ASSET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'NO_ASSET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                updateNoAsset: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'NO_ASSET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_NOIO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_NOIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                updateNoIo: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'UPDATE_NOIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPDATE_REASON_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPDATE_REASON_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                updateReason: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'UPDATE_REASON_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_ISASSET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_ISASSET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                subIsAsset: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'SUBMIT_ISASSET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_NOTASSET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_NOTASSET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                subNotAsset: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'SUBMIT_NOTASSET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_BUDGET_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_BUDGET_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                subBudget: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'SUBMIT_BUDGET_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_EKS_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_EKS_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                subEks: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'SUBMIT_EKS_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isError: true,
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
                subRevisi: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'SUBMIT_REVISI_REJECTED': {
            return {
                ...state,
                isLoading: false,
                subRevisi: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'APPROVE_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                approve: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'APPROVE_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                rejApprove: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REJECT_IO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REJECT_IO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                reject: true,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'REJECT_IO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                rejReject: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'APPROVE_ALL_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_ALL_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                appall: true,
                dataAppall: action.payload.data.data,
                alertMsg: 'update is asset succesfully',
            };
        }
        case 'APPROVE_ALL_REJECTED': {
            return {
                ...state,
                isLoading: false,
                rejAppall: true,
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
        case 'TESTAPI_PODS_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'TESTAPI_PODS_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                testPods: 'true',
                dataTest: action.payload.data.result,
                alertMsg: 'get document io Succesfully',
            };
        }
        case 'TESTAPI_PODS_REJECTED': {
            return {
                ...state,
                isLoading: false,
                testPods: 'false',
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
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                appdoc: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'APPROVE_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                appdoc: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REJECT_DOCIO_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REJECT_DOCIO_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                rejdoc: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'REJECT_DOCIO_REJECTED': {
            return {
                ...state,
                isLoading: false,
                rejdoc: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'PODS_SEND_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'PODS_SEND_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                podssend: true,
                alertMsg: 'upload document succesfully',
            };
        }
        case 'PODS_SEND_REJECTED': {
            return {
                ...state,
                isLoading: false,
                podssend: false,
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
                errUpload: false,
                uploadTemp: false
            }
        }
        case 'APP_RESET': {
            return {
                ...state,
                rejApprove: false,
                rejReject: false,
                approve: false,
                reject: false,
                testPods: '',
                appdoc: null,
                rejdoc: null,
                podssend: null,
                subRevisi: null,
                appRevisi: null
            }
        }
        default: {
            return state;
        }
    }
}
