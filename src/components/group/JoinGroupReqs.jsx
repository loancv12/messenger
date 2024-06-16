import { useContext, useEffect, useState } from "react";
import JoinGroupReqItem from "./JoinGroupReqItem";
import { useDispatch, useSelector } from "react-redux";
// import { socket } from "../../socket";
import { Dialog, Grid, Paper, Stack, Typography, styled } from "@mui/material";
import { selectJoinGroupReqs } from "../../redux/conversation/conversationSlice";
import GridItem from "../GridItem";
import toCamelCase from "../../utils/toCamelCase";
import useLocales from "../../hooks/useLocales";
import { fetchJoinGroupReqs } from "../../redux/conversation/conversationApi";
import { SocketContext } from "../../contexts/SocketProvider";

const JoinGroupReqs = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const joinGroupReqs = useSelector(selectJoinGroupReqs);
  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchJoinGroupReqs());
  }, []);

  const handleAccept = (id) => {
    console.log("emit accept_join_group", id);
    socket.emit("accept_join_group", { groupId: id });
    handleClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        keepMounted
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 0 }}
        >
          <Grid item xs={5}>
            <GridItem>
              <Typography variant="subtitle2">
                {translate(`groupCvs.${toCamelCase("Sender")}`)}
              </Typography>
            </GridItem>
          </Grid>
          <Grid item xs={4}>
            <GridItem>
              <Typography variant="subtitle2">
                {translate(`groupCvs.${toCamelCase("Group Name")}`)}
              </Typography>
            </GridItem>
          </Grid>
          <Grid item xs={3}>
            <GridItem>
              <Typography variant="subtitle2"></Typography>
            </GridItem>
          </Grid>

          {joinGroupReqs.length ? (
            joinGroupReqs.map((request, i) => {
              return (
                <JoinGroupReqItem
                  key={i}
                  {...request}
                  handleAccept={handleAccept}
                />
              );
            })
          ) : (
            <Grid item xs={12}>
              <GridItem>
                <Typography variant="subtitle2">
                  {translate(
                    `groupCvs.${toCamelCase("Not have join group req")}`
                  )}
                </Typography>
              </GridItem>
            </Grid>
          )}
        </Grid>
      </Dialog>
    </>
  );
};

export default JoinGroupReqs;
