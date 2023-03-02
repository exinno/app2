# Quick Start

Although App2 plans to support SaaS, Docker, and multi-cloud deployment in the future, these options are not currently available. For now, only the installation via npm package manager is provided.

## Pre-requirements

Before you start using App2, make sure you have the following pre-requirements:

- Operating System: Windows 10 or Ubuntu 18.04 LTS
- Node.js (v12 or higher)
- NPM or Yarn
- PostgreSQL (v9.6 or higher)
- Redis

## Installation

To install App2, follow these steps:

1. Clone the App2 repository from GitHub: `git clone https://github.com/app2/app2.git`.
2. Navigate to the project directory: `cd app2`.
3. Install the required dependencies: `npm install`.
4. Build the project: `npm run build`.
5. Start the server: `npm run start`.

## Configuration

Once you have installed App2, you need to configure it before you can start building your app.

1. Open the `config/default.json` file in your project directory.
2. Enter your PostgreSQL and Redis connection details.
3. Change any other configuration settings as necessary.

## Building App

To build your first App2 application, follow these steps:

### Create view with AI

1. Open App2 in your web browser.
2. Click on the "Create View" button.
3. Type in a description of what you want your application to do using natural language.
4. Click on "Create" to generate an AI-powered view.

### Create view from Excel

1. Open App2 in your web browser.
2. Click on the "Create View" button.
3. Select the "Import Excel" option.
4. Upload your Excel file.
5. Customize your view using the visual designer.

### Create blank view

1. Open App2 in your web browser.
2. Click on the "Create View" button.
3. Select the "Blank View" option.
4. Customize your view using the visual designer.

### Add and edit fields

1. Open your view in the visual designer.
2. Click on the "Add Field" button.
3. Select the type of field you want to add.
4. Customize the field properties as necessary.

Congratulations, you have now created your first App2 application!
