# Guia d'estil de l'IT-Challenge

## Índex

1. [**ENLLAÇOS DEL PROJECTE**](#1-enllaços-del-projecte)\
   1.1 [Enllaços del projecte](#11-enllaços-del-projecte) 

2. [**PROCEDIMENTS DE TREBALL**](#2-procediments-de-treball)\
   2.1 [Primeres tasques a realitzar en el projecte](#21-primeres-tasques-a-realitzar-en-el-projecte)\
   2.2 [Configuracions de Git](#22-configuracions-de-git)\
   2.3 [Procediment diari](#23-procediment-diari)\
   2.4 [Procediment de treball amb targetes](#24-procediment-de-treball-amb-targetes)\
    2.4.1 [Assignar-te una targeta de tasques](#241-assignar-te-una-targeta-de-tasques)
    2.4.2 [Treballar en una tasca](#242-treballar-en-una-tasca)
    2.4.3 [Pull request](#243-pull-request)
   2.5 [Metodologia Scrum](#25-metodologia-scrum)

3. [**REGLES DE CODI**](#3-regles-de-codi)
   
4. [**STACK**](#4-stack)\
   4.1 [Framework](#41-framework)\
   4.2 [Llibreries](#42-llibreries)

5. [**REQUISITS**](#5-requisits)

6. [**INSTAL·LACIÓ**](#6-instal·lació)

7. [**DESENVOLUPAMENT**](#7-desenvolupament)

8. [**PROVES**](#8-proves)

----------------------------------------------------------------

# 1. ENLLAÇOS DEL PROJECTE
## 1.1 Enllaços del projecte
- [GITHUB](https://github.com/IT-Academy-BCN/ita-challenges-frontend)
- [Frontend Sprint Backlog](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1)
- [Product Backlog](https://github.com/orgs/IT-Academy-BCN/projects/13/views/1?visibleFields=%5B%22Title%22%2C%22Assignees%22%2C%22Status%22%2C%22Labels%22%5D)
- [Figma](https://www.figma.com/file/ScWpDKxEB3wEGbztXMSJO3/Projectes-IT-Academy?type=design&node-id=559-2230&mode=design)

----------------------------------------------------------------

# 2. PROCEDIMENTS DE TREBALL

## 2.1 Primeres tasques a realitzar en el projecte
### 0. Demana permís per col·laborar amb el projecte

### 1. Afegeix el teu nom al fitxer contributors.md

1. Clona el repositori de Github ita-challenges-frontend al teu sistema local:

         git clone https://github.com/IT-Academy-BCN/ita-challenges-frontend.git
2. Mou-te al directori del repositori clonat:

         cd ita-challenges-frontend
3. Pots verificar les branques disponibles i la teva branca actual executant la següent ordre:

         git branch
4. Si no et trobes a la branca "develop", mou-t'hi executant la següent ordre:

         git switch develop
5. Crea una nova branca amb el teu nom per fer-hi els teus canvis:

         git switch -c nom-de-la-teva-branca
   Substitueix "nom-de-la-teva-branca" per un nom descriptiu que indiqui els canvis que vols fer.


6. Obre el fitxer contributors.md i afegeix-hi el teu nom i nom d'usuari de GitHub.


7. Després de fer un 'git add' i 'git commit', executa el següent 'git push':

         git push origin nom-de-la-teva-branca
8. Obre el repositori a GitHub. Hauries de veure un missatge que et permet crear un pull request des de la teva nova branca a la branca "develop". Clica a l'enllaç per crear la pull request.

----------------------------------------------------------------

## 2.2 Configuracions de Git

Configuracions de Git necessàries per prevenir problemes

### 2.2.1 Git ignore
1. Edita el fitxer .gitignore:
Si és necessari, ara pots editar el fitxer ".gitignore" per incloure qualssvol patró de fitxers o directori específics que vulguis que Git ignori en tots els teus projectes. Recorda guardar el fitxer després de fer qualssevol canvis.

2. Propaga els canvis:
Els canvis al teu fitxer .gitignore no afectaran de manera retroactiva els fitxers que Git ja hagi seguit. Si vols que Git comenci a ignorar un fitxer que ja seguia, primer has de deixar de seguir aquest fitxer. Utilitza l'ordre 'git rm --cached nom_fitxer' per deixar de seguir un fitxer. Perquè els canvis tinguin efecte, hauràs de fer un commit d'aquest canvi.

3. Evita dades sensibles:
Una bona pràctica és incloure fitxers que continguin dades sensibles (com ara fitxers de configuració amb contrasenyes o claus API) al teu fitxer .gitignore. Això evitarà que aquests fitxers es puguin fer un commit accidentalment al teu repositori.

4. .gitignore global vs local:
Recorda, el fitxer ".gitignore" global s'aplicarà a tots els teus projectes de Git. Si tens fitxers que cal ignorar que són específics d'un sol projecte, considera utilitzar un fitxer ".gitignore" local dins del directori d'aquest projecte.

### 2.2.2 Autocrlf
1. Obre Git Bash.
2. Executa la següent ordre per configurar Git perquè converteixi els salts de línia a CRLF quan es fa un checkout d'un fitxer:

         git config --global core.autocrlf true
3. Tots els fitxers nous que es creïn tindran un salt de línia LF. No obstant això, quan els fitxers es comprovin a la teva màquina, Git convertirà aquests salts de línia a CRLF. Quan es fa un commit de fitxers al teu repositori, Git convertirà de nou els salts de línia a LF.

### 2.2.3 Safe CRLF
1. Obre Git Bash.
2. Executa la següent ordre per configurar Git perquè rebi una advertència quan intentes fer un commit d'un fitxer amb salts de línia CRLF o quan intentes convertir aquests fitxers amb salts de línia CRLF a LF:

         git config --global core.safecrlf warn
3. Amb aquesta configuració, si intentes fer un commit d'un fitxer amb salts de línia CRLF, rebràs una advertència. La mateixa advertència es produirà si intentes convertir un fitxer amb salts de línia CRLF a LF.

----------------------------------------------------------------

## 2.3 Procediment diari

El procediment a seguir cada dia seria aquest:

1. Comença el dia actualitzant la teva branca develop:

         git switch develop
         git pull
2. Tria una targeta de tasques del tauler del projecte que encara no estigui assignada.
3. Crea una nova branca per aquesta tasca.

         git switch -c nom-de-la-branca-tasca
4. Treballa en la teva tasca.
5. Quan hagis finalitzat la tasca, puja els canvis al repositori.

         git add .
         git commit -m "descripció dels canvis"
         git push origin nom-de-la-branca-tasca
6. Crea una pull request a GitHub des de la teva branca de tasques a la branca "develop".
7. Demana una revisió del teu codi a algun dels teus companys d'equip.
8. Si s'aprova la teva pull request, es pot fusionar a la branca "develop".
9. Si tens alguna tasca més a realitzar, torna al pas 2.

----------------------------------------------------------------

## 2.4 Procediment de treball amb targetes

Les targetes de tasques estan organitzades segons el seu estat de desenvolupament. Les targetes es mouen d'esquerra a dreta a mesura que es van completant.

### 2.4.1 Assignar-te una targeta de tasques

1. Ves a la vista del projecte a Github.
2. A la columna "Backlog", selecciona una targeta que no estigui assignada.
3. Clica sobre la targeta i assigna-te-la.
4. Mou la targeta a la columna "Doing".

### 2.4.2 Treballar en una tasca

1. Crea una nova branca per a la tasca.

         git switch -c nom-de-la-branca-tasca
2. Treballa en la teva tasca. Realitza commits freqüentment.
3. Quan hagis finalitzat la tasca, puja els canvis al repositori.

         git add .
         git commit -m "descripció dels canvis"
         git push origin nom-de-la-branca-tasca

### 2.4.3 Pull request

1. Crea una pull request a GitHub des de la teva branca de tasques a la branca "develop".
2. Assigna a un revisor de codi.
3. Mou la targeta a la columna "Review in progress".
4. Si el revisor de codi aprova la teva pull request, es pot fusionar a la branca "develop".
5. Mou la targeta a la columna "Done".

----------------------------------------------------------------

## 2.5 Metodologia SCRUM
https://scrumguides.org/
-Reunions diàries per plantejar dificultats i bloquejants que tinguis
-Reunions quinzenals més profundes (dijous)
-Reunions ocasionals amb el client
-Treball per Epics > Tasques (sprints)



# 3. REGLES DE CODI
- [Clean Code](https://www.freecodecamp.org/news/clean-coding-for-beginners/)
- [Principis SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Guia d'estil d'Angular](https://angular.io/guide/styleguide). Punts principals:
    1. Utilitza una estructura de carpetes basada en característiques en lloc d'una estructura basada en tipus.
        -Agrupa arxius relacionats (components, serveis, etc.) en la mateixa carpeta.
        -Utilitza convencions de nomenclatura coherents i descriptives per a arxius i carpetes, com ara kebab-case per a noms de carpetes i PascalCase per a noms de classes.
    2. Nomenclatura de Classes:
        -Utilitza PascalCase per a noms de classes, incloent components, directives, serveis, etc.
        -Afegeix el sufix "Component" als noms de components.
        -Afegeix el sufix "Service" als noms de serveis.
    3. Nomenclatura de Propietats i Mètodes:
        -Utilitza camelCase per a noms de propietats i mètodes.
        -Evita utilitzar els prefixos "get" o "set" per a accessoris de propietats.
    4. Convencions de Plantilles:
        -Prefixa els noms d'atributs personalitzats amb "ng".
        -Prefixa els selectors de components personalitzats amb "app".
    5. Organització del Codi:
        -Manté el codi concís i llegible.
        -Agrupa les importacions en blocs separats.
        -Ordena les importacions alfabèticament.
    6. Gestió d'Estils:
        -Utilitza l'arquitectura de components d'Angular per aplicar estils específics a cada component.
        -Utilitza classes SCSS per a estils reutilitzables i evita estils en línia.
    7. Gestió de Subscripcions:
        -Desubscriviu-vos d'observables en components per evitar fuites de memòria i ús innecessari de recursos.
        -Utilitza takeUntil, operadors unsubscribe o DestroyRef per gestionar subscripcions.
    8. Gestió de Formularis:
        -Utilitza el mòdul ReactiveFormsModule per a la gestió de formularis.
        -Evita utilitzar directives ngModel en formularis complexos.
    9. Manipulació del DOM:
        -Evita manipular directament el DOM, utilitza la vinculació de dades, directives integrades d'Angular, ViewChild/ren...
        -Per a manipulació de DOM de baix nivell, utilitza Renderer2
- Llenguatges: utilitza **únicament l'anglès per al codi** (pots utilitzar altres llenguatges per als comentaris)
----------------------------------------------------------------

# 4. STACK

## 4.1 Framework
Angular 16.0.1

## 4.2 Llibreries
Intenta no sobrecarregar el projecte amb biblioteques.
   - Bootstrap: 5.2
   - ngBootstrap: 15.0.0
   - "jasmine-marbles": "^0.9.2",
   - Jest:
        "jest-jasmine2": "^29.5.0",
        "jest-preset-angular": "^13.1.1"
   - JWT: 

----------------------------------------------------------------

# 5. REQUISITS
- Node.js: Assegura't de tenir Node.js instal·lat al teu sistema. Pots descarregar-Lo des del lloc web oficial de Node.js.
- Git bash: el necessitaràs per contribuir al projecte.

----------------------------------------------------------------

# 6. INSTAL·LACIÓ
1. Obre una terminal o una línia de comandes.
2. Navega fins al directori arrel del projecte.
3. Executa el comandament

        npm install
    (o 'npm i') per instal·lar totes les dependències del projecte especificades en l'arxiu package.json.

----------------------------------------------------------------

# 7. DESENVOLUPAMENT
Per a propòsits de desenvolupament, utilitza el comandament

        ng serve
per iniciar el servidor de desenvolupament. Això compilarà el projecte i el servirà localment, permetent-te veure i interactuar amb ell al teu navegador.

----------------------------------------------------------------

# 8. PROVES
Per executar les proves, utilitza el comandament

    npm test
Això executarà el conjunt de proves i proporcionarà retroalimentació sobre els resultats de les proves.
Si prefereixes executar les proves en mode de vigilància, que reexecuta automàticament les proves quan un arxiu canvia, utilitza el comandament

    npm run test:watch.
