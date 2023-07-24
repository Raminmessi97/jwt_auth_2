import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { logout } from '../features/userSlice';

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api/`;

// Create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const accessToken = getAccessTokenFromCookie();

  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  // if (typeof args !== 'string') {
  //   args.headers = {
  //     ...args.headers,
  //     Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGJlYzFhY2NjYjdkNzJmMmNkZjZlMWEiLCJpYXQiOjE2OTAyMjQxMjksImV4cCI6MTY5MDIyNTkyOX0.Bd4xwWX_SY4N-CxtIGn65ptwgrERmGWEmmRTRWYubxtp8wBU03LVNwg49LsKr8j7XsyIoxaZfVZJzdLuh_r2lJDt2V7kYYrREeI65ekRL9qoGHixAmvqKZ2Vw-IkNZ9ypiLkL9QkZenPuYhY55Azunc_yipiCkIF2tb1rMpp-ySUOS2cEAi_ChFEirlpRQa-212SNoMfB2bCpvgAV6IRJS-kwgPG7bzENOs5jnYTp4Re4WLPg-tZBnYUXAY_oDcxjr2_MqzFEaervWv0bMg5hJ3x3SkBI71SYvNqJlw-XucHjEiXR99yVCD_qKglWVcs6SIu1_ylvVoS4ovX_SpSaA`,
  //   };
  // }
  let result = await baseQuery(args, api, extraOptions);
  if ((result.error?.data as any)?.message === 'You are not logged in') {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { credentials: 'include', url: 'auth/refresh' },
          api,
          extraOptions
        );


        if (refreshResult.data) {
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          window.location.href = '/login';
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {

  // Add the access token to the request headers
       

      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

function getAccessTokenFromCookie() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return value;
    }
  }
  return null;
}

export default customFetchBase;
