export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  BACKEND_ITA_CHALLENGE_BASE_URL: '/itachallenge/api/v1',
  BACKEND_ITA_SSO_BASE_URL: 'https://dev.sso.itawiki.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES_URL: '/challenge/challenges',
  BACKEND_SSO_LOGIN_URL:'/auth/login',
  BACKEND_SSO_POST_USER:'/users/me',
  BACKEND_SSO_REGISTER_URL: '/auth/register',
  BACKEND_SSO_RESOURSES:'/resources',
  BACKEND_SSO_VALIDATE_TOKEN_URL:'/tokens/validate',
  ITINERARY_ID: "clpb8t1cc000008k0cg1icvl4",
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8,
  BACKEND_DUMMY_SOLUTION :'../assets/dummy/challenge.json'
};
