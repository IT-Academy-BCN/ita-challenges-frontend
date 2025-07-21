## CHANGELOG

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [ita-challenges-frontend-3.1.56-RELEASE] - 2025-07-21

### Added
- Integrated real endpoint to fetch a related challenge from other one using a service (Taiga [#600], PR [#676]).
### [ita-challenges-frontend-3.1.55-RELEASE] - 2025-07-21

### Added
- Added button to open the register modal on mobile and text in the three languages (Taiga [#578], PR [#661])

### [ita-challenges-frontend-3.1.54-RELEASE] - 2025-07-21

### Added
- Display visual indicators of each challenge's solution status (e.g., 'In progress', 'Completed') using the data from the user's solution map. (Taiga [#549], PR [#664])

### [ita-challenges-frontend-3.1.53-RELEASE] - 2025-07-16

### Added
- Fetch and store user challenge solution statuses to enable UI updates based on progress. (Taiga [#573], PR [#663])

### [ita-challenges-frontend-3.1.52-RELEASE] - 2025-07-16

### Changed
- Allow students to save a partial solution and continue editing it later. When returning to a challenge with a saved draft, the editor loads the user’s previous progress instead of the mentor’s solution. (Taiga [#547], PR [#662])

### [ita-challenges-frontend-3.1.51-RELEASE] - 2025-07-04

### Added
- Added the interface for the user regeister modal (Taiga [#554], PR [#658])

### [ita-challenges-frontend-3.1.50-RELEASE] - 2025-06-27

### Changed
- I changed the breadcrumb for a link that redirects to challenges list. imported an existing svg instead of using the whole svg code in html file  (Taiga [#574], PR [#665])
### [ita-challenges-frontend-3.1.49-RELEASE] - 2025-06-27

### Changed
- Modified sidebar menu. Now appears missing components according figma's document (Taiga [#577], PR [#668])
### [ita-challenges-frontend-3.1.48-RELEASE] - 2025-06-27

### Changed
- Icons corrected postition according figma's document: at the list of challenges and the description of challenges (Taiga [#576], PR [#667])
### [ita-challenges-frontend-3.1.47-RELEASE] - 2025-06-27
### Changed
- Updated the Save button style According Figma's document using the Style.css component (Taiga [#575], PR [#666])

### [ita-challenges-frontend-3.1.46-RELEASE] - 2025-06-27

### Changed
- Reviewed the entire mentor workflow (ADMIN role): ensured no console or network errors across mentor views and improved visual consistency according to design (Taiga [#529], PR [#653])

### [ita-challenges-frontend-3.1.45-RELEASE] - 2025-06-25

### Fixed
- Hide "Start challenge" button when the user role is ADMIN (Taiga [#527], PR [#651])

### [ita-challenges-frontend-3.1.44-RELEASE] - 2025-06-25

### Fixed
- Removed console errors in challenge views (Taiga [#528], PR [#652])

### [ita-challenges-frontend-3.1.43-RELEASE] - 2025-06-21

### Changed
- Refactored `ChallengeHeaderComponent` to remove localStorage usage for user solutions and use backend status instead (Taiga [#518], PR [#650]).
- Prevented students from submitting or saving a challenge if a solution has already been submitted. Display a “Solution submitted” message when applicable (Taiga [#518], PR [#650]).

### [ita-challenges-frontend-3.1.42-RELEASE] - 2025-06-20

### 🆕 Added
- Integrated real endpoint to fetch tags by languageId in challenge form (Taiga [#477], PR [#647]).

### [ita-challenges-frontend-3.1.41-RELEASE] - 2025-06-16

### Added
- Implemented `CustomDatePipe` to format challenge creation dates in short format for Catalan, Spanish, and English (Taiga [#497], PR [#649]).

### Changed
- Updated challenge-card and challenge-header components to use the new pipe (Taiga [#497], PR [#649]).


### [ita-challenges-frontend-3.1.40-RELEASE] - 2025-06-16

### Fixed
- Fixed multiple initializations of CodeMirror in editor-challenge and removed localStorage retrieval (Taiga [#509], PR [#646])

### [ita-challenges-frontend-3.1.39-RELEASE] - 2025-06-16

### Fixed
- Prevented function execution in solution-tab before userId is available, improved error handling in service, and fixed UI display issues (Taiga [#512], PR [#648])

### [ita-challenges-frontend-3.1.38-RELEASE] - 2025-06-16

### Changed
- Added translation support to challenge-form: replaced static text with translation keys and updated language JSONs (Taiga [#503], PR [#645])

### [ita-challenges-frontend-3.1.37-RELEASE] - 2025-06-16

### Changed
- Visual refactor of icons in `challenge-card` (rocket icon, hover effects, and layout reorder). (Taiga [#487], PR [#638])

### [ita-challenges-frontend-3.1.36-RELEASE] - 2025-06-10

### Fixed
- Configuration for SonarCloud compatibility: added sonar-project.properties with coverage paths and exclusions (Taiga [#493], PR [#641])
- Fixed missing braces in en.json and es.json (Taiga [#492], PR [#642])

### Changed
- Refactored challenge-form service and component to load tags based on selected language (Taiga [#470], PR [#637])
- Visual refactor of icons in `challenge-header` (rocket icon, hover effects, tooltip, and layout reorder). (Taiga [#471], PR [#640])

### [ita-challenges-frontend-3.1.35-RELEASE] - 2025-05-28

- [Added] 

- Toggle Switch role (#400)
- Added logic to allow user role switching (#401)
- Add redirection upon user role switching (#402)
- Automatic redirection upon token expiration (#422)
- show times solved counter in the challenge list and detail (#389)
- Submit solution and update solved counter (#389)
- display user bookmarks on login (#432)
- remove bookmark count (#431)
- Show user solution (mock) alongside mentor solution in completed challenges (#424)
- load user solution from endpoint instead of mock (#423)
- adjust solution.component.css to match Figma design (#425)
- Added user's photo (#433)

### [ita-challenges-frontend-3.1.34-RELEASE] - 2025-05-15 (feature#329)

- Cleanup pagination logic

- Mentors can like/unlike challenges and view their liked challenges and see number of likes on each challenge. 

- "Volver a retos" link added

- "Popularidad" filter logic

### [ita-challenges-frontend-3.1.33-RELEASE] (2025-04-10) (fix#261)

- Remove examples and notes sections from challenge info component

### [ita-challenges-frontend-3.1.32-RELEASE] (2025-04-10) (feature#571)

- Added logout functionality

### [ita-challenges-frontend-3.1.31-RELEASE] (2024-11-20) (feature#480)

- Several corrections

### [ita-challenges-frontend-3.1.30-RELEASE] (2024-11-20) (feature#472)

- Fix sending solution after login


### [ita-challenges-frontend-3.1.29-RELEASE] (2024-11-20) (feature#463)

- Navigation after login

### [ita-challenges-frontend-3.1.28-RELEASE] (2024-11-19) (feature#438)

- Creation of Mobile Navigation Menu

### [ita-challenges-frontend-3.1.27-RELEASE] (2024-11-14) (feature#479)

- Angular Bootstrap updated from 16.0.0 to 17.0.1

### [ita-challenges-frontend-3.1.26-RELEASE] (2024-11-14) (feature#475)

- Refactoring: Fixed wrong names of config vars

### [ita-challenges-frontend-3.1.25-RELEASE] (2024-11-14) (feature#475)

- Fixed breadcrumb translation

### [ita-challenges-frontend-3.1.24-RELEASE] (2024-11-14) (feature#449)

- Fixed load of the challenge list

### [ita-challenges-frontend-3.1.23-RELEASE] (2024-11-14) (feature#468)

- Fixed error ordination icon

### [ita-challenges-frontend-3.1.22-RELEASE] (2024-11-11) (feature#464)

- Fixed error translation on Challenge 'Isograms'

### [ita-challenges-frontend-3.1.21-RELEASE] (2024-11-04) (feature#271)

- Dropdown menu in the ChallengeInfoComponent mobile version with Details, Solutions, Resources, Related


### [ita-challenges-frontend-3.1.0-RELEASE] (2024-11-04) (feature#271)

- Solution tab redirection.
- View accepted solutions.
- It is detected if the user has already sent a solution.

### [ita-challenges-frontend-3.1.19-RELEASE] 2024-10-30 (feature#439)

- Set buttons sizing at resolutions lower than 1024px

### [ita-challenges-frontend-3.1.18-RELEASE] 2024-10-30 (feature#439)

- Change breakpoint for Filter Button

### [ita-challenges-frontend-3.1.17-RELEASE]

* Added link to breadcrumb in challenge screen

### [ita-challenges-frontend-3.1.16-RELEASE]

* Included scroll into Challenge Screen [Mobile Version]

### [ita-challenges-frontend-3.1.15-RELEASE]

* Fix TS version over CI

### [ita-challenges-frontend-3.1.13-RELEASE]

* Hide progression filter if user is not logged in

### [ita-challenges-frontend-3.1.10-RELEASE]

- Capture user solution 

### [ita-challenges-frontend-3.1.9-RELEASE] - 2024-10-08 (feature#300)

- Refactoring: Creación de User Service

### [ita-challenges-frontend-3.1.8-RELEASE]
- Several fixes in challenges screen

### [ita-challenges-frontend-3.1.7-RELEASE] 

- Added scroll by overflow
  

### [ita-challenges-frontend-3.1.6-RELEASE]

- Fixed filters at responsive mode.

### [ita-challenges-frontend-3.1.5-RELEASE]

- Reviewing of icons difficulty-off/on 

### [ita-challenges-frontend-3.1.4-RELEASE]

- Reviewing of Challenge Screen & functionalities

### [ita-challenges-frontend-3.1.3-RELEASE] - 2024-09-26 (feauture#405)

- Refactoring: huge mocks must be externalized from tests.

### [ita-challenges-frontend-3.1.2-RELEASE] - 2024-09-26 (feauture#408)

- Tooltip is not translated.

### [ita-challenges-frontend-3.1.0-RELEASE]

- Added pipe to escape java characters to json.

### [ita-challenges-frontend-3.0.6-RELEASE]

- i18n of send-solution-modal

### [ita-challenges-frontend-3.0.4-RELEASE]

- Optimized size and build process.

### [ita-challenges-frontend-3.0.3-RELEASE]

- Ugraded to Angular 18
- Fixed package destination folder, in Angular 18 the destination folder is dist/ita-challenges-frontend/browser

### [ita-challenges-frontend-2.14.0-RELEASE] - 2024-06-04 (feature#355)

- New Header

### [ita-challenges-frontend-2.13.1-RELEASE] - 2024-05-16 (feature#328)

- Verified component display with /register true 

### [ita-challenges-frontend-2.13.0-RELEASE] - 2024-05-15 (feature#331)

- Add filter methods and implement page navigation with filters and sort filters

### [ita-challenges-frontend-2.12.2-RELEASE] - 2024-05-14 (feature#337)

- Link to challenges in related challenges fixed

### [ita-challenges-frontend-2.12.1-RELEASE] - 2024-05-14 (feature#328)

- Fix: avoided secure invocation of window.crypto object. It's necessary execute
  it over secure environment (https or ServiceWorker).

### [ita-challenges-frontend-2.12.0-RELEASE] - 2024-05-13 (feature#215)

- Link Related

### [ita-challenges-frontend-2.11.0-RELEASE] - 2024-05-07 (feature#293)

- Add order method for creation_date. Implement the formatDatePipe"

### [ita-challenges-frontend-2.10.3-RELEASE] - 2024-05-07

- Changing URL ita-wiki

### [ita-challenges-frontend-2.10.2-RELEASE] - 2024-05-07

- Relative paths to image optimized. Internationalization of language literals.

### [ita-challenges-frontend-2.10.0-RELEASE] - 2024-05-05

- Refactoring auth.service & token.service

### [ita-challenges-frontend-2.9.0-RELEASE] - 2024-04-29

- Fix slow load and add pagination

### [ita-challenges-frontend-2.8.3-RELEASE] - 2024-04-25

- Fixing auth.service in challenge-header and challenge info.

### [ita-challenges-frontend-2.8.1-RELEASE] - 2024-04-23

- Link resources-card

### [ita-challenges-frontend-2.8.0-RELEASE] - 2024-04-23

- Added encryption cookies helper.

### [ita-challenges-frontend-2.7.2-RELEASE] - 2024-04-23

- Link resources-card

### [ita-challenges-frontend-2.7.1-RELEASE] - 2024-04-22

- Left menu adaptation

### [ita-challenges-frontend-2.7.0-RELEASE] - 2024-04-09

- New changes on challenge-header button and styles.

### [ita-challenges-frontend-2.6.0-RELEASE] - 2024-04-18

- Added dynamic translation pipe

### [ita-challenges-frontend-2.5.0-RELEASE] - 2024-04-18

- Register/Login placeholders adaptation

### [ita-challenges-frontend-2.3.1-RELEASE] - 2024-04-17

- Included ESLint into development

### [ita-challenges-frontend-2.3.0-RELEASE] - 2024-04-02

- Add encryption cookies helper.

### [ita-challenges-frontend-2.2.0-RELEASE] - 2024-04-08

- Challenge lists translates

### [ita-challenges-frontend-2.0.71-RELEASE] - 2024-04-02

- Delete iteneraries service and implement the method on chalenges.service

### [ita-challenges-frontend-2.0.68-RELEASE] - 2024-03-20

- Add responsiveness to challenge filters modal

### [ita-challenges-frontend-2.0.72-RELEASE] - 2024-04-03

- Added responsiveness to login and register modals.

### [ita-challenges-frontend-2.0.70-RELEASE] - 2024-03-21

- Challenge list translates

### [ita-challenges-frontend-2.0.69-RELEASE] - 2024-03-07

- Adapt mobile-nav to Figma"

### [ita-challenges-frontend-2.0.60-RELEASE] - 2024-03-07

- Change rename environment and delete dummy variables name"

### [ita-challenges-frontend-2.0.53-RELEASE] - 2024-03-07

- Translate login, register and validator service

### [ita-challenges-frontend-2.0.58-RELEASE] - 2024-03-12

- Login error msg

### [ita-challenges-frontend-2.0.52-RELEASE] - 2024-02-29

- Fixing register and login basic functionalities

### [ita-challenges-frontend-2.0.51-RELEASE] - 2024-02-29

- Fixing nginx.conf to find assets folder

### [ita-challenges-frontend-2.0.46-RELEASE] - 2024-02-28

- Add 2.2.4 and 9 to GUIDELINES_CA.md

### [ita-challenges-frontend-2.0.45-RELEASE] - 2024-02-28

- CI enabled
