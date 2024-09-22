// routes
import { Alert, Snackbar } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CallConfirm from "./components/call/CallConfirm";
import LoadingScreen from "./components/common/LoadingScreen";
import { closeSnackbar, selectCallConfirm } from "./redux/app/appSlice";
import Router from "./routes";
import askNotificationPermission from "./services/notification";
import ThemeProvider from "./theme";
import ThemeSettings from "./theme/settings";
import { history } from "./utils/history";

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

  const clientId = import.meta.env.VITE_CLIENT_ID;

  history.navigate = useNavigate();
  history.location = useLocation();
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <ThemeProvider>
          <ThemeSettings>
            <GoogleOAuthProvider clientId={clientId}>
              <Router />
            </GoogleOAuthProvider>
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
