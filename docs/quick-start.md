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
2. Navigate to the project directory: `cd app2`.
3. Install the required dependencies: `yarn install`.
4. Build the project: `yarn build`.

## Database Configuration

Once you have installed App2, you need to configure database before you can start building your app.

1. Open the `app2.env` file in your project directory.
2. If you have the connection details for PostgreSQL and Redis, enter them in the app2.env file using the format of a connection string. If not please refer to this [Redis](https://redis.io/docs/getting-started/) / [PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/)

```js
APP2_PG=postgres://username:password@host:port/database
APP2_REDIS=redis://username:password@host:port
```

4. Start the server in the 'app2' directory using 'yarn start' command and verify that it's running properly.

## Building App

To build your first App2 application, follow these steps:

1. After completing all settings, go to http://localhost:3000 in your web browser.
2. To login, use the admin ID and password provided in the 'users.csv' file located in the common directory.
3. Click the 'Create View' button to start building view.
   <br><img src="https://user-images.githubusercontent.com/126759216/223354667-3f2f9f05-c395-4173-ae39-a7dbd9821ddb.png" alt="createView" width="30%" height="10%"><br>

### Create view with AI

1. Click on "AI Model Studio".
2. Type in a specific description of what you want your application to do using natural language.
3. Click on "Create" to generate an AI-powered view.

### Create view with Designer

1. Click on "Design new view".
2. In designer, users can choose to make view with pro-code or low-code.

### Create view from Excel

1. Click on "Create view from excel" and choose the file you want to import.
2. Once the file is selected, a "Create New View" modal will appear. Fill in all required fields and click "OK".
3. Select the columns you want to include, choose the key column, and edit fields as necessary.
4. Automatically, data types for all fields will be assigned based on their values in Excel. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="https://user-images.githubusercontent.com/126759216/223354726-5980afa5-9bc2-4160-b007-687c90ffd5f0.png" alt="ViewWithExcel" width="30%" height="20%"><br>
   <br><img src="https://user-images.githubusercontent.com/126759216/223354807-30fa0465-0eab-401c-9f0f-c86f66609945.png" alt="editField" width="30%" height="10%"><br>

### Create view from pasting table

1. Click on "Create view from pasting table".
2. To copy table data from Excel, copy the cells you want, then click the 'Paste' button or press Ctrl + V to paste the data.
3. A "Create New View" modal will appear. Fill in all required fields and click "OK".
4. Select the columns you want to include, choose the key column, and edit fields as necessary.
5. All fields will be assigned the data type of string. If any editing is necessary, simply click on the "Edit" button for the desired field.
   <br><img src="https://user-images.githubusercontent.com/126759216/223354726-5980afa5-9bc2-4160-b007-687c90ffd5f0.png" alt="ViewWithExcel" width="30%" height="10%"><br>
   <br><img src="https://user-images.githubusercontent.com/126759216/223354807-30fa0465-0eab-401c-9f0f-c86f66609945.png" alt="editField" width="30%" height="10%"><br>

### Create blank view

1. Click on "Create blank view" and fill in all required fields and click "OK".
2. New blank view will be created.
3. Use the visual designer on ellipsis to customize your new view according to your preferences.
4. Click the "ADD" button to input your data once you have finished designing your view.

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

### App management with Yarn

1. Start the app by running the command `yarn start <app name>` in app2 directory. If you don't specify the app name, the container app will be started instead.
2. Open a web browser and navigate to http://localhost:3000.
3. Login to the app using your credentials.
4. You will be able to see that you have successfully logged in to the app you created.

## Create new app

1. Navigate to the "My Apps" section in the menu bar and click the "ADD" button in the action bar..
   <br><img src="https://user-images.githubusercontent.com/126759216/223355002-e79ef6c2-f13d-4028-aff7-e141e30ff088.png" alt="createApps" width="50%" height="20%"><br>

2. Fill in the details about the app. Note that configurations can also be set in this part.  
   <br><img src="https://user-images.githubusercontent.com/126759216/223355156-7ab562ba-e92c-4cc6-903e-fed533705a9b.png" alt="createAppsDetail" width="50%" height="20%"><br>

3. Click on "OK" to create the app. Now you can run your newly created app, simply select the app name and click the "START APP" button; to open the app in a new window, click the "OPEN APP" button.
   <br><img src="https://user-images.githubusercontent.com/126759216/223355253-72745f44-7ec2-4036-8beb-c072dc2a8c31.png" alt="createApps" width="50%" height="20%"><br>

## App Configuration

To set configuration of the app navigate to the "container" folder in the "apps" directory.
Open the config.ts file in VS Code and make any necessary changes to the settings.
<br>[For more information about app configuration, click on this]().</br>

Alternatively, you can also make settings changes in the browser using the App Designer in the menu bar. Simply click on "config" to access the configuration settings.
<br><img src="https://user-images.githubusercontent.com/126759216/223354548-10293ba1-e879-4e56-a676-4cb13402b376.png" alt="appDesigner" width="30%" height="10%"><br>
