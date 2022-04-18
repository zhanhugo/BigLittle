import {
  MATCHES_LIST_REQUEST, 
  MATCHES_LIST_SUCCESS, 
  MATCHES_LIST_FAIL,
  MATCHES_CREATE_FAIL,
  MATCHES_CREATE_REQUEST,
  MATCHES_CREATE_SUCCESS,
} from "../constants/matchConstants";
import axios from "axios";

export const listMatches = (isMentor, isMentee, confirmed) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MATCHES_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/matches`, 
      { isMentor, isMentee, confirmed },
      config
    );

    dispatch({
      type: MATCHES_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: MATCHES_LIST_FAIL,
      payload: message,
    });
  }
};

export const requestMatch = (mentor, mentorId, mentorPic, postId, message, fbLink) => async (dispatch, getState) => {
    try {
      dispatch({
        type: MATCHES_CREATE_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/matches/create`,
        { mentor, mentorId, mentorPic, postId, message, fbLink },
        config
      );
  
      dispatch({
        type: MATCHES_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MATCHES_CREATE_FAIL,
        payload: message,
      });
    }
};

