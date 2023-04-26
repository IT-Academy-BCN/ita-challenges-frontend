export const environment = {
  production: false,
  BACKEND_BASE_URL: '/businessassistantbcn/api/v1',
  BACKEND_LOGIN_URL: '/login',
  BACKEND_REGISTER_URL: '/usermanagement/user',
  BACKEND_ZONES_URL: '/common/bcn-zones',
  BACKEND_LARGE_STABLISHMENTS_ACTIVITIES_URL: '/opendata/large-establishments/activities',
  BACKEND_LARGE_STABLISHMENTS_SEARCH_URL: '/opendata/large-establishments/search',
  BACKEND_COMMERCIAL_GALLERIES_ACTIVITIES_URL: '/opendata/commercial-galleries/activities',
  BACKEND_COMMERCIAL_GALLERIES_SEARCH_URL: '/opendata/commercial-galleries/search',
  BACKEND_BIG_MALLS_ACTIVITIES_URL: '/opendata/big-malls/activities',
  BACKEND_BIG_MALLS_SEARCH_URL: '/opendata/big-malls/search',
  BACKEND_MARKET_FAIRS_URL: '/opendata/market-fairs',
  BACKEND_MUNICIPAL_MARKETS_SEARCH_URL: '/opendata/municipal-markets/search',
  BACKEND_MARKET_FAIRS_SEARCH_URL: '/opendata/market-fairs/search',
  BACKEND_SAVED_SEARCHES_URL: '/mydata/mysearches/',
  //mapbox
  MAPBOX_TOKEN: 'pk.eyJ1IjoianZyZnJlZWxhbmNlZGV2ZWxvcGVyIiwiYSI6ImNreTl4czUzMTAwNGQydnFsdmRhYXRvbDUifQ.TVL-2T184QdfXbze6VNw4A',
  MAPBOX_ZOOM: 8,
  MAPBOX_STYLE: 'mapbox://styles/mapbox/streets-v11',
  MAPBOX_COORDINATES_FORMAT: 'GCS',
  //jwt
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVlYmVybWVuc2NoQHphcmF0aHVzdHJhLmNvbSIsInBhc3N3b3JkIjoiTDJtbnh1cX1eWiNyQWg3XUooXm9pQCU0QDosRXZmLVYiLCJhdXRob3JpdGllcyI6WyJTVVBFUlVTRVIiXSwiaWF0IjoxNjY5MTM1MjAzfQ.ySbRr7yOZcTwfOux1oitmNUfrM6omb-ky64fGrrqngk',
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.