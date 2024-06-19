import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import CenterScreenLayout from "../layouts/main";
import RequiredAuth from "../components/auth/RequiredAuth";
import Home from "../pages/Home";
import SocketProvider from "../contexts/SocketProvider";
import PersistLogin from "../components/auth/PersistLogin";

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
                { path: "app", element: <DirectChatPage /> },
                {
                  path: "group",
                  element: <GroupPage />,
                },
                { path: "settings", element: <Settings /> },
                { path: "profile", element: <ProfilePage /> },
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
