import {
  MATCHES_LIST_REQUEST, 
  MATCHES_LIST_SUCCESS, 
  MATCHES_LIST_FAIL,
  MATCHES_CREATE_FAIL,
  MATCHES_CREATE_REQUEST,
  MATCHES_CREATE_SUCCESS,
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

export const matchListReducer = (state = { matches: [] }, action) => {
  switch (action.type) {
    case MATCHES_LIST_REQUEST:
      return { loading: true };
    case MATCHES_LIST_SUCCESS:
      return { loading: false, matches: action.payload };
    case MATCHES_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};  