/* eslint-disable import/no-anonymous-default-export */
const mutasiState = {
    isAdd: false,
    isUpdate: null,
    isGet: false,
    isGetRec: false,
    isGetApprove: false,
    isGetDet: false,
    isDokumen: false,
    isSubmit: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    isApprove: false,
    isReject: false,
    submitEks: false,
    submitBud: false,
    eksError: false,
    budError: false,
    updateEks: false,
    submitEdit: false,
    detailMut: [],
    infoApp: {},
    changeDate: false,
    mutApp: {},
    nomor_mutasi: '',
    no_jwt: '',
    alertMsg: '',
    alertM: '',
    dataMut: [],
    page: {},
    noMut: [],
    dataDoc: [],
    errorAdd: false,
    rejReject: false,
    rejApprove: false,
    isRejDoc: false,
    statusBudget: false,
    isSubFinal: null,
    isUpload: null,
    appdoc: null,
    dataCart: [],
    subRevisi: null,
    appRevisi: null,
    upReason: null,
    dataSearch: []
};

export default (state=mutasiState, action) => {
        switch(action.type){
            case 'ADD_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'get approve Succesfully'
                };
            }
            case 'ADD_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    errorAdd: true,
                    isError: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response.data.message
                };
            }
            case 'UPDATE_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'submit mutasi Succesfully'
                };
            }
            case 'UPDATE_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_EDIT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_EDIT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    submitEdit: true,
                    alertMsg: 'update submit eksekusi Succesfully'
                };
            }
            case 'SUBMIT_EDIT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'unable connect to server'
                };
            }
            case 'UPDATE_EKS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_EKS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    updateEks: true,
                    alertMsg: 'update eksekusi Succesfully'
                };
            }
            case 'UPDATE_EKS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CHANGE_DATE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CHANGE_DATE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    changeDate: true,
                    alertMsg: 'update eksekusi Succesfully'
                };
            }
            case 'CHANGE_DATE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'STATUS_BUDGET_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'STATUS_BUDGET_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    statusBudget: true,
                    alertMsg: 'update status budget Succesfully'
                };
            }
            case 'STATUS_BUDGET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'unable connect to server'
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
                    submitEks: true,
                    alertMsg: 'update submit eksekusi Succesfully'
                };
            }
            case 'SUBMIT_EKS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    eksError: true,
                    alertMsg: 'unable connect to server'
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
                    submitBud: true,
                    alertMsg: 'update submit budget Succesfully'
                };
            }
            case 'SUBMIT_BUDGET_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    budError: true,
                    alertMsg: 'unable connect to server'
                };
            }
            case 'GET_CART_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_CART_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataCart: action.payload.data.result.rows,
                    alertMsg: 'get mutasi Succesfully'
                };
            }
            case 'GET_CART_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataMut: action.payload.data.result.rows,
                    noMut: action.payload.data.noMut,
                    alertMsg: 'get mutasi Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SEARCH_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SEARCH_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataSearch: action.payload.data.result.rows,
                    alertMsg: 'get mutasi Succesfully'
                };
            }
            case 'SEARCH_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_MUTASI_REC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MUTASI_REC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetRec: true,
                    dataMut: action.payload.data.result.rows,
                    noMut: action.payload.data.noMut,
                    alertMsg: 'get mutasi Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MUTASI_REC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_MUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDet: true,
                    detailMut: action.payload.data.result,
                    infoApp: action.payload.data.infoApp ? action.payload.data.infoApp : {},
                    alertMsg: 'get mutasi Succesfully',
                };
            }
            case 'GET_DETAIL_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmit: true,
                    nomor_mutasi: action.payload.data.no_mutasi,
                    no_jwt: action.payload.data.no_jwt,
                    alertMsg: 'submit mutasi Succesfully'
                };
            }
            case 'SUBMIT_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_MUTASI_FINAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_MUTASI_FINAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubFinal: true,
                    alertMsg: 'submit mutasi Succesfully'
                };
            }
            case 'SUBMIT_MUTASI_FINAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubFinal: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_APPROVE_MUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_APPROVE_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetApprove: true,
                    mutApp: action.payload.data.result,
                    alertMsg: 'get mutasi Succesfully',
                };
            }
            case 'GET_APPROVE_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    alertMsg: 'approve mutasi Succesfully'
                };
            }
            case 'APPROVE_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejApprove: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'reject mutasi Succesfully'
                };
            }
            case 'REJECT_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejReject: true,
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
                    isReject: true,
                    alertMsg: 'reject mutasi Succesfully'
                };
            }
            case 'REJECT_EKS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejReject: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DOKUMEN_MUT_PENDING': {
                return {
                    ...state,
                    isDokumen: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOKUMEN_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDokumen: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get document disposal Succesfully'
                };
            }
            case 'DOKUMEN_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_DOCMUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DOCMUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejDoc: true,
                    alertMsg: 'reject document disposal succesfully',
                };
            }
            case 'REJECT_DOCMUT_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_DOCMUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOCMUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'UPLOAD_DOCMUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_DOCMUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DOCMUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'APPROVE_DOCMUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APP_REVISI_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APP_REVISI_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: true,
                    alertMsg: 'update app revisi success',
                };
            }
            case 'APP_REVISI_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_REVISI_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_REVISI_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: true,
                    alertMsg: 'submit revisi succesfully',
                };
            }
            case 'SUBMIT_REVISI_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_REASON_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_REASON_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    upReason: true,
                    alertMsg: 'submit revisi succesfully',
                };
            }
            case 'UPDATE_REASON_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    upReason: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_ADD_MUT': {
                return {
                    ...state,
                    errorAdd: false
                };
            }
            case 'RESET_MUTASI': {
                return {
                    ...state,
                    isApprove: false,
                    rejApprove: false,
                    isReject: false,
                    rejReject: false,
                    isRejDoc: false,
                    submitEdit: false,
                    submitEks: false,
                    submitBud: false,
                    isUpdate: null,
                    isSubFinal: null,
                    isUpload: null,
                    subRevisi: null,
                    appRevisi: null,
                    upReason: null
                }
            }
            default: {
                return state;
            }
        }
    }