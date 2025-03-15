/** **************************** Import Types ****************************** */
import {
  LOGIN_USERS_REQUEST,
  LOGIN_USERS_SUCCESS,
  LOGIN_USERS_FAILURE,
} from "../types/loginTypes";
import { postLogin } from "../../api/create";
import "react-toastify/dist/ReactToastify.css";

export const LoginUsersRequest = () => ({
  type: LOGIN_USERS_REQUEST,
});
export const LoginUsersSuccess = (users) => ({
  type: LOGIN_USERS_SUCCESS,
  payload: users,
});
export const LoginUsersFailure = (error) => ({
  type: LOGIN_USERS_FAILURE,
  payload: error,
});
export const LoginUser = (
  data,
  setToastSuccess,
  setToastMessage,
  setShowToast
) =>
  async function (dispatch) {
    dispatch(LoginUsersRequest());
    return postLogin(data).then((res) => {

      if (!res.detail && !res?.error) {
        const loggedUser = res?.data?.user;
        const accessToken = res?.data?.tokens?.access?.token;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        dispatch(LoginUsersSuccess({ responseStatus: "success" }));

        if (
          loggedUser?.is_password_changed &&
          loggedUser?.is_expired === false
        ) {
          // toast.success(res?.message ? res?.message : "Logged-in Successful");
          setToastMessage(res?.message ? res?.message : "Logged-in Successful");
          setToastSuccess(true);
          setShowToast(true);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 3000);
        }
        
        return res;
      }
      dispatch(LoginUsersFailure(res.error));
      setToastMessage(
        res.detail?.message ? res?.detail?.message : "Invalid Credentials"
      );
      setToastSuccess(false);
      setShowToast(true);
    });
    
  };
