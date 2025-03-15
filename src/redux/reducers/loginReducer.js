/** **************************** Import Types ****************************** */
import {
  LOGIN_USERS_REQUEST,
  LOGIN_USERS_SUCCESS,
  LOGIN_USERS_FAILURE,
} from "../types/loginTypes";

const initialState = {
  loading: false,
  storeLoginResponse: "",
  error: "",
};

const loginReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case LOGIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        storeLoginResponse: "",
      };
    case LOGIN_USERS_SUCCESS:
      return {
        loading: false,
        storeLoginResponse: action.payload.responseStatus,
        error: "",
      };
    case LOGIN_USERS_FAILURE:
      return {
        loading: false,
        storeLoginResponse: "error",
        error: action.payload,
      };
    default:
      return state;
  }
};

export default loginReducer;
