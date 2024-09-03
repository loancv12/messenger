import {
  setCurrUser,
  setFriendRequests,
  setFriends,
  setUsers,
} from "../relationShip/relationShipSlice";
import { dispatch } from "../store";
import { apiAction } from "../../utils/apiAction";

// users, friends, friendRequets
export const fetchCurrUser = () =>
  apiAction({
    url: "/user/get-me",
    onSuccess: (res) => dispatch(setCurrUser({ currUser: res.data.data })),
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
