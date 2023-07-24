import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { userApi } from "../redux/api/userApi";
import FullScreenLoader from "./FullScreenLoader";
import { useAppSelector } from "../redux/store";

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const [cookies] = useCookies(["logged_in"]);
  const location = useLocation();
  const user = useAppSelector((state) => state.userState.user);
  console.log('re',user);

  // const { isLoading, isFetching } = userApi.endpoints.getMe.useQuery(null, {
  //   skip: false,
  //   refetchOnMountOrArgChange: true,
  // });

  // const loading = isLoading || isFetching;

 const { data, isLoading, isFetching } = userApi.endpoints.getMe.useQueryState(null, {
  selectFromResult: ({ data, isLoading, isFetching }) => ({ data, isLoading, isFetching }),
});

  // if (loading) {
  //   return <FullScreenLoader />;
  // }

  return (cookies.logged_in || data) &&
    allowedRoles.includes(data?.role as string) ? (
    <Outlet />
  ) : cookies.logged_in && data ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireUser;
