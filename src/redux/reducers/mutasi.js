/* eslint-disable import/no-anonymous-default-export */
const mutasiState = {
    isAdd: false,
    isUpdate: false,
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
    detailMut: [],
    mutApp: {},
    nomor_mutasi: '',
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
    statusBudget: false
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
                    nomor_mutasi: action.payload.data.nomor_mutasi,
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
            case 'RESET_ADD_MUT': {
                return {
                    ...state,
                    errorAdd: false
                };
            }
            case 'RESET_APPREJMUT': {
                return {
                    ...state,
                    isApprove: false,
                    rejApprove: false,
                    isReject: false,
                    rejReject: false,
                    isRejDoc: false
                }
            }
            default: {
                return state;
            }
        }
    }