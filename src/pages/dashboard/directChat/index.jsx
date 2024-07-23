import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import Chats from "./Chats";
import {
  selectSidebar,
  selectTypeOfCvs,
  updateShowCvsComp,
} from "../../../redux/app/appSlice";
import Contact from "../../../components/sidebar/Contact";
import SharedMessages from "../../../components/sidebar/SharedMessages";
import StarredMessages from "../../../components/sidebar/StarredMessages";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatTypes } from "../../../redux/config";
import { fetchConversations } from "../../../redux/conversation/conversationApi";
import useAxios from "../../../hooks/useAxios";
import { fetchMessages } from "../../../redux/message/messageApi";
import { selectCurrCvsId } from "../../../redux/conversation/conversationSlice";
import {
  setNumOfPage,
  setCurrentMsgs,
} from "../../../redux/message/messageSlice";
import LoadingScreen from "../../../components/LoadingScreen";
import { Typography } from "@mui/material";

const DirectChat = () => {
  const isFirstMount = useRef(true);
  const runFetchCvs = useRef(false);

  const sidebar = useSelector(selectSidebar);
  const currentCvsId = useSelector((state) =>
    selectCurrCvsId(state, chatTypes.DIRECT_CHAT)
  );

  const { callAction, isLoading, isError } = useAxios("direct page");
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };

  // cause if we put 2 fetch cvs and msg separately into 2 comp: Chats and Message (respectively),
  // a error will happen with refetch token, when first call will make refresh token of second call unauthorized
  // so I put 2 call in here, in one comp and make them sequence
  const runFetchMsg = useRef(false);
  useEffect(() => {
    dispatch(selectTypeOfCvs({ chatType: chatTypes.DIRECT_CHAT }));

    const fetchCvsAndMsg = async () => {
      const onSuccess = (res) => {
        const numberOfPages = res?.headers?.["x-pagination"];
        dispatch(
          setCurrentMsgs({
            type: chatTypes.DIRECT_CHAT,
            messages: res.data.data,
          })
        );
        dispatch(
          setNumOfPage({
            type: chatTypes.DIRECT_CHAT,
            numOfPage: Number(numberOfPages),
          })
        );
      };
      try {
        // i put this in useEffect with dep is currentCvsId when this run one when mount instead of dep being []
        // cause if put this in useEffetc with dep being [],
        // when currentCvsId change, we need another useEffect with dep is currentCvsId with a call fetchMsg when currentCvsId change
        // while in useEffetc with dep being [], we call both fetchCvs and fetchMsg,
        // it is difficult to make sure that the useEffect with dep is currentCvsId is run only when user click to chatElement to change current cvs
        // not when mount as useEffetc with dep being [],
        // i already try to count the render but it not work

        // make sure that fetch cvs only one when mount
        if (!runFetchCvs.current) {
          await callAction(fetchConversations({ type: chatTypes.DIRECT_CHAT }));
          runFetchCvs.current = true;
        }
        if (currentCvsId) {
          await callAction(
            fetchMessages({
              data: {
                type: chatTypes.DIRECT_CHAT,
                conversationId: currentCvsId,
                page: 1,
              },
              onSuccess,
            })
          );
          runFetchMsg.current = true;
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

  let content;
  // remember not use this if else case cause when loading for 2 fetch,
  // it will unmount Conversation and Messages, thus clear all interceptor
  // thus get error in second fetch
  // if (isLoading) {
  //   content = <LoadingScreen />;
  // } else if (isError) {
  //   content = <Typography>Some thing wrong</Typography>;
  // } else {
  content = (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Chats />
      {/* <DirectMsgs /> */}
      <Conversation handleBack={handleBack} />
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
  // }
  return content;
};

export default DirectChat;
