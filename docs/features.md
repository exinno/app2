
##### `No-code`

# Create new apps
## Create App from Container UI
Allow users to create a new project using a graphical user interface.
## Initial Data Loading
Allow users to import initial data for their app using CSV files.

# Manage my apps
## My Apps
Provide a dashboard where users can see and manage all of their created apps.
## Remove App
Allow users to delete an app from the platform.
## Start/Stop App
Allow users to start and stop an app.
## Show App Log
Allow users to view logs related to the app.

# App Template
## Create App from Template
Allow users to create a new project by copying an existing template using a command line interface.
## App Template
Provide a set of pre-built templates for users to choose from when creating a new project.

# Authentications
## User Registration
Provide a user registration process that allows new users to create an account and log in to the application.
## Authenticate with password
Implement an authentication mechanism to verify user identity before accessing the application. This can be through a username and password
## Session Management
Implement session management to handle user sessions and ensure they are securely terminated upon logging out or inactivity. Session failover should be supported.
## User Group Management
Allow users to be grouped together to make it easier to manage permissions and access controls.
## User Profile Management
Allow users to manage their profiles and update personal information, such as name, email, image, and contact details.
## Password Policy
Enforce password policies to ensure user account security. Policies could include a minimum length, complexity.
## Account Lockout
Implement a mechanism that locks out a user's account after multiple failed login attempts.
## Password Recovery
Provide users with a password recovery process that allows them to reset their password through email or SMS.
## User Activity Logging
Log user activity for auditing and compliance purposes.
## Account Deactivation
Allow Admins to deactivate or suspend user accounts for security or other reasons.
## User deletion
Allow users to withdraw and completely delete their personal information. Allow admins to delete user accounts permanently.
## User encryption
Encrypt user data in transit and at rest to prevent unauthorized access and protect sensitive information.

# Manage spaces
## Create Space
Users should be able to create a new collaboration space for a specific project or team.
## Manage Space
Users should be able to manage the settings of a collaboration space they own, including permissions, access, and privacy.
## Invite Members
Users should be able to invite other team members to a collaboration space with specific roles and permissions.
## Invite External Users
Users should be able to invite external collaborators to a collaboration space with specific roles and permissions.
## Search Space
Enable users to search for spaces by name or keyword.
## Space Permissions
Allow users to set permissions for each space, determining who can view, edit, and delete content within the space.

# Drive
## New File
You can upload files stored on your device or directly edit and create files of a specific format.
## Files Management
Users should be able to store and organize files and documents within a collaboration space, with features such as versioning, commenting, and access control.
## File Versioning
Automatically create a new version of a file when it is edited, allowing users to easily track changes and restore previous versions if necessary.
## File Permissions
Allow users to set permissions for each file, determining who can view, edit, and download the file.
## File Comments
Enable users to add comments to files, allowing for collaboration and feedback.

# Drive Apps
## Image Viewer
The file storage system should include a built-in image viewer for easy preview and navigation of image files.
## PDF Viewer
The file storage system should include a built-in PDF viewer for easy preview and navigation of PDF files.
## Collaborative Spreadsheet
Users should be able to create and edit spreadsheets collaboratively within a collaboration space, with features such as formulas, charts, and formatting.
## Collaborative Document
Users should be able to create and edit documents collaboratively within a collaboration space, with features such as rich text formatting, images, tables, and embedded media.
## Markdown Editor
You can use the markdown editor to create and download Drive markdown documents.

# Tasks
## Task Management
Users should be able to create, assign, and manage tasks within a collaboration space, with features such as due dates, priorities, and progress tracking.

# Navigation
## Searchable, Hierarchy, Menu
 It should also be easy to navigate, with a searchable, hierarchical menu that allows users to quickly find the information they need.

# Personalization	
## Recent
Feature that displays recently accessed or edited items.
## Pinned(Bookmark)
Feature that allows users to bookmark frequently used tasks or pages for quick access.

# View designer
## View designer
Enable users to easily design view model with an intuitive drag-and-drop interface, including WYSIWYG editor for real-time preview of design changes.
## Property Editor
Provides the ability to edit various properties of the selected elements in the view designer.
## Code Editor
Allows users to edit the underlying code of the view model, providing more advanced customization options.
## Preview
Enables users to preview the view model in real-time, providing immediate feedback on any changes made.
## Preview by device
Allows users to preview the view model on different devices to ensure that it is optimized for all platforms.
## Undo / Redo
Provides the ability to undo or redo changes made in the view designer.
## Save model to source
Enables users to save the view model to the source code, ensuring that it is backed up and can be easily restored.
## Auto update schema
Automatically updates the view schema when changes are made to the view model, ensuring that the two remain in sync.
## Fileds editing
Provides the ability to edit individual fields within the view model, making it easy to make targeted changes.
## Permission check
Checks user permissions to ensure that only authorized users can access or edit the view model.

# internationalization(i18n)
## Multilingual support
Support multiple languages for message, model, 3rd party libraries, and data.
## Multilingual automation
Automatically find missing messages and automatically translate and reflect them.
## Multitimezone support
Support multiple timezones for users and data.

##### `Low-code`

# Models
## Help & Guide
 A model that provides user help and explanations, helping users understand and use the app or system.
## Datasource Model
A model that defines how to interact with data sources such as databases and external APIs, defining APIs and logic to retrieve or update data from data sources.
## Menu Model
A model that defines the menu and navigation configuration of the user interface, designing the menu layout to make it easy for users to navigate within the app and find desired features.
## View Model
A model that defines the user interface configuration of the app, visually displaying the app's data and processing user interactions.
## Field Model
A model that defines the fields used to display data retrieved from data sources. It defines the data type, validation rules, layout, and security settings of the fields.
## Choice Model
A model that defines the list of options that can be selected in the user interface. It defines the items that can be selected in UI elements such as dropdown menus, radio buttons, and checkboxes.
## Validation Model
A model that defines the validation rules for field input values. It ensures that submitted data is in the correct format, preventing errors and ensuring data accuracy.
## Web Action Model
A model that defines actions executed on the web browser side.
## Server Action Model
A model that defines actions executed on the server side.
## Config, Auth Model
A model that manages system settings and user authentication. It defines settings related to system components and authentication logic for users.

# View Container
## Tab View
A container view that displays multiple tabs, each containing a different set of content.
## Section View
A container view that organizes content into sections or groups.
## Split View
A container view that divides the screen into two or more sections, each displaying different content.

# View
## View
### View Types
Define the different types of views that will be supported by the platform, including forms, tables, grids, charts, calendars and more
### View Group
Related to Toolbar title, Save view, Save custom view
### Event handling
onClick, onRightClick, onCreated, onMounted, onUnmounted...
### View Toolbar
Provide a customizable toolbar that appears on top of views and allows users to perform web actions such as add, edit, delete, and refresh data.
### View Toolbar Title
Displays the title and icon of the View on the left side of the toolbar. The toolbar should switch to a dropdown if there is a view with the same viewGroup.
### Built-in Actions
Refresh, Fullscreen and more

## Data View
### Real-time update
### View Search
Provide a search function within views that allows users to search for specific fields based on keywords. Must be applied in all views that inherit from the Data View, such as DataGridView and ListView.
### View sharing and collaboration
Allow users to share views with specific users or groups, set permissions, and collaborate on the same view.
### Comment
Allow users to add comments to records or specific fields in a view, to provide additional context or collaboration.
### Activity
Provide an activity log or feed in a view, to track changes made to records or fields, and by whom.
### Data Validation
Apply data validation rules to ensure data accuracy and consistency.
### Computed field

## Create View
### Create an empty view
Allow users to create a new, empty view to start working with data.
### Create view from Excel
Allow users to create a new view by importing data from an Excel file or a CSV file.
### Create views with AI
Allow users to create or modify views using natural language or a chatbot interface powered by AI, such as GPT-3

## Manage View
### Add Field
Add a column on view menu 
### Edit Field
Edit the name and type of a column on column menu 
### Field placement
Adjust the visible columns and placement of datagrid and forms
### Save view
Save the view by changing the order and sorting and the filter conditions. Only admin and the owner of the view is allowed.
### Save custom view
A regular user changes a view and saves it as a custom view with a different name. Personalize and save views, similar to Airtable

# View components
## DataGrid View
### Data Export	
Allow users to export data from views to formats such as Excel, CSV.
### Data Import	
Enable users to import data into views from external sources such as Excel, CSV, and Clipboard.
### Filtering	
Enable filtering of data in views based on criteria such as date ranges, categories, and keywords.
### Sorting	
Allow users to sort data in views by one or more columns.
### Excel like Filter	
Users can filter data in views using an Excel-like filter interface.
### Filter builder	
Users can create complex filters in views using a filter builder interface.
### In-line editing	
Allow users to edit data directly in the DataGrid View, without having to open a separate edit window.
### Form Editing	
Users can edit data in views using a separate edit form.
### Aggregation	
Enable users to perform aggregation functions such as sum, count, average, and maximum/minimum values in views.
### Grouping	
Allow users to group data in views by one or more columns.
### Formatting	
Provide a range of formatting options for views, such as font styles, colors, and alignment.
### Pagination	
Implement pagination in views to improve performance and allow users to navigate through large data sets.
### Undo/Redo	
Allow users to undo or redo changes made to data in the DataGrid View.
### Transposed(Pivot) 
editing	Allow users to edit data in a transposed view, where rows and columns are swapped.
### Change column style	
color, font.., Like conditional formatting

## Pivot View
### Pivot table	
Allow users to create pivot tables to summarize and aggregate data in a DataGrid View.
### Pivot chart	
Allow users to create pivot charts to visualize data from a pivot table.
### Pivot filtering	
Allow users to filter data in a pivot table or chart, based on one or more criteria.
### Pivot drill-down	
Allow users to drill down into detailed data from a pivot table or chart, to see underlying records or values.
### Pivot data export	
Allow users to export pivot table or chart data to other formats, such as CSV or Excel.
### Server-side Aggregation	
Add server-side aggregate capabilities to PivotView

## List View		
Displays a list of items
## Dashboard View		
Displays an overview of data in charts and graphs. Design a customizable dashboard that displays relevant data to users.
## Form View		
Displays a form for inputting data
## QueryBuilder View		
Allows users to build queries for DataGrid View
## Chart View		
Displays data in a graphical format
## Script View		
Allows users to write and execute custom scripts
## Kanban View		
Displays data in a kanban-style format
## HTML View		
Displays custom HTML content
## Markdown View		
Displays content written in Markdown format
## Chat View		
Allows users to chat and communicate with each other
## File View		
File Viewer and Editor
## Pivot View		
Displays data in a pivot table format
## Custom View		
Allows users to create their own custom views
## Calendar View		
Displays a calendar for scheduling events
## Gantt View		
Displays a timeline for scheduling projects
## Comment View		
Allows users to leave comments and feedback
## NestedList View		
Displays a nested list of items
## Attachment View		
Allows users to add and view attachments
## Gallery View		
Displays a grid or slideshow of images or other media files.

# Fields components
## String Field		
Field used for text input
## Number Field		
Field used for numeric input
## Select Field		
Field used for selecting options from a dropdown list
## Checkbox Field		
Field used for boolean input
## Date Field		
Field used for selecting a date
## Text Field		
Field used for longer text input
## Icon Field		
Field used for displaying an icon
## JSON Field		
Field used for JSON input
## DataGrid Field		
Field used for displaying data in a grid
## ModalView Field		
Field used for displaying a modal view
## Percent Field		
Field used for numeric input as a percentage
## Script Field		
Field used for scripting input
## Prop Field		
Field used for displaying a property
## Currency Field		
Field used for numeric input with currency formatting
## RichText Field		
Field used for rich text input
## Lookup Field		
Field used for looking up data from a source
## Choice Field		
Field used for selecting one or multiple choices
## Color Field		
Field used for selecting a color
## Signature Field		
Field used for capturing a signature
## Mask Field		
Field used for input with a specified mask
## Image Field		
Field used for uploading and displaying images
## ImageEditor Field		
Field used for editing images
## Label Field		
Field used for displaying a label
## Custom Field		
Field used for creating a custom field
## Sheet Field		
Field used for displaying data in a spreadsheet-like view
## Breadcrumb Field		
Field used for displaying a breadcrumb trail
## List Field		
Field used for displaying data in a list
## View Field		
Field used for displaying a view
## QRScanner Field		
Field used for scanning QR codes

# Security 
## Access Control
### Fine-grained access controls
Limit user access to authorized resources and data using role-based, object-level, and attribute-based access controls.
### Object access control
Use custom filter logic or pre-defined ACL to control data(object) access.
### Access control for views, menus, and actions
Control access to views, menus, and actions using ACL.
### ACL management
Manage users, groups, and ACL. Allow for inline ACL definition in view model.
## Data Protection
### User data protection
Use robust security mechanisms to protect user data from unauthorized access.
### Encrypting data in transit
Apply SSL to internet transport and encrypt packets to further protect them from tampering.
### DB encryption
Provides a DB encryption feature that allows users to encrypt fields flexibly.

# Data management
Support for multiple data sources, including APIs, databases, and web services. This can include measures such as defining an API to interact with the different data sources, abstracting the data access logic, and ensuring that the data sources are scalable, reliable and easy to use.
## Resutful CRUD API
Providing a RESTful API to enable the Create, Read, Update and Delete (CRUD) operations on data. This can include measures such as ensuring that the API is secure, scalable and easy to use, and supports all the necessary CRUD operations.
## Multi-Datasource
Provide a data service abstraction layer to separate the underlying data storage mechanism from the application code. This can include measures such as defining an API to interact with the data service layer, abstracting the data access logic, and ensuring that the data service layer is scalable, reliable and easy to use.
## Real-time Data
Provide real-time data access and synchronization capabilities. This can include measures such as implementing a publish-subscribe mechanism, defining an API for real-time data access, and ensuring that the real-time data access mechanism is scalable and reliable.
## OData v4 support
Which is an open standard for building and consuming RESTful APIs. This can include measures such as defining an API to interact with OData v4, ensuring that the platform supports all the necessary OData v4 operations, and ensuring that the OData v4 implementation is scalable and secure.
## Optimistic Locking
Prevent data inconsistencies by implementing optimistic locking. This can include measures such as adding a version column to the data, checking the version number before updating the data, and ensuring that the platform supports all the necessary optimistic locking operations.
## Audit log
Implement an audit log to track all the data changes made by the users. This can include measures such as adding an audit trail to the data, ensuring that the audit trail is tamper-proof and secure, and providing the necessary tools to search and filter the audit log.
## Alternative key
Support alternative keys for data records, which can be used to uniquely identify records. This can include measures such as defining an API to interact with alternative keys, ensuring that the platform supports all the necessary alternative key operations, and ensuring that the alternative key implementation is scalable and secure.
## Update updated/created date/user
Update / create date of the data modified

##### `Pro-code`

# Dev tools
## Cloud IDE
Web-based Visual Studio IDE for users to develop and manage 
## Cloud DB Tool
Web-based tool to manage and view data in the user's database.

# Custom code
Provide various event handlers (hooks) on both server-side and web-side, as well as dynamic model properties to enable users to extend the platform's functionality with custom code and integrations for automated business processes.
## Web Actions
Front-end script
## Server Actions
Server-side script
## SQL data service
joins, sql field....

# Cross browsing
Cross-browser compatibility for mobile web (iPhone Chrome/Safari), web (Mac Safari, Firefox)




