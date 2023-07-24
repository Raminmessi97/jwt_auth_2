import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import FullScreenLoader from '../components/FullScreenLoader';
import { userApi } from '../redux/api/userApi';
import { useNavigate } from 'react-router-dom';

type IAuthMiddleware = {
  children: React.ReactElement;
};

const AuthMiddleware: React.FC<IAuthMiddleware> = ({ children }) => {
  // const [cookies] = useCookies(['logged_in']);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()

  // useEffect(() => {
  //   console.log('cookies',cookies.logged_in);
    
  //   setIsLoggedIn(cookies.logged_in ?? false);
  // }, [cookies]);

  const { data,isLoading } = userApi.endpoints.getMe.useQuery(null);

  if (isLoading) {
    return <FullScreenLoader />;
  }
  
  // if (data) {
  //   navigate('/home');
  //   return null;
  // }

  



  return children;
};

export default AuthMiddleware;
