import axios from "axios";
import { USER_LOADED, AUTH_ERROR, REGISTER_SUCCESS, REGISTER_FAIL } from "./types";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";

// Load user
export const loadUser = () => async dispatch => {
    // If a token is found in localStorage then set axios headers
    if (localStorage.token) setAuthToken(localStorage.token);

    try {
        const res = await axios.get("/api/v1/auth/me");

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Register user
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post("/api/v1/users/register", body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};
