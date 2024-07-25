import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import {
  selectSidebar,
  selectTypeOfCvs,
  updateShowCvsComp,
} from "../../../redux/app/appSlice";
import {
  Contact,
  SharedMessages,
  StarredMessages,
} from "../../../components/sidebar";
import Group from "./Group";
import { useEffect, useRef } from "react";
import { chatTypes } from "../../../redux/config";
import {
  concatMessages,
  setCurrentMsgs,
  setNumOfPage,
} from "../../../redux/message/messageSlice";
import { fetchConversations } from "../../../redux/conversation/conversationApi";
import { fetchMessages } from "../../../redux/message/messageApi";
import useAxios from "../../../hooks/useAxios";
import { selectCurrCvsId } from "../../../redux/conversation/conversationSlice";

const GroupChat = () => {
  const isFirstMount = useRef(true);
  const runFetchCvs = useRef(false);

  const cursorRef = useRef({
    lastMsgCreated: "",
    isHaveMoreMsg: true,
  });

  const sidebar = useSelector(selectSidebar);
  const dispatch = useDispatch();
  const currentCvsId = useSelector((state) =>
    selectCurrCvsId(state, chatTypes.GROUP_CHAT)
  );
  const { callAction, isLoading, isError } = useAxios("group page");

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };

  const handleGetNextMsgs = async () => {
    const onSuccess = (res) => {
      const isHaveMoreMsg = res?.headers?.["x-pagination"];
      cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
      cursorRef.current.lastMsgCreated = res.data.data[0].createdAt;

      dispatch(
        concatMessages({
          type: chatTypes.GROUP_CHAT,
          newMessages: res.data.data,
        })
      );
    };

    if (cursorRef.current.isHaveMoreMsg) {
      await callAction(
        fetchMessages({
          data: {
            type: chatTypes.GROUP_CHAT,
            conversationId: currentCvsId,
            cursor: cursorRef.current.lastMsgCreated,
          },
          onSuccess,
        })
      );
    }
  };

  // cause if we put 2 fetch cvs and msg separately into 2 comp: Chats and Message (respectively),
  // a error will happen with refetch token, when first call will make refresh token of second call unauthorized
  // so I put 2 call in here, in one comp and make them sequence
  useEffect(() => {
    dispatch(selectTypeOfCvs({ chatType: chatTypes.GROUP_CHAT }));

    const fetchCvsAndMsg = async () => {
      const onSuccess = (res) => {
        const isHaveMoreMsg = res?.headers?.["x-pagination"];
        cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
        cursorRef.current.lastMsgCreated = res.data.data[0].createdAt;
        dispatch(
          setCurrentMsgs({
            type: chatTypes.GROUP_CHAT,
            messages: res.data.data,
          })
        );
      };
      // i put this in useEffect with dep is currentCvsId when this run one when mount instead of dep being []
      // cause if put this in useEffetc with dep being [],
      // when currentCvsId change, we need another useEffect with dep is currentCvsId with a call fetchMsg when currentCvsId change
      // while in useEffetc with dep being [], we call both fetchCvs and fetchMsg,
      // it is difficult to make sure that the useEffect with dep is currentCvsId is run only when user click to chatElement to change current cvs
      // not when mount as useEffetc with dep being [],
      // i already try to count the render but it not work
      try {
        // make sure that fetch cvs only one when mount
        if (!runFetchCvs.current) {
          await callAction(fetchConversations({ type: chatTypes.GROUP_CHAT }));
          runFetchCvs.current = true;
        }
        if (currentCvsId) {
          await callAction(
            fetchMessages({
              data: {
                type: chatTypes.GROUP_CHAT,
                conversationId: currentCvsId,
                cursor: new Date(),
              },
              onSuccess,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      fetchCvsAndMsg();
    }
    return () => {
      isFirstMount.current = false;
    };
  }, [currentCvsId]);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Group />
      <Conversation
        handleBack={handleBack}
        handleGetNextMsgs={handleGetNextMsgs}
      />
      {(() => {
        switch (sidebar.type) {
          case "CONTACT":
            return <Contact />;
          case "SHARED":
            return <SharedMessages />;
          case "STARRED":
            return <StarredMessages />;
          default:
            break;
        }
      })()}
    </LeftAsideLayout>
  );
};

export default GroupChat;
