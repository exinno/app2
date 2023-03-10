# Quick Start

Although App2 plans to support SaaS, Docker, and multi-cloud deployment in the future, these options are not currently available. For now, only the installation via npm package manager is provided.

## Pre-requirements

Before you start using App2, make sure you have the following pre-requirements:

- Operating System: Windows 10
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [NPM](https://www.npmjs.com/package/npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- [PostgreSQL](https://www.postgresql.org/download/) (v9.6 or higher)
- [Redis](https://redis.io/download/)

## Installation

To install App2, follow these steps:

1. Clone the App2 repository from GitHub: `git clone https://github.com/app2/app2.git`.
2. Navigate to the 'app2' directory: `cd app2`.
3. Install the required dependencies: `yarn install`.
4. Build the project: `yarn build`.

## Database Configuration

Once you have installed App2, you need to configure database before you can start using app.

1. Open the [app2.env](../app2.env) file in your 'app2' directory.
2. If you have the connection details for PostgreSQL and Redis, enter them in the file using the format of a connection string. If not please refer to this [Redis](https://redis.io/docs/getting-started/) / [PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/)

```js
APP2_PG=postgres://username:password@host:port/database
APP2_REDIS=redis://username:password@host:port
```

4. Start the server in the 'app2' directory using `yarn start` command this will run container server.

## Create new app

1. We can use container app to create new app. While app2 container server is running, go to http://localhost:3000 in your web browser.

2. To login, use the admin ID and password provided in the ['users.csv'](../common/csv/users.csv).

3. Navigate to the "My Apps" section in the menu bar and click the "ADD" button in the action bar.

4. Fill in the details about the app. Configurations can be set in this part.
   <br>[For more information about app configuration, click on this]().</br>
   <br><img src="./assets/createAppsDetail.png" alt="createAppsDetail" width="50%" height="20%"><br>

- Configuration can be edited in 'App Designer' in the menu bar. Simply click on "config" to access the configuration settings.
  <br><img src="./assets/AppDesignerConfig.png" alt="appDesigner" width="30%" height="10%"><br>Alternatively
  users can edit configuration by editing 'config.ts' in respective 'app' directory.

5. Click on "OK" to create the app.

## Building App

After creating a new app, you can start the new app in one of two ways:

- Navigate to the 'server' directory and run `yarn start <app name>` to start the new app.

- Start the container in 'server' directory, run `yarn start`, then navigate to "My apps" in menu bar, select the created app, and click "START APP".

Click the 'Create View' button and select the method you want to build view.
<br><img src="./assets/createView.png" alt="createView" width="30%" height="10%"><br>

### Create view with AI

1. Click on "AI Model Studio".
2. Type in a specific description of what you want your application to do using natural language.
3. Click on "Create" to generate an AI-powered view.

### Create view with Designer (WIP)

1. Click on "Design new view".
2. In designer, users can choose to make view with pro-code or low-code.

### Create view from Excel

1. Click on "Create view from excel" and choose the file you want to import.
2. Once the file is selected, a "Create New View" modal will appear. Fill in all required fields and click "OK".
3. Select the columns you want to include, choose the key column, and edit fields as necessary.
4. Automatically, data types for all fields will be assigned based on their values in Excel. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="./assets/createViewWithExcel.png" alt="ViewWithExcel" width="40%" height="20%"><br>
   <br><img src="./assets/editField.png" alt="editField" width="30%" height="10%"><br>

### Create view from pasting table

1. Click on "Create view from pasting table".
2. To copy table data from Excel, copy the cells you want, then click the 'Paste' button or press Ctrl + V to paste the data.
3. A "Create New View" modal will appear. Fill in all required fields and click "OK".
4. Select the columns you want to include, choose the key column, and edit fields as necessary.
5. All fields will be assigned the data type of string. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="./assets/createViewWithExcel.png" alt="ViewWithExcel" width="30%" height="20%"><br>
   <br><img src="./assets/editField.png" alt="editField" width="30%" height="10%"><br>

### Create blank view

1. Click on "Create blank view" and fill in all required fields and click "OK". Then new blank view will be created.
2. Use the visual designer on ellipsis(⋮) to customize your new view according to your preferences.
3. Click the "ADD" button to input your data once you have finished designing your view.

### Add and edit fields

1. Open your view in the visual designer.
2. Click on the "Add Field" button.
3. Select the type of field you want to add.
4. Customize the field properties as necessary.

<br>Created apps are placed in the ['apps'](../apps/) directory.</br>

Congratulations, you have now created your first App2 application!
