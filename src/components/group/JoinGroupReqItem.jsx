import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import GridItem from "../GridItem";

const JoinGroupReqItem = ({ id, sender, group, handleAccept }) => {
  const theme = useTheme();
  return (
    <>
      <Grid item xs={5}>
        <GridItem>
          <Typography variant="subtitle2">{`${sender.firstName} ${sender.lastName}`}</Typography>
        </GridItem>
      </Grid>
      <Grid item xs={4}>
        <GridItem>
          <Typography variant="subtitle2">{group.name}</Typography>
        </GridItem>
      </Grid>
      <Grid item xs={3}>
        <GridItem>
          <Button
            onClick={() => {
              handleAccept(id);
            }}
          >
            Join
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};
export default JoinGroupReqItem;
