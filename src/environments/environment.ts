export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  BACKEND_ITA_CHALLENGE_BASE_URL: 'http://dev.ita-challenges.eurecatacademy.org:9080/itachallenge/api/v1',
  BACKEND_ITA_WIKI_BASE_URL: 'https://dev.sso.itawiki.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES: '/challenge/challenges',
  BACKEND_REGISTER: '/auth/register',
  BACKEND_SSO_REGISTER: '../assets/dummy/user-register.json',
  BACKEND_LOGIN:'/auth/login',
  BACKEND_SSO_LOGIN: '../assets/dummy/user-login.json',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8,
  BACKEND_DUMMY_SOLUTION :'../assets/dummy/challenge.json',
  CHALLENGE_ID: '2bfc1a9e-30e3-40b2-9e97-8db7c5a4e9e4'
};


