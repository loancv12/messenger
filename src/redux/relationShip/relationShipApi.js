import {
  updateFriendRequests,
  updateFriends,
  updateUsers,
} from "../relationShip/relationShipSlice";
import { dispatch } from "../store";
import { apiAction } from "../mdw/apiMdw";

// users, friends, friendRequets
export const fetchUsers = () =>
  apiAction({
    url: "/user/get-users",
    onSuccess: (res) => dispatch(updateUsers({ users: res.data.data })),
  });

export const fetchFriends = () => {
  return apiAction({
    url: "/user/get-friends",
    onSuccess: (res) => dispatch(updateFriends({ friends: res.data.data })),
  });
};

export const fetchFriendRequests = () =>
  apiAction({
    url: "/user/get-friend-requests",
    onSuccess: (res) =>
      dispatch(updateFriendRequests({ friendRequests: res.data.data })),
  });
