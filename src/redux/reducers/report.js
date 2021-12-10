/* eslint-disable default-case */
/* eslint-disable import/no-anonymous-default-export */
const reportState = {
    isGet: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataRep: [],
};

export default (state=reportState, action) => {
    switch(action.type){
        case 'GET_REPORTDIS_PENDING': {
            return {
                ...state,
                isGet: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_REPORTDIS_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataRep: action.payload.data.result.rows,
                alertMsg: 'get disposal Succesfully',
            };
        }
        case 'GET_REPORTDIS_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        default: {
            return state;
        }
    }
}