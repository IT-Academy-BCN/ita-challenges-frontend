import { version } from '../../package.json'

export const environment = {
  production: false,
  appVersion: version,
  BACKEND_ITA_CHALLENGE_BASE_URL: '/itachallenge/api/v1',
  BACKEND_ITA_SSO_BASE_URL: 'https://dev.sso.itawiki.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES_URL: '/challenge/challenges',
  BACKEND_SSO_ITINERARIES: '/itineraries',
  BACKEND_SSO_LOGIN_URL: '/auth/login',
  BACKEND_SSO_POST_USER: '/users/me',
  BACKEND_SSO_PATCH_USER: '/users',
  BACKEND_SSO_REGISTER_URL: '/auth/register',
  BACKEND_SSO_RESOURCES: '../assets/dummy/resources.json',
  BACKEND_SSO_SOLUTION: '../assets/dummy/challenge.json',
  BACKEND_SSO_VALIDATE_TOKEN_URL: '/tokens/validate',
  ADMIN_USER: '../assets/dummy/admin-user.json',
  ITINERARY_ID: 'clpb8t1cc000008k0cg1icvl4',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8
}
