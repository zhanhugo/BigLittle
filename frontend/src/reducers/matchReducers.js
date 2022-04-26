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
} from "../constants/matchConstants";

export const matchCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCHES_CREATE_REQUEST:
      return { loading: true };
    case MATCHES_CREATE_SUCCESS:
      return { loading: false, success: true };
    case MATCHES_CREATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const matchConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case MATCHES_CONFIRM_REQUEST:
      return { loading: true };
    case MATCHES_CONFIRM_SUCCESS:
      return { loading: false, confirmedMatch: action.payload };
    case MATCHES_CONFIRM_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const notificationsListReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case NOTIFICATIONS_LIST_REQUEST:
      return { loading: true };
    case NOTIFICATIONS_LIST_SUCCESS:
      return { loading: false, notifications: action.payload };
    case NOTIFICATIONS_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};  

export const chatListReducer = (state = { chats: [] }, action) => {
  switch (action.type) {
    case CHAT_LIST_REQUEST:
      return { loading: true };
    case CHAT_LIST_SUCCESS:
      return { loading: false, chats: action.payload };
    case CHAT_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};  