// routes
import Router from "./routes";
import ThemeSettings from "./components/settings";
import ThemeProvider from "./theme";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar, selectCallConfirm } from "./redux/app/appSlice";
import SocketProvider from "./contexts/SocketProvider";
import { Suspense, useEffect } from "react";
import LoadingScreen from "./components/common/LoadingScreen";
import askNotificationPermission from "./services/notification";
import AuthProvider from "./contexts/AuthProvider";
import CallConfirm from "./components/call/CallConfirm";

const vertical = "bottom";
const horizontal = "center";

function App() {
  const {
    open: snackbarOpen,
    message,
    severity,
  } = useSelector((state) => state.app.snackbar);

  const {
    open: callConfirmOpen,
    roomId,
    senderId,
  } = useSelector(selectCallConfirm);
  const dispatch = useDispatch();
  useEffect(() => {
    askNotificationPermission();
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <ThemeProvider>
          <ThemeSettings>
            {/* <AuthProvider> */}
            {/* <SocketProvider> */}
            <Router />
            {/* </SocketProvider> */}
            {/* </AuthProvider> */}
          </ThemeSettings>
        </ThemeProvider>
      </Suspense>
      {message && snackbarOpen ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={snackbarOpen}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={(e) => {
            dispatch(closeSnackbar());
          }}
        >
          <Alert
            onClose={(e) => {
              dispatch(closeSnackbar());
            }}
            severity={severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : null}
      {callConfirmOpen && roomId && senderId ? (
        <CallConfirm {...{ callConfirmOpen, roomId, senderId }} />
      ) : null}
    </>
  );
}

export default App;
