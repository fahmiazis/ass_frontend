/* eslint-disable import/no-anonymous-default-export */
const disposalState = {
    approve: false,
    reject: false,
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGetDet: false,
    isGet: false,
    isGetApp: false,
    isDetail: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    isSubmit: false,
    isGetDoc: false,
    isRejDoc: false,
    isAppDoc: false,
    isGetSub: false,
    alertMsg: '',
    dataDis: [],
    noDis: [],
    alertM: '',
    dataDoc: [],
    dataSubmit: [],
    page: {},
    disApp: {},
    dataKet: [],
    getKet: false,
    rejReject: false,
    rejApprove: false,
    isExport: false,
    link: '',
    detailDis: [],
    detailData: [],
    dataCart: [],
    isGetCart: false,
    isSubmitDis: null,
    isEditEks: null,
    rejEks: null,
    no_disposal: '',
    isSubmitFin: null,
    subRevisi: null,
    appRevisi: null,
    detailNew: [],
    dataSearch: []
};

export default (state=disposalState, action) => {
        switch(action.type){
            case 'GET_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataDis: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                    page: action.payload.data.pageInfo,
                    noDis: action.payload.data.noDis
                };
            }
            case 'GET_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SEARCH_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SEARCH_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataSearch: action.payload.data.result.rows,
                    alertMsg: 'search disposal Succesfully',
                };
            }
            case 'SEARCH_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_CART_PENDING': {
                return {
                    ...state,
                    isGetCart: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_CART_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetCart: true,
                    dataCart: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                };
            }
            case 'GET_CART_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GETNEW_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GETNEW_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataDis: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                };
            }
            case 'GETNEW_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGetDet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDet: true,
                    detailDis: action.payload.data.result,
                    alertMsg: 'get detail disposal Succesfully',
                };
            }
            case 'DETAIL_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEWDETAIL_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEWDETAIL_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    detailNew: action.payload.data.result,
                    alertMsg: 'get detail disposal Succesfully',
                };
            }
            case 'NEWDETAIL_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_PENGAJUAN_PENDING': {
                return {
                    ...state,
                    isGetDet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_PENGAJUAN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDet: true,
                    detailData: action.payload.data.result,
                    alertMsg: 'get detail disposal Succesfully',
                };
            }
            case 'DETAIL_PENGAJUAN_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_SUBMIT_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_SUBMIT_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetSub: true,
                    dataSubmit: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                };
            }
            case 'GET_SUBMIT_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_KET_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_KET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    getKet: true,
                    dataKet: action.payload.data.result,
                    alertMsg: 'get keterangan succesfully',
                };
            }
            case 'GET_KET_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_APPDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_APPDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetApp: true,
                    disApp: action.payload.data.result,
                    alertMsg: 'get approve disposal Succesfully',
                };
            }
            case 'GET_APPDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isAdd: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'ADD_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isAdd: false,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isDelete: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'DELETE_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isDelete: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'UPDATE_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'SUBMIT_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmit: true,
                    no_disposal: action.payload.data.no_disposal,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'SUBMIT_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_FINAL_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_FINAL_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitFin: true,
                    alertMsg: 'submit disposal Succesfully',
                };
            }
            case 'SUBMIT_FINAL_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isSubmitFin: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_DIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    approve: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'APPROVE_DIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejApprove: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'REJECT_DIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    reject: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'REJECT_DIS_REJECTED': {
                return {
                    ...state,
                    rejReject: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'GET_DOCDIS_PENDING': {
                return {
                    ...state,
                    isGetDoc: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOCDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDoc: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get document disposal Succesfully'
                };
            }
            case 'GET_DOCDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_DOCDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOCDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload document disposal succesfully',
                };
            }
            case 'UPLOAD_DOCDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_DOCDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DOCDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAppDoc: true,
                    alertMsg: 'approve document disposal succesfully',
                };
            }
            case 'APPROVE_DOCDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_DOCDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DOCDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejDoc: true,
                    alertMsg: 'approve document disposal succesfully',
                };
            }
            case 'REJECT_DOCDIS_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_EDITDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_EDITDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitDis: true,
                    alertMsg: 'approve document disposal succesfully',
                };
            }
            case 'SUBMIT_EDITDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitDis: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_EDITEKS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_EDITEKS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditEks: true,
                    alertMsg: 'approve document disposal succesfully',
                };
            }
            case 'SUBMIT_EDITEKS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditEks: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_EKS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_EKS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    rejEks: true,
                    alertMsg: 'approve document disposal succesfully',
                };
            }
            case 'REJECT_EKS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejEks: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APP_REVISI_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APP_REVISI_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: true,
                    alertMsg: 'update app revisi success',
                };
            }
            case 'APP_REVISI_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_REVISI_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_REVISI_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: true,
                    alertMsg: 'submit revisi succesfully',
                };
            }
            case 'SUBMIT_REVISI_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_DISPOSAL': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isRejDoc: false,
                    isAppDoc: false,
                    isGet: false,
                    isSubmit: false,
                    isAdd: false,
                    isExport: false,
                    isDelete: false,
                    isSubmitDis: null,
                    isEditEks: null,
                    rejEks: null,
                    isSubmitFin: null,
                    subRevisi: null,
                    appRevisi: null,
                }
            }
            case 'RESET_APPREJ': {
                return {
                    ...state,
                    approve: false,
                    reject: false,
                    rejReject: false,
                    rejApprove: false,
                }
            }
            default: {
                return state;
            }
        }
    }