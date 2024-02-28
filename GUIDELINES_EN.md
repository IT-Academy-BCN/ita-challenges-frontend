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
    2.4.2 [Working on a task](#242-working-on-a-class)
    2.4.3 [Pull request](#243-pull-requests)
   2.5 [Scrum metodology](#25-scrum-metodology)

3. [**CODING GUIDELINES**](#3-definitions-of-method,-class,-etc...)
   
4. [**STACK**](#4-stack)\
   4.1 [Framework](#41-framework)\
   4.2 [Libraries](#42-libraries)

5. [**REQUISITES**](#5-requisites)

6. [**INSTALLATION**](#6-installation)

7. [**DEVELOPMENT**](#6-installation)

8. [**TESTING**](#6-installation)

9. [**DEPLOY**](#9-deploy)


----------------------------------------------------------------

# 1. PROJECT'S LINKS
## 1.1 Project links
- [GITHUB](https://github.com/IT-Academy-BCN/ita-challenges-frontend)
- [Frontend Sprint Backlog](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1)
- [Product Backlog](https://github.com/orgs/IT-Academy-BCN/projects/13/views/1?visibleFields=%5B%22Title%22%2C%22Assignees%22%2C%22Status%22%2C%22Labels%22%5D)
- [Figma](https://www.figma.com/file/ScWpDKxEB3wEGbztXMSJO3/Projectes-IT-Academy?type=design&node-id=559-2230&mode=design)

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

## 2.2 Git configurations

Necessary Git configurations to prevent problems

### 2.2.1 Git ignore
1. Edit the .gitignore file:
If necessary, you can now edit the ".gitignore" file to include any specific file or directory patterns that you want Git to ignore across all your projects. Remember to save the file after making any changes.

2. Propagate changes:
Changes in your .gitignore file will not retroactively affect files that have already been tracked by Git. If you want Git to start ignoring a file that was previously tracked, you must first untrack this file. Use the command 'git rm --cached filename' to untrack a file. For the changes to take effect, you'll need to commit this change.

3. Avoid sensitive data:
A good practice is to include files containing sensitive data (like configuration files with passwords or API keys) in your .gitignore file. This will prevent such files from being accidentally committed to your repository.

4. Global vs local .gitignore:
Remember, the global ".gitignore" file will apply to all your Git projects. If you have files to be ignored that are specific to a single project, consider using a local ".gitignore" file within that project's directory.

### 2.2.2 Autocrlf
1. Open Git Bash.
2. Run the following command to configure the autocrlf setting globally:

        git config --global core.autocrlf true
The autocrlf setting handles line-ending differences between different operating systems. Enabling it ensures consistent line endings across different platforms when working with Git.

3. Provide context: Modifying a large number of files in a PR can introduce issues related to inconsistent line endings. This configuration helps maintain consistent line endings and prevents potential problems when collaborating across different platforms.

4. Examples and considerations: Here are a few scenarios where the autocrlf setting can be helpful:

- Collaboration: When multiple developers are working on a project, each using a different operating system, enabling autocrlf ensures that line endings are automatically adjusted to be consistent.

- Deployment: If your project requires specific line endings for deployment purposes (e.g., Unix-style line endings on a Linux server), enabling autocrlf ensures the line endings are automatically converted during checkout and commit.

- Caveats: Enabling autocrlf may have some trade-offs. It's important to be aware that automatic line-ending conversions can sometimes introduce unintended changes to files. It's recommended to carefully review changes when working with line-ending conversions.

5. Alternative solutions: While enabling autocrlf is a common approach, there are alternative methods to handle line-ending differences. These include using the .gitattributes file or manually adjusting line endings. Consider the specific needs of your project and choose the approach that best suits your requirements.


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
-Once you have a task assigned, you will need to create a new branch dedicated exclusively to that task. **The branch name format should always be "feature/#X"**, where "X" is the task number (which can be found at the end of the task title). For example, if your task is number 101, you would create a branch named "feature/#101".

The typical flow is as follows:
- Create a branch, make changes and commit:

        git switch -c branchName (e.g., git switch -c feature/#101)
        git add .
        git commit -m "Commit message"
- As mentioned, the first time you push your branch to the remote repository you can set an upstream branch:

        git push --set-upstream origin branchName
- And then, everytime you need to push changes to the remote repository:

        git push

 - (Alternatively, you can omit --set-upstream and always simply use "git push origin branchName".)

There isn't a set way to do commits. You can follow the style of "conventional commits" (there is an extension in VSCode that can assist you with them): [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). In any case, it is important that your commits are descriptive, clearly indicating where the change was made and what it consists of.

### 2.4.3 Pull requests
1. Once you have finished working on your feature branch, you are almost ready to make the Pull request (PR). Before doing so, pull the last changes of the remote develop branch and merge them into your feature branch (see 2.3 Daily Procedure)

2. Make sure to run the tests: "npm test" (also, you can run "npm test:watch" whenever you start working on the code to quickly catch any issues).

3. Push the branch to the remote and ensure that automatic tests (like SonarCloud) pass: you will be notified of the results of the tests right after pushing. If your PR doesn't pass the test, review the log messages to find and solve the problems before you try a new PR. In that case, remember to pull and push again.

4. Create a PR: Go to GitHub, and usually, if you have recently pushed changes, you will see a message like "There are recent changes in the feature-/#X branch, create a PR." If not, go to "Pull requests" > "New pull request" and select "develop > your-branch" > "Create pull request". Add a clear and concise description of the changes you have made.

5. After doing the PR, you will see red-highlighted messages indicating that the merge cannot be done until someone approves the PR. This is normal, as the mentor needs to review and approve it.

6. Once the PR is created, go to the bottom right and click on "Develop" to link the PR to the corresponding Issue (task).

7. Go to the [dashboard](https://github.com/orgs/IT-Academy-BCN/projects/16/views/1) with the four columns. You will see that the task card you just completed has a reference to the corresponding PR. Move the card to the "Testing" column.

----------------------------------------------------------------

## 2.5 Scrum metodology
https://scrumguides.org/
-Daily online meetings to discuss difficulties
-Biweekly in-person meeting (Thursday)
-Ocasional reviews with the client
-Work by Epics > Tasks (Sprints)

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
- Languages: use **only English** for the code (you can use other languages for comments)
----------------------------------------------------------------

# 4. STACK

## 4.1 Framework
Angular 16.0.1

## 4.2 Libraries
Try not to overload the project with libraries.
   - Bootstrap: 5.2
   - ngBootstrap: 15.0.0
   - "jasmine-marbles": "^0.9.2",
   - Jest:
        "jest-jasmine2": "^29.5.0",
        "jest-preset-angular": "^13.1.1"
   - JWT: 

----------------------------------------------------------------

# 5. REQUISITES
- Node.js: Make sure you have Node.js installed on your system. You can download it from the official Node.js website.
- Git bash: you will need it  to contribute to the project.

----------------------------------------------------------------

# 6. INSTALLATION
1. Open a terminal or command prompt.
 2. Navigate to the root directory of the project.
3. Run the command 

        npm install
    (or 'npm i') to install all the project dependencies specified in the package.json file.

----------------------------------------------------------------

# 7. DEVELOPMENT
For development purposes, use the command

        ng serve
to start the development server. This will compile the project and serve it locally, enabling you to view and interact with it in your browser.

----------------------------------------------------------------

# 8. TESTING
To run the tests, use the command

    npm test
This will execute the test suite and provide feedback on the test results.
If you prefer to run the tests in watch mode, which automatically re-runs the tests whenever a file changes, use the command

    npm run test:watch.

----------------------------------------------------------------

# 9. DEPLOY

Project development is deployed on develop server through Continuous Integration, not manually.
All features developed are deployed on the develop server for testing when are approved. When you finish a feature, follow next steps:
- Make sure your feature branch is up to date with the develop branch.
- Make sure the name of your feature branch is right (feature/#X).
- Follow semantic versioning (https://semver.org/), and update version number in package.json.
- Update version number (property MICROSERVICE_VERSION) at file .env.CI.dev as well. Make sure both versions are the same. There should be a white line at the end of the file.
- Make necesary annotations at file CHANGELOG.md 
- Make commit with message "X.X.X-RELEASE" (X.X.X is the new version) onto your feature branch.
- Push your changes to the remote repository.
- Create a pull request from your feature branch to the develop branch.
