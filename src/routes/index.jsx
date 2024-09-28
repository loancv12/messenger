import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import PersistLogin from "../components/auth/PersistLogin";
import PreventLoginAgain from "../components/auth/PreventLoginAgain";
import RequiredAuth from "../components/auth/RequiredAuth";
import CallRoom from "../components/call/CallRoom";
import { FullScreen } from "../components/call/FullScreen";
import WaitRoom from "../components/call/WaitRoom";
import LoadingScreen from "../components/common/LoadingScreen";
import NoCvs from "../components/conversation/NoCvs";
import { DEFAULT_PATH } from "../config";
import SocketProvider from "../contexts/SocketProvider";
import CenterScreenLayout from "../layouts/main";
import { chatTypes } from "../redux/config";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <CenterScreenLayout />,
      children: [
        {
          element: <PreventLoginAgain />,
          children: [
            {
              element: <LoginPage />,
              path: "login",
            },
            {
              element: <RegisterPage />,
              path: "register",
            },
            {
              element: <VerifyPage />,
              path: "verify",
            },
            {
              element: <ForgotPasswordPage />,
              path: "forgot-password",
            },
            {
              element: <ResetPasswordPage />,
              path: "reset-password",
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <PersistLogin />,
      children: [
        {
          element: <RequiredAuth />,
          children: [
            {
              element: (
                <SocketProvider>
                  <DashboardLayout />
                </SocketProvider>
              ),
              children: [
                {
                  element: <Navigate to={DEFAULT_PATH} replace />,
                  index: true,
                },
                {
                  path: "direct-chat",
                  element: <DirectChatPage />,
                  children: [
                    { index: true, element: <NoCvs /> },

                    {
                      path: ":cvsId",
                      element: (
                        <Conversation chatType={chatTypes.DIRECT_CHAT} />
                      ),
                    },
                  ],
                },
                {
                  path: "group-chat",
                  element: <GroupPage />,
                  children: [
                    { index: true, element: <NoCvs /> },

                    {
                      path: ":cvsId",
                      element: <Conversation chatType={chatTypes.GROUP_CHAT} />,
                    },
                  ],
                },
                {
                  path: "call",
                  element: <FullScreen />,
                  children: [
                    {
                      path: ":roomId/wait-room",
                      element: <WaitRoom />,
                    },
                    {
                      path: ":roomId/call-room",
                      element: <CallRoom />,
                    },
                  ],
                },
                {
                  path: "settings",
                  element: <Settings />,
                  children: [
                    {
                      path: "adjust-theme",
                      element: <AdjustTheme />,
                    },
                    {
                      path: "shortcuts",
                      element: <Shortcuts />,
                    },
                  ],
                },
                {
                  path: "profile",
                  element: <ProfilePage />,
                },
              ],
            },
          ],
        },
      ],
    },
    { path: "/404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" /> },
  ]);
}

const Settings = Loadable(lazy(() => import("../pages/dashboard/setting")));
const AdjustTheme = Loadable(
  lazy(() => import("../components/settingParts/AdjustTheme"))
);
const Shortcuts = Loadable(
  lazy(() => import("../components/settingParts/Shortcuts"))
);

const GroupPage = Loadable(lazy(() => import("../pages/dashboard/group")));
const DirectChatPage = Loadable(
  lazy(() => import("../pages/dashboard/directChat"))
);
const Conversation = Loadable(lazy(() => import("../components/conversation")));

const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/profile")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));

const ForgotPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ForgotPassword"))
);
const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
