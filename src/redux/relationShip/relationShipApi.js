import {
  setCurrUser,
  setFriendRequests,
  setFriends,
  setUsers,
  updateCurrUser,
} from "../relationShip/relationShipSlice";
import { dispatch } from "../store";
import { apiAction } from "../../utils/apiAction";
import { showSnackbar } from "../app/appSlice";

// users, friends, friendRequets
export const fetchCurrUser = () =>
  apiAction({
    url: "/user/get-me",
    onSuccess: (res) => dispatch(setCurrUser({ currUser: res.data.data })),
  });

export const updateProfile = (formData) =>
  apiAction({
    url: "/user/update-me",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    onSuccess: (res) => {
      console.log(res);

      dispatch(updateCurrUser({ updateContent: res.data.data }));
      dispatch(showSnackbar({ message: "Update profile successfully" }));
    },
    onFailure: (err) => {
      console.log(err);
      dispatch(showSnackbar({ severity: "error", message: "Something wrong" }));
    },
  });

export const fetchUsers = () =>
  apiAction({
    url: "/user/get-users",
    onSuccess: (res) => dispatch(setUsers({ users: res.data.data })),
  });

export const fetchFriends = () => {
  return apiAction({
    url: "/user/get-friends",
    onSuccess: (res) => dispatch(setFriends({ friends: res.data.data })),
  });
};

export const fetchFriendRequests = () =>
  apiAction({
    url: "/user/get-friend-requests",
    onSuccess: (res) => {
      dispatch(setFriendRequests({ friendRequests: res.data.data }));
    },
  });
