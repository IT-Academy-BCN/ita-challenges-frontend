# Guía de estilo de IT-Challenge

## Índice

1. [**ENLACES DEL PROYECTO**](#1-enlaces-del-proyecto)\
   1.1 [Enlaces del proyecto](#11-enlaces-del-proyecto) 

2. [**PROCEDIMIENTOS DE TRABAJO**](#2-procedimientos-de-trabajo)\
   2.1 [Primeras tareas a realizar en el proyecto](#21-primeras-tareas-a-realizar-en-el-proyecto)\
   2.2 [Configuraciones de Git](#22-configuraciones-de-git)\
   2.3 [Procedimiento diario](#23-procedimiento-diario)\
   2.4 [Procedimiento de trabajo con tarjetas](#24-procedimiento-de-trabajo-con-tarjetas)\
    2.4.1 [Asignarte una tarjeta de tareas](#241-asignarte-una-tarjeta-de-tareas)\
    2.4.2 [Trabajar en una tarea](#242-trabajar-en-una-tarea)\
    2.4.3 [Pull request](#243-pull-request)\
   2.5 [Metodología Scrum](#25-metodología-scrum)

3. [**REGLAS DE CÓDIGO**](#3-reglas-de-código)
   
4. [**STACK**](#4-stack)\
   4.1 [Framework](#41-framework)\
   4.2 [Librerías](#42-librerías)

5. [**REQUISITOS**](#5-requisitos)

6. [**INSTALACIÓN**](#6-instalación)

7. [**DESARROLLO**](#7-desarrollo)

8. [**PRUEBAS**](#8-pruebas)

----------------------------------------------------------------

### 1. ENLACES DEL PROYECTO
#### 1.1 Enlaces del proyecto
- [GITHUB](https://github.com/IT-Academy-BCN/ita-challenges-frontend)
- [Frontend Sprint Backlog](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1)
- [Product Backlog](https://github.com/orgs/IT-Academy-BCN/projects/13/views/1?visibleFields=%5B%22Title%22%2C%22Assignees%22%2C%22Status%22%2C%22Labels%22%5D)
- [Figma](https://www.figma.com/file/ScWpDKxEB3wEGbztXMSJO3/Projectes-IT-Academy?type=design&node-id=559-2230&mode=design)

----------------------------------------------------------------

### 2. PROCEDIMIENTOS DE TRABAJO

#### 2.1 Primeras tareas a realizar en el proyecto
* Pide permiso para colaborar en el proyecto
* Añade tu nombre al archivo contributors.md. Para ello:

1. Clona el repositorio de Github ita-challenges-frontend en tu sistema local:

         git clone https://github.com/IT-Academy-BCN/ita-challenges-frontend.git
2. Muévete al directorio del repositorio clonado:

         cd ita-challenges-frontend
3. Puedes verificar las ramas disponibles y tu rama actual ejecutando el siguiente comando:

         git branch
4. Si no te encuentras en la rama "develop", muévete a ella ejecutando el siguiente comando:

         git switch develop
5. Crea una nueva rama con tu nombre para realizar tus cambios:

         git switch -c nombre-de-tu-rama
   Sustituye "nombre-de-tu-rama" por un nombre descriptivo que indique los cambios que deseas realizar.


6. Abre el archivo contributors.md y añade tu nombre y nombre de usuario de GitHub.


7. Después de hacer un 'git add' y 'git commit', ejecuta el siguiente 'git push':

         git push origin nombre-de-tu-rama
8. Abre el repositorio en GitHub. Deberías ver un mensaje que te permite crear un pull request desde tu nueva rama a la rama "develop". Haz clic en el enlace para crear la pull request.


----------------------------------------------------------------

#### 2.2 Configuraciones de Git

Configuraciones de Git necesarias para prevenir problemas

##### 2.2.1 Git ignore

1. Edita el archivo .gitignore:
Ahora puedes editar el archivo ".gitignore" para incluir cualquier patrón de archivos o directorio específicos que quieras que Git ignore en todos tus proyectos. Recuerda guardar el archivo después de hacer cualquier cambio.

2. Propaga los cambios:
Los cambios en tu archivo .gitignore no afectarán de manera retroactiva los archivos que Git ya haya seguido. Si quieres que Git comience a ignorar un archivo que ya seguía, primero tienes que dejar de seguir ese archivo. Usa el comando 'git rm --cached nombre_archivo' para dejar de seguir un archivo. Para que los cambios tengan efecto, tendrás que hacer un commit de este cambio.

3. Evita datos sensibles:
Una buena práctica es incluir archivos que contengan datos sensibles (como archivos de configuración con contraseñas o claves API) en tu archivo .gitignore. Esto evitará que estos archivos se puedan hacer un commit accidentalmente a tu repositorio.

4. .gitignore global vs local:
Recuerda, el archivo ".gitignore" global se aplicará a todos tus proyectos de Git. Si tienes archivos que hay que ignorar que son específicos de un solo proyecto, considera usar un archivo ".gitignore" local dentro del directorio de ese proyecto.

##### 2.2.2 Autocrlf

1. Abre Git Bash.
2. Ejecuta el siguiente comando para configurar Git para que convierta los saltos de línea a CRLF cuando se hace un checkout de un archivo:

       git config --global core.autocrlf true
3. Todos los archivos nuevos que se creen tendrán un salto de línea LF. Sin embargo, cuando los archivos se comprueban en tu máquina, Git convertirá estos saltos de línea a CRLF. Cuando se hace un commit de archivos a tu repositorio, Git volverá a convertir los saltos de línea a LF.

##### 2.2.3 Safe CRLF

1. Abre Git Bash.
2. Ejecuta el siguiente comando para configurar Git para que reciba una advertencia cuando intentas hacer un commit de un archivo con saltos de línea CRLF o cuando intentas convertir estos archivos con saltos de línea CRLF a LF:

       git config --global core.safecrlf warn
3. Con esta configuración, si intentas hacer un commit de un archivo con saltos de línea CRLF, recibirás una advertencia. La misma advertencia se producirá si intentas convertir un archivo con saltos de línea CRLF a LF.

#### 2.3 Procedimiento diario

El procedimiento a seguir cada día sería este:

1. Comienza el día actualizando tu rama develop:

       git switch develop
       git pull
2. Elige una tarjeta de tareas del tablero del proyecto que aún no esté asignada.
3. Crea una nueva rama para esta tarea.

       git switch -c nombre-de-la-rama-tarea
4. Trabaja en tu tarea.
5. Cuando hayas finalizado la tarea, sube los cambios al repositorio.

       git add .
       git commit -m "descripción de los cambios"
       git push origin nombre-de-la-rama-tarea
6. Crea una pull request en GitHub desde tu rama de tareas a la rama "develop".
7. Pide una revisión de tu código a alguno de tus compañeros de equipo.
8. Si se aprueba tu pull request, se puede fusionar a la rama "develop".
9. Si tienes alguna tarea más a realizar, vuelve al paso 2.

----------------------------------------------------------------

#### 2.4 Procedimiento de trabajo con tarjetas

Las tarjetas de tareas están organizadas según su estado de desarrollo. Las tarjetas se mueven de izquierda a derecha a medida que se van completando.

##### 2.4.1 Asignarte una tarjeta de tareas

1. Ve a la vista del proyecto en Github.
2. En la columna "Backlog", selecciona una tarjeta que no esté asignada.
3. Haz clic sobre la tarjeta y asígnatela.
4. Mueve la tarjeta a la columna "Doing".

##### 2.4.2 Trabajar en una tarea

1. Crea una nueva rama para la tarea.

       git switch -c nombre-de-la-rama-tarea
2. Trabaja en tu tarea. Realiza commits con frecuencia.
3. Cuando hayas finalizado la tarea, sube los cambios al repositorio.

       git add .
       git commit -m "descripción de los cambios"
       git push origin nombre-de-la-rama-tarea

##### 2.4.3 Pull request

1. Crea una pull request en GitHub desde tu rama de tareas a la rama "develop".
2. Asigna a un revisor de código.
3. Mueve la tarjeta a la columna "Review in progress".
4. Si el revisor de código aprueba tu pull request, se puede fusionar a la rama "develop".
5. Mueve la tarjeta a la columna "Done".

----------------------------------------------------------------

#### 2.5 Metodología SCRUM

[Guía Scrum](https://scrumguides.org/)

- Reuniones diarias para plantear dificultades y bloqueantes que tengas
- Reuniones quincenales más profundas (jueves)
- Reuniones ocasionales con el cliente
- Trabajo por Epics > Tareas (sprints)

----------------------------------------------------------------

### 3. REGLAS DE CÓDIGO
- [Clean code](https://www.freecodecamp.org/news/clean-coding-for-beginners/)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Guía de estilo de Angular](https://angular.io/guide/styleguide). Puntos principales:
    1. Utiliza una estructura de carpetas basada en características en lugar de una estructura basada en tipos.
        -Agrupa archivos relacionados (componentes, servicios, etc.) en la misma carpeta.
        -Utiliza convenciones de nomenclatura coherentes y descriptivas para archivos y carpetas, como kebab-case para nombres de carpetas y PascalCase para nombres de clases.
    2. Nomenclatura de Clases:
        -Utiliza PascalCase para nombres de clases, incluyendo componentes, directivas, servicios, etc.
        -Añade el sufijo "Component" a los nombres de componentes.
        -Añade el sufijo "Service" a los nombres de servicios.
    3. Nomenclatura de Propiedades y Métodos:
        -Utiliza camelCase para nombres de propiedades y métodos.
        -Evita usar los prefijos "get" o "set" para accesores de propiedades.
    4. Convenciones de Plantillas:
        -Prefija los nombres de atributos personalizados con "ng".
        -Prefija los selectores de componentes personalizados con "app".
    5. Organización del Código:
        -Mantén el código conciso y legible.
        -Agrupa las importaciones en bloques separados.
        -Ordena las importaciones alfabéticamente.
    6. Gestión de Estilos:
        -Utiliza la arquitectura de componentes de Angular para aplicar estilos específicos a cada componente.
        -Utiliza clases SCSS para estilos reutilizables y evita estilos en línea.
    7. Gestión de Subscripciones:
        -Desuscríbete de observables en componentes para evitar fugas de memoria y uso innecesario de recursos.
        -Utiliza takeUntil, operadores unsubscribe o DestroyRef para gestionar subscripciones.
    8. Gestión de Formularios:
        -Utiliza el módulo ReactiveFormsModule para la gestión de formularios.
        -Evita usar directivas ngModel en formularios complejos.
    9. Manipulación del DOM:
        -Evita manipular directamente el DOM, utiliza el enlace de datos, directivas integradas de Angular, ViewChild/ren...
        -Para manipulación de DOM de bajo nivel, utiliza Renderer2
- Idiomas: utiliza únicamente el inglés para el código (puedes usar otros idiomas para los comentarios)
----------------------------------------------------------------

### 4. STACK

#### 4.1 Framework
Angular 16.0.1

#### 4.2 Librerías
Intenta no sobrecargar el proyecto con librerías innecesarias.
   - Bootstrap: 5.2
   - ngBootstrap: 15.0.0
   - "jasmine-marbles": "^0.9.2",
   - Jest:
        "jest-jasmine2": "^29.5.0",
        "jest-preset-angular": "^13.1.1"
   - JWT: 

----------------------------------------------------------------

### 5. REQUISITOS
- Node.js: Asegúrate de tener Node.js instalado en tu sistema. Puedes descargarlo desde el sitio web oficial de Node.js.
- Git bash: lo necesitarás para contribuir al proyecto.

----------------------------------------------------------------

### 6. INSTALACIÓN
1. Abre una terminal o una línea de comandos.
2. Navega hasta el directorio raíz del proyecto.
3. Ejecuta el comando

        npm install
    (o 'npm i') para instalar todas las dependencias del proyecto especificadas en el archivo package.json.

----------------------------------------------------------------

### 7. DESARROLLO
Para propósitos de desarrollo, utiliza el comando

        ng serve
para iniciar el servidor de desarrollo. Esto compilará el proyecto y lo servirá localmente, permitiéndote ver e interactuar con él en tu navegador.

----------------------------------------------------------------

### 8. PRUEBAS
Para ejecutar las pruebas, utiliza el comando

    npm test
Esto ejecutará el conjunto de pruebas y proporcionará retroalimentación sobre los resultados de las pruebas.
Si prefieres ejecutar las pruebas en modo de vigilancia, que reejecuta automáticamente las pruebas cuando un archivo cambia, utiliza el comando

    npm run test:watch.