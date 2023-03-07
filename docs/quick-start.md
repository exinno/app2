# Quick Start

Although App2 plans to support SaaS, Docker, and multi-cloud deployment in the future, these options are not currently available. For now, only the installation via npm package manager is provided.

## Pre-requirements

Before you start using App2, make sure you have the following pre-requirements:

- Operating System: Windows 10 or Ubuntu 18.04 LTS
- [Node.js](https://nodejs.org/en/) (v12 or higher)
- [NPM](https://www.npmjs.com/package/npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- [PostgreSQL](https://www.postgresql.org/download/) (v9.6 or higher)
- [Redis](https://redis.io/download/)

## Installation

To install App2, follow these steps:

1. Clone the App2 repository from GitHub: `git clone https://github.com/app2/app2.git`.
2. Navigate to the project directory: `cd app2`.
3. Install the required dependencies: `npm install` or `yarn install`.
4. Build the project: `npm  run build` or `yarn build`.
5. Start the server: `npm  run start` or `yarn start`.

## Database Configuration

Once you have installed App2, you need to configure database before you can start building your app.

1. Open the `app2.env` file in your project directory.

2. Enter your PostgreSQL and Redis connection details. Make sure to put as format of connection string.

```js
APP2_PG=postgres://username:password@host:port/database
APP2_REDIS=redis://username:password@host:port/database
```

3. Navigate to the "container" folder in the "apps" directory.
   <br><img src="../static/image/containerFolder.png" alt="containerFolder" width="30%" height="10%"><br>

4. Open the config.ts file in VSCode and make any necessary changes to the settings. <br>[For more information about config setting click ](../static/docs/classes/ConfigModel.html).</br>
   Alternatively, you can also make settings changes in the browser using the App Designer in the menu bar. Simply click on "config" to access the configuration settings.
   <br><img src="../static/image/AppDesignerConfig.png" alt="appDesigner" width="30%" height="10%"><br>

## Building App

To build your first App2 application, follow these steps:

1. After completing all settings, go to http://localhost:3000 in your web browser.
2. Click on "CREATE AN ACCOUNT" to register your app. Depending on your
   configuration, you may be prompted for additional verification.
3. Once you have registered, log in and begin building your app.
4. Once logged in click the 'Create View' button to start building view
   <br><img src="../static/image/createView.png" alt="createView" width="30%" height="10%"><br>

### Create view with AI

1. Click on "AI Model Studio".
2. Type in a specific description of what you want your application to do using natural language.
3. Click on "Create" to generate an AI-powered view.

### Create view with Designer

1. Click on "Design new view".
2. In designer, users can choose to make view with pro-code or low-code.

### Create view from Excel

1. Click on "Create view from excel".
2. Select the Excel file you want to import.
3. Once the file is selected, a "Create New View" modal will appear. Fill in all required fields and click "OK".
4. A table will appear in the modal. Select the columns you want to include, choose the key column, and edit fields as necessary.
5. Automatically, data types for all fields will be assigned based on their values in Excel. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="../static/image/createViewWithExcel.png" alt="ViewWithExcel" width="30%" height="10%"><br>
   <br><img src="../static/image/editField.png" alt="ViewWithExcel" width="30%" height="10%"><br>

### Create view from pasting table

1. Click on "Create view from pasting table".
2. Copy the table data from Excel by selecting the cells and pressing Ctrl + C.
3. Click on the "Paste" button or press Ctrl + V to paste the data.
4. A "Create New View" modal will appear. Fill in all required fields and click "OK".
5. A table will appear in the modal. Select the columns you want to include, choose the key column, and edit fields as necessary.
6. All fields will be assigned the data type of string. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="../static/image/createViewWithExcel.png" alt="ViewWithExcel" width="30%" height="10%"><br>
   <br><img src="../static/image/editField.png" alt="ViewWithExcel" width="30%" height="10%"><br>

### Create blank view

1. Click on "Create blank view".
2. A "Create New View" modal will appear. Fill in all required fields and click "OK".
3. New blank view will be created
4. Use the visual designer on ellipsis to customize your new view according to your preferences.
5. Once you've finished designing your view, click the "ADD" button to input your data.

### Add and edit fields

1. Open your view in the visual designer.
2. Click on the "Add Field" button.
3. Select the type of field you want to add.
4. Customize the field properties as necessary.

<br>Created apps are placed in the apps directory.</br>

Congratulations, you have now created your first App2 application!

## Managing Apps

You can manage your app through the container or run it by itself in the CLI with the command yarn start appName.

### App management through container

1. Start the container app by running the command yarn start in the app2 directory.
2. Open a web browser and navigate to http://localhost:3000.
3. Login to the app using your credentials.
4. Click on "My Apps" in the menu bar, and you will be able to see the apps you have created.

### App management through CLI

1. Start the app by running the command `yarn start <app name>` in app2 directory. If you don't specify the app name, the container app will be started instead.
2. Open a web browser and navigate to http://localhost:3000.
3. Login to the app using your credentials.
4. You will be able to see that you have successfully logged in to the app you created.

## Create new app

1. Navigate to the "My Apps" section in the menu bar.
   <br><img src="../static/image/createApps.png" alt="createApps" width="30%" height="10%"><br>
2. Click the "ADD" button in the action bar.
3. Fill in the details about the app. Note that configurations can also be set in this part.  
   <br><img src="../static/image/createAppsDetail.png" alt="createAppsDetail" width="30%" height="10%"><br>
4. Click on "OK" create the app.
5. To run your newly created app, simply select the app name and click the "START APP" button; to open the app in a new window, click the "OPEN APP" button.
   <br><img src="../static/image/createApps.png" alt="createApps" width="30%" height="10%"><br>
