/* eslint-disable import/no-anonymous-default-export */
const authState = {
  isLogin: false,
  isRegister: false,
  token: '',
  isLoading: false,
  isError: false,
  alertMsg: '',
  dataDashboard: [],
  dataCount: {},
  isCount: null
};

export default (state = authState, action) => {
  switch (action.type) {
    case 'GET_DASHBOARD_PENDING': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'GET_DASHBOARD_FULFILLED': {
      return {
        ...state,
        isGet: true,
        isLoading: false,
        dataDashboard: action.payload.data.result,
      };
    }
    case 'GET_DASHBOARD_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isGet: false,
      };
    }

    case 'GET_COUNT_TRANSACTION_DASHBOARD_PENDING': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'GET_COUNT_TRANSACTION_DASHBOARD_FULFILLED': {
      return {
        ...state,
        isCount: true,
        isLoading: false,
        dataCount: action.payload.data,
      };
    }
    case 'GET_COUNT_TRANSACTION_DASHBOARD_REJECTED': {
      return {
        ...state,
        isLoading: false,
        isCount: false,
      };
    }
    default: {
      return state;
    }
  }
};
