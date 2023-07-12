export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  BACKEND_BASE_URL: 'http://localhost:3000/ita-challenges/api',
  BACKEND_ALL_CHALLENGES: '/challenges',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  
};
export const pageSize:number = 8;
