/* eslint-disable import/no-anonymous-default-export */
const authState = {
  isLogin: false,
  isRegister: false,
  token: '',
  isLoading: false,
  isError: false,
  alertMsg: '',
  dataDashboard: [],
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
    default: {
      return state;
    }
  }
};
