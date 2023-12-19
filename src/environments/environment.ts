export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  BACKEND_ITA_CHALLENGE_BASE_URL: '/itachallenge/api/v1',
  BACKEND_ITA_WIKI_BASE_URL: 'https://dev.sso.itawiki.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES: '/challenge/challenges',
  BACKEND_REGISTER: '/auth/register',
  BACKEND_DUMMY_REGISTER: '../assets/dummy/user-register.json',
  BACKEND_LOGIN:'/auth/login',
  BACKEND_DUMMY_LOGIN: '../assets/dummy/user-login.json',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8,
  BACKEND_DUMMY_SOLUTION :'../assets/dummy/challenge.json'
};
