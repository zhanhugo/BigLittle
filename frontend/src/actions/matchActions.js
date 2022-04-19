import {
  NOTIFICATIONS_LIST_REQUEST, 
  NOTIFICATIONS_LIST_SUCCESS, 
  NOTIFICATIONS_LIST_FAIL,
  CHAT_LIST_REQUEST, 
  CHAT_LIST_SUCCESS, 
  CHAT_LIST_FAIL,
  MATCHES_CREATE_FAIL,
  MATCHES_CREATE_REQUEST,
  MATCHES_CREATE_SUCCESS,
  MATCHES_CONFIRM_FAIL,
  MATCHES_CONFIRM_REQUEST,
  MATCHES_CONFIRM_SUCCESS,
  MATCHES_DELETE_FAIL,
  MATCHES_DELETE_REQUEST,
  MATCHES_DELETE_SUCCESS,
} from "../constants/matchConstants";
import axios from "axios";

export const listNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTIFICATIONS_LIST_REQUEST,
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
      { isMentor: true, isMentee: true, confirmed: "both", deleted: false },
      config
    );

    dispatch({
      type: NOTIFICATIONS_LIST_SUCCESS,
      payload: data.filter(match => (match.mentorId === userInfo._id && !match.confirmed) || (match.userId === userInfo._id && match.confirmed)),
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: NOTIFICATIONS_LIST_FAIL,
      payload: message,
    });
  }
};

export const listChats = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CHAT_LIST_REQUEST,
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
      { isMentor: true, isMentee: true, confirmed: true, deleted: false },
      config
    );

    dispatch({
      type: CHAT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: CHAT_LIST_FAIL,
      payload: message,
    });
  }
};

export const requestMatch = (mentor, mentorId, mentorPic, postId, message) => async (dispatch, getState) => {
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
        { mentor, mentorId, mentorPic, postId, messages: [{ senderName: userInfo.name, to: mentorId, text: message, id: userInfo._id + Date.now() }] },
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

export const confirmMatch = (match) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MATCHES_CONFIRM_REQUEST,
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
      `/api/matches/${match._id}`,
      {
        mentor: match.mentor, 
        mentorPic: match.mentorPic, 
        user: match.user, 
        userPic: match.userPic, 
        newMessage: null, 
        confirmed: true, 
        deleted: match.deleted
      },
      config
    );

    dispatch({
      type: MATCHES_CONFIRM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: MATCHES_CONFIRM_FAIL,
      payload: message,
    });
  }
};

export const deleteMatch = (match) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MATCHES_DELETE_REQUEST,
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
      `/api/matches/${match._id}`,
      {
        mentor: match.mentor, 
        mentorPic: match.mentorPic, 
        user: match.user, 
        userPic: match.userPic, 
        newMessage: null, 
        confirmed: match.confirmed, 
        deleted: true
      },
      config
    );

    dispatch({
      type: MATCHES_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: MATCHES_DELETE_FAIL,
      payload: message,
    });
  }
};

export const messageMatch = (match, newMessage) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MATCHES_DELETE_REQUEST,
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
      `/api/matches/${match._id}`,
      {
        mentor: match.mentor, 
        mentorPic: match.mentorPic, 
        user: match.user, 
        userPic: match.userPic, 
        newMessage, 
        confirmed: match.confirmed, 
        deleted: match.deleted
      },
      config
    );

    dispatch({
      type: MATCHES_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: MATCHES_DELETE_FAIL,
      payload: message,
    });
  }
};
