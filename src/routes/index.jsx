import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/common/LoadingScreen";
import CenterScreenLayout from "../layouts/main";
import RequiredAuth from "../components/auth/RequiredAuth";
import SocketProvider from "../contexts/SocketProvider";
import PersistLogin from "../components/auth/PersistLogin";
import NoCvs from "../components/conversation/NoCvs";
import { dynamics, generalPath, path, specificPath } from "./paths";
import { chatTypes } from "../redux/config";
import CacheProvider from "../contexts/CacheProvider";
import CallRoom from "../components/call/CallRoom";
import { FullScreen } from "../components/call/FullScreen";
import WaitRoom from "../components/call/WaitRoom";
import Test from "../components/call/Test";
import PreventLoginAgain from "../components/auth/PreventLoginAgain";

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
              element: <ResetPasswordPage />,
              path: "reset-password",
            },
            {
              element: <NewPasswordPage />,
              path: "new-password",
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
                <CacheProvider>
                  <SocketProvider>
                    <DashboardLayout />
                  </SocketProvider>
                </CacheProvider>
              ),
              children: [
                {
                  element: <Navigate to={DEFAULT_PATH} replace />,
                  index: true,
                },
                {
                  path: generalPath[chatTypes.DIRECT_CHAT],
                  element: <DirectChatPage />,
                  children: [
                    { index: true, element: <NoCvs /> },

                    { path: dynamics.cvs, element: <Conversation /> },
                  ],
                },
                {
                  path: generalPath[chatTypes.GROUP_CHAT],
                  element: <GroupPage />,
                  children: [
                    { index: true, element: <NoCvs /> },

                    { path: dynamics.cvs, element: <Conversation /> },
                  ],
                },
                {
                  path: generalPath.call,
                  element: <FullScreen />,
                  children: [
                    {
                      path: path(dynamics.call, specificPath.waitRoom),
                      element: <WaitRoom />,
                    },
                    {
                      path: path(dynamics.call, specificPath.callRoom),
                      element: <CallRoom />,
                    },
                  ],
                },
                { path: generalPath.setting, element: <Settings /> },
                {
                  path: generalPath.profile,
                  element: <ProfilePage />,
                },
                // { path: "*", element: <Navigate to="/404" replace /> },
              ],
            },
          ],
        },
      ],
    },
    { path: "/404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const Settings = Loadable(lazy(() => import("../pages/dashboard/setting")));
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/group")));
const DirectChatPage = Loadable(
  lazy(() => import("../pages/dashboard/directChat"))
);
const Conversation = Loadable(lazy(() => import("../components/conversation")));

const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/profile")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));

const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);
const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPassword"))
);
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
