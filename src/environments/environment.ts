import packageInfo from '../../package.json'

export const environment = {
  production: false,
  appVersion: packageInfo.version,
  BACKEND_ITA_CHALLENGE_BASE_URL: '/itachallenge/api/v1',
  BACKEND_ITA_SSO_BASE_URL: 'https://dev.sso.itawiki.eurecatacademy.org/api/v1',
  BACKEND_ITA_WIKI_BASE_URL: 'https://dev.api.itadirectory.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES_URL: '/challenge/challenges',
  BACKEND_SSO_ITINERARIES: '/itineraries',
  BACKEND_SSO_LOGIN_URL: '/auth/login',
  BACKEND_SSO_POST_USER: '/users/me',
  BACKEND_SSO_PATCH_USER: '/users',
  BACKEND_SSO_REGISTER_URL: '/auth/register',
  BACKEND_SSO_RESOURCES: '/resources',
  BACKEND_SSO_SOLUTION: '../assets/dummy/challenge.json',
  BACKEND_SSO_VALIDATE_TOKEN_URL: '/tokens/validate',
  ADMIN_USER: '../assets/dummy/admin-user.json',
  ITINERARY_ID: 'clpb8t1cc000008k0cg1icvl4',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8,
  SECRET_PASSWORD:'985a459f34645aec05f978bfda43aebd2212f70542d3100e16c862c0f329d323',
  HTTP_CODE_SUCCESS: 200,
  HTTP_CODE_BAD_REQUEST: 400,
  HTTP_CODE_UNAUTHORIZED: 401,
  HTTP_CODE_FORBIDDEN: 403
}
