/* eslint-disable import/no-anonymous-default-export */
const setujuState = {
    isAdd: false,
    isGet: false,
    isGetApp: false,
    isGetData: false,
    isLoading: false,
    isError: false,
    approve: false,
    errorApp: false,
    reject: false,
    errorRej: false,
    alertMsg: '',
    alertM: '',
    isSubmitEks: false,
    isSubmitTax: false,
    isSubmitFinal: false,
    isSubmitPurch: false,
    isSubmitEdit: false,
    isRejTaxFin: false,
    dataDis: [],
    noDis: [],
    page: {},
    disApp: {}
};

export default (state=setujuState, action) => {
        switch(action.type){
            case 'SUBMIT_SETDIS_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_SETDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    alertMsg: 'submit persetujuan disposal Succesfully',
                };
            }
            case 'SUBMIT_SETDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_EKSEKUSI_PENDING': {
                return {
                    ...state,
                    isSubmitEks: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_EKSEKUSI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isSubmitEks: true,
                    alertMsg: 'submit eksekusi disposal Succesfully',
                };
            }
            case 'SUBMIT_EKSEKUSI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitEks: false,
                    isError: true,
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_TAXFIN_PENDING': {
                return {
                    ...state,
                    isSubmitTax: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_TAXFIN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isSubmitTax: true,
                    alertMsg: 'submit eksekusi disposal Succesfully',
                };
            }
            case 'SUBMIT_TAXFIN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitTax: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_FINAL_PENDING': {
                return {
                    ...state,
                    isSubmitFinal: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_FINAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isSubmitFinal: true,
                    alertMsg: 'submit eksekusi disposal Succesfully',
                };
            }
            case 'SUBMIT_FINAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitFinal: false,
                    isError: true,
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_PURCH_PENDING': {
                return {
                    ...state,
                    isSubmitPurch: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_PURCH_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isSubmitPurch: true,
                    alertMsg: 'submit purch disposal Succesfully',
                };
            }
            case 'SUBMIT_PURCH_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitPurch: false,
                    isError: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'GET_SETDIS_PENDING': {
                return {
                    ...state,
                    isGetData: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_SETDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetData: true,
                    dataDis: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                    page: action.payload.data.pageInfo,
                    noDis: action.payload.data.noDis
                };
            }
            case 'GET_SETDIS_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_APPSET_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_APPSET_FULFILLED': {
                return {
                    ...state,
                    isGetApp: true,
                    isLoading: false,
                    disApp: action.payload.data.result,
                    alertMsg: 'get approve setdisposal Succesfully',
                };
            }
            case 'GET_APPSET_REJECTED': {
                return {
                    ...state,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_SETDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_SETDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    approve: true,
                    alertMsg: 'approve Succesfully',
                };
            }
            case 'APPROVE_SETDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    errorApp: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'REJECT_SETDIS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_SETDIS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    reject: true,
                    alertMsg: 'reject disposal Succesfully',
                };
            }
            case 'REJECT_SETDIS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    errorRej: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response === undefined || action.payload.response.data === undefined ? 'unable connect to server': action.payload.response.data.message
                };
            }
            case 'SUBMIT_EDIT_TAXFIN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_EDIT_TAXFIN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmitEdit: true,
                    alertMsg: 'submit edit Succesfully',
                };
            }
            case 'SUBMIT_EDIT_TAXFIN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_TAXFIN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_TAXFIN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejTaxFin: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'REJECT_TAXFIN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_SETUJU': {
                return {
                    ...state,
                    isError: false,
                    isGet: false
                }
            }
            case 'RESET_APPSET': {
                return {
                    ...state,
                    reject: false,
                    approve: false,
                    errorApp: false,
                    errorRej: false
                }
            }
            default: {
                return state;
            }
        }
    }