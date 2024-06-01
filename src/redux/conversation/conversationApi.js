import {
  setConversations,
  setJoinGroupReqs,
} from "../conversation/conversationSlice";
import { dispatch } from "../store";
import { apiAction } from "../mdw/apiMdw";

export const fetchConversations = (data) =>
  apiAction({
    url: `/conversation/get-conversations/${data.type}`,
    data,
    onSuccess: (res) =>
      dispatch(
        setConversations({
          type: data.type,
          conversations: res.data.data,
        })
      ),
  });

export const fetchJoinGroupReqs = () =>
  apiAction({
    url: "/conversation/get-join-group-reqs",
    onSuccess: (res) =>
      dispatch(setJoinGroupReqs({ joinGroupReqs: res.data.data })),
  });
