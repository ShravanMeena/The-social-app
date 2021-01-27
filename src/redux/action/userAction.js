import { USER_DATA } from "./types";

export const userAction = (data) => {
  return {
    type: USER_DATA,
    payload: data,
  };
};
