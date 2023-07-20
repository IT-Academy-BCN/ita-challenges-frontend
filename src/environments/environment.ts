export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  BACKEND_BASE_URL: 'http://localhost:3000/ita-challenges/api',
  BACKEND_SEND_SOLUTION: '/send-solution', //inventat, ens ho han de dir des de backend
  BACKEND_ALL_CHALLENGES: '/challenges',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8
};
