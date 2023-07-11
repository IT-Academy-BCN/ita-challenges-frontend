# IT-Challenge Style Guide

## Table of Contents

1. [**PROJECT'S LINKS**](#1-projec-s-links)\
   1.1 [Project's Links](#11-project-links) 

2. [**WORK PROCEDURES**](#2-work-procedures)\
   2.1 [First things to do in the project](#21-first-things-to-do-in-the-project)\
   2.2 [Git configurations](#22-git-configurations)\
   2.3 [Daily Procedure](#23-daily-procedure)\
   2.4 [Work with cards Procedure](#24-work-with-cards-procedure)\
    2.4.1 [Assigning yourself a task-card](#241-assigning-yourself-a-task-card)
    2.4.2 [Assigning yourself a task-card](#242-working-on-a-class)
    2.4.3 [Assigning yourself a task-card](#243-pull-requests)
   2.5 [Points to consider when doing a PR](#25-points-to-consider-when-doing-a-pr)\
   2.6 [Scrum metodology](#26-scrum-metodology)

3. [**URL NORMALIZATION**](#3-url-normalization)\
   3.1 [Convencions](#31-convencions)

4. [**DEFINITIONS OF METHOD, CLASS, ETC...**](#4-definitions-of-method,-class,-etc...)\
   4.1 [Package names](#41-package-names)\
   4.2 [Class names](#42-class-names)\
   4.2.1 [Test Class names](#421-test-class-names)\
   4.2.2 [Interface Class names](#422-interface-class-names)\
   4.3 [Method names](#43-method-names)\
   4.3.1 [Test Method names](#431-test-method-names)\
   4.4 [Constant names](#44-constant-names)\
   4.5 [Local variable names](#45-local-variable-names)\
   4.5.1 [Temporary "throwaway" variables](#451-temporary-"throwaway"-variables)\
   4.6 [Type variable names](#46-type-variable-names)\
   4.7 [Camel case: defined](#47-camel-case:-defined)  
   
5. [**LIBRARIES USED**](#5-libraries-used)\
   5.1 [Main Plugins](#51-main-plugins)\
   5.2 [Implementation area](#52-implementation-area)\
   5.3 [Testimplementation area](#53-testimplementation-area)

6. [**REQUIRED PROGRAMS**](#6-required-programs)\
   6.1 [Requierd programs](#61-required-programs)

7. [**RECOMMENDED PROGRAMS**](#7-recommended-programs)\
   7.1 [Recommended programs](#71-recommended-programs)

----------------------------------------------------------------

# 1. PROJECT'S LINKS
## 1.1 Project links
- GITHUB [link](https://github.com/IT-Academy-BCN/ita-challenges-frontend)\
<img src="img/GitHub.jpg" alt="isolated" width="400"/>
- Backend Sprint Backlog [link](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1)\
<img src="img/Spring_BackLog.jpg" alt="isolated" width="400"/>
- Product Backlog [link](https://github.com/orgs/IT-Academy-BCN/projects/13/views/1?visibleFields=%5B%22Title%22%2C%22Assignees%22%2C%22Status%22%2C%22Labels%22%5D)\
<img src="img/Product BackLog.jpg" alt="isolated" width="400"/>
- Figma [link](https://www.figma.com/file/ScWpDKxEB3wEGbztXMSJO3/Projectes-IT-Academy?type=design&node-id=559-2230&mode=design)\
<img src="img/Figma.jpg" alt="Figma image" width="400"/>

----------------------------------------------------------------

# 2. WORK PROCEDURES

## 2.1 First things to do in the project
### 0. Ask permission to collaborate with the project

### 1. Add your name to the file contributors.md

1. Clone the Github repository ita-challenges-frontend in your local system:

         git clone https://github.com/IT-Academy-BCN/ita-challenges-frontend.git
2. Move to the directory of the cloned repository:

         cd ita-challenges-frontend
3. You can verify the available branches and your current branch by running the following command:

         git branch
4. If you are not on the "develop" branch, switch to it by executing the following command::

         git switch develop
5. Create a new branch with your name to make your changes:

         git switch -c your-branch-name
   Replace "your-branch-name" with a descriptive name that indicates the changes you plan to make.


6. Open the contributors.md file and add your name and GitHub username.


7. After doing a 'git add' and 'git commit', perform the following 'git push':

         git push origin your-branch-name
8. Open the repository on GitHub. You should see a message that allows you to create a pull request from your newly created branch to the "develop" branch. Click on the link to create the pull request.

----------------------------------------------------------------
----------------------------------------------------------------

## 2.2 Git configurations

Necessary Git configurations to prevent problems

### 2.2.1 Git ignore
1. Copy file ".gitignore" from root project\
   <img src="img/Gitignore_doc.jpg" alt="Gitignore_doc.jpg" width="300"/>
2. Paste it in the PC directory (outside of project folder)
3. In Git Bash...
4. Run the command: 'git config --global core-excludesfile path/.gitignore'\
Where...\
'Path': is the path of the folder where the ".gitignore" file is located.\
Note! This configuration will not only serve for the current project, but also for all the projects you do with GIT.

### 2.2.2 Autocrlf
1. Open Git Bash.
2. Run the following command to configure the autocrlf setting globally:
        git config --global core.autocrlf true
Explanation: The autocrlf setting handles line-ending differences between different operating systems. Enabling it ensures consistent line endings across different platforms when working with Git.

Note: Prior to running this command, make sure you have Git Bash installed on your system.

3. Provide context: Modifying a large number of files in a PR can introduce issues related to inconsistent line endings. This configuration helps maintain consistent line endings and prevents potential problems when collaborating across different platforms.

4. Examples and considerations: Here are a few scenarios where the autocrlf setting can be helpful:

-Collaboration: When multiple developers are working on a project, each using a different operating system, enabling autocrlf ensures that line endings are automatically adjusted to be consistent.

-Deployment: If your project requires specific line endings for deployment purposes (e.g., Unix-style line endings on a Linux server), enabling autocrlf ensures the line endings are automatically converted during checkout and commit.

-Caveats: Enabling autocrlf may have some trade-offs. It's important to be aware that automatic line-ending conversions can sometimes introduce unintended changes to files. It's recommended to carefully review changes when working with line-ending conversions.

5. Alternative solutions: While enabling autocrlf is a common approach, there are alternative methods to handle line-ending differences. These include using the .gitattributes file or manually adjusting line endings. Consider the specific needs of your project and choose the approach that best suits your requirements.


----------------------------------------------------------------
----------------------------------------------------------------

## 2.3 Daily Procedure
1. Connect to [Teams](https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZTJlZjdhOTYtYWUwNy00OTI3LWEyZjYtZjM1ZjM2NjY3Njky%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252211d22a1f-a84d-4849-b1a4-28cec13827da%2522%252c%2522Oid%2522%253a%2522a91a5c8e-8f8c-48e4-8cd7-521e17afef93%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=996a8ae7-6337-409e-96d6-dfbbef2e2131&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true) at 9:15 AM: Discuss difficulties and blockers.
2. Switch to the 'develop' branch (git switch develop) and perform a 'git pull'.
3. Switch to your working branch (git switch your-branch-name) and merge with 'develop':

        git merge develop
4. Coffee break at around 10:30 AM aprox.
5. At least once a day, execute 'git push origin your-branch-name'. Remember, you can set a default upstream branch in your local repository to easily push changes with 'git push':

        git push --set-upstream origin your-branch-name
        
IMPORTANT: It is expected that everyone on the project is online with their cameras turned on from 9:15 AM to 1:15 PM to work as a team (unless there are justifiable circumstances).

----------------------------------------------------------------
----------------------------------------------------------------
## 2.4 Work with cards Procedure
### 2.4.1 Assigning yourself a task-card
- The project has been planned in several stages called ["Epic"](https://github.com/orgs/IT-Academy-BCN/projects/13).

- Each Epic is further divided into "tasks", which are generally created by the mentor. To organize the task distribution, this [dashboard](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1) with four columns is used:
    - ToDo: includes tasks that have not yet been started. All tasks (cards) start here.
    - Doing: tasks that are in progress.
    - Testing: tasks that have been completed and need to be reviewed by the mentor.
    - Done: tasks that have been reviewed, approved, and merged into the develop branch by the mentor.

- Each participant needs to assign themselves a task card (by clicking on the card title > Add assignee > clicking the user's name) that is not assigned to anyone and move it to the "Doing" column (by dragging and dropping). In exceptional cases, the participant can create a task (below the columns, "+Add Item"); they should then provide a title and, optionally but recommended, a description and labels.

- The tasks on the dashboard are actually "Issues" on Github. Therefore, these Issues can have labels (such as "Epic3", "Design", "Testing") that help provide an idea of the task's content.

### 2.4.2 Working on a task
-Once you have a task assigned, you will need to create a new branch dedicated exclusively to that task. The branch name format should always be "feature/#X", where "X" is the task number (which can be found at the end of the task title). For example, if your task is number 101, you would create a branch named "feature/#101".

The typical flow is as follows:
-Create a branch, make changes and commit:

        git switch -c branchName (e.g., git switch -c feature/#101)
        git add .
        git commit -m "Commit message"
-As mentioned, the first time you push your branch to the remote repository you can set an upstream branch:

        git push --set-upstream origin branchName
-And then, everytime you need to push changes to the remote repository:

        git push

(-Alternatively, you can omit --set-upstream and always simply use "git push origin branchName".)

There isn't a set way to do commits. You can follow the style of "conventional commits" (there is an extension in VSCode that can assist you with them): [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). In any case, it is important that your commits are descriptive, clearly indicating where the change was made and what it consists of.

### 2.4.3 Pull requests
-Once you have finished working on your feature branch, you are almost ready to make the Pull request (PR). Before doing so, pull the last changes of the remote develop branch and merge them into your feature branch (see 2.3 Daily Procedure)
-Make sure to run the tests: "npm test" (also, you can run "npm test:watch" whenever you start working on the code to quickly catch any issues).
-Push the branch to the remote and ensure that automatic tests (like SonarCloud) pass: you will be notified of the results of the tests right after pushing. If your PR doesn't pass the test, review the log messages to find and solve the problems before you try a new PR. In that case, remember to pull and push again.
-Create a PR: Go to GitHub, and usually, if you have recently pushed changes, you will see a message like "There are recent changes in the feature-/#X branch, create a PR." If not, go to "Pull requests" > "New pull request" and select "develop > your-branch" > "Create pull request". Add a clear and concise description of the changes you have made.
-After doing the PR, you will see red-highlighted messages indicating that the merge cannot be done until someone approves the PR. This is normal, as the mentor needs to review and approve it.
-Once the PR is created, go to the bottom right and click on "Develop" to link the PR to the corresponding Issue (task).
-Go to the dashboard with the four columns. You will see that the task card you just completed has a reference to the corresponding PR. Move the card to the "Testing" column.

----------------------------------------------------------------
----------------------------------------------------------------
## 2.5 Scrum metodology
https://scrumguides.org/
-Daily online meetings to discuss difficulties
-Biweekly in-person meeting (Thursday)
-Work by Epics > Tasks (Sprints)


<img src="img/VER5-scrum-framework_2020.jpg" alt="isolated" width="400"/>

----------------------------------------------------------------

# 3. CODING GUIDELINES
- [Clean Code](8https://www.freecodecamp.org/news/clean-coding-for-beginners/)
- [SOLID principles](https://en.wikipedia.org/wiki/SOLID)
- [Angular Styleguide](https://angular.io/guide/styleguide). Main points:
    1. Use a feature-based folder structure instead of a type-based structure.
        -Group related files (components, services, etc.) in the same folder.
        -Use consistent and descriptive naming conventions for files and folders, such as kebab-case for folder names and PascalCase for class names.
    2. Class Naming:
        -Use PascalCase for class names, including components, directives, services, etc.
        -Append the "Component" suffix to component names.
        -Append the "Service" suffix to service names.
    3. Property and Method Naming:
        -Use camelCase for property and method names.
        -Avoid using "get" or "set" prefixes for property accessors.
    4. Template Conventions:
        -Prefix custom attribute names with "ng".
        -Prefix custom component selectors with "app".
    5. Code Organization:
        -Keep code concise and readable.
        -Group imports into separate blocks.
        -Sort imports alphabetically.
    6. Styles Handling:
        -Use Angular's component architecture to apply specific styles to each component.
        -Use SCSS classes for reusable styles and avoid inline styles.
    7. Subscription Management:
        -Unsubscribe from observables in components to prevent memory leaks and unnecessary resource usage.
        -Use takeUntil, unsubscribe operators or DestroyRef to manage subscriptions.
    8. Form Handling:
        -Use the ReactiveFormsModule module for form management.
        -Avoid using ngModel directives in complex forms.
    9. DOM manipulation:
        -Avoid directly manipulating the DOM, use data-binding, Angular built-in directives, ViewChild/ren...
        -For low-level DOM manipulation, use Renderer2
- Languages: use only English for the code (you can use other languages for comments)
----------------------------------------------------------------
----------------------------------------------------------------

# 4. STACK

## 4.1 Angular version
    - Angular 16

## 4.2 Libraries
Try not to overload the project with libraries.
   - Bootstrap: 5.2
   - ngBootstrap: 15.0.0
   - "jasmine-marbles": "^0.9.2",
   - Jest:
        "jest-jasmine2": "^29.5.0",
        "jest-preset-angular": "^13.1.1"
   - JWT: 

# 6. REQUISITES
    - Node.js: Make sure you have Node.js installed on your system. You can download it from the official Node.js website.

# 7. INSTALLATION
    1. Open a terminal or command prompt.
    2. Navigate to the root directory of the project.
    3. Run the command npm install to install all the project dependencies specified in the package.json file.

# 8. DEVELOPMENT
For development purposes, use the command ng serve to start the development server. This will compile the project and serve it locally, enabling you to view and interact with it in your browser.

# 9. TESTING
To run the tests, use the command npm test. This will execute the test suite and provide feedback on the test results.
If you prefer to run the tests in watch mode, which automatically re-runs the tests whenever a file changes, use the command npm run test:watch.