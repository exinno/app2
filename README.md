# App2

## Introduction

App2 is a versatile and easy-to-use platform that enables organizations to streamline their digital transformation journey with the power of no-code, low-code, pro-code, collaboration platform, and generative AI. This is a repository for open-sourcing App2 development tools, common libraries, and template sources for developing apps based on App2.

### Key features

- AI-code: AI-code is a groundbreaking feature of App2 that generates entire screens and applications from natural language input.
- No-code: Build custom software in no time using pre-built components and importing data from Excel and other table data.
- Low-code: Modify the model in Visual Designer or using TypeScript, with changes reflected on the screen in real time.
- Pro-code: Write code directly in TypeScript (or JavaScript) with maximum control over the application.
- Collaboration: App2's collaboration features are streamlined within the workspace for a seamless team experience.

### Why App2?

- Multiple approaches to productivity: App2 allows organizations to develop applications using no-code, low-code, pro-code, and AI-powered app creation.
- Powerful and customizable apps: App2 enables customizable and powerful apps that meet unique business needs.
- Model simplicity and flexibility: App2's model-driven approach provides concise and flexible models that are easy to maintain.
- Support for code-based model maintenance: App2 allows developers to create and modify models using code in addition to the visual designer, which can lead to higher productivity.
- Robust security: App2 provides a secure and reliable platform for organizations to develop custom software with comprehensive access controls and audit logs.
- Versatile deployment options: App2 offers self-hosted, on-premises, and cloud deployment options to meet the needs of different organizations.

For more information, see [Introduction](/docs/introduction.md), [Introduction(한국어)](/docs/introduction_ko.md).

## Quick start

To get started, clone the repository and install the necessary dependencies. You'll need Node.js and npm installed on your machine to do this.

1. Pre-install Node.js(v18.x+), Yarn, Redis and Postgres. Only Windows(7+) is supported yet.
2. Clone the App2 repository(https://github.com/exinno/app2) to your local machine.
3. Set the Redis and Postgres connection information in the app2.env file.
4. Run yarn install in the root directory of the repository.
5. Run yarn start to start the container app.
6. Open the container app's UI http://localhost:3000 in your browser.
7. Create a new app through the container app's UI. The newly created app is placed in the apps directory.
8. Manage the source code of your new app separately by configuring a git repository.
9. You can manage your app through the container or run it by itself in the CLI with the command yarn start appName.

For more information, see [Quick start](/docs/quick-start.md).

## Documentation

Please see the [Documentation](/docs/index.md).

## License

The App2 low-code engine is a commercial product. However, the libraries, sample sources, and templates included in this repository are licensed under the MIT license. See the [LICENSE](/LICENSE) file for more information.

## Support

If you encounter any issues with App2, please submit an issue to the [issue tracker](/issues). For additional support or questions, please contact us at support@app2.ai

## Contributing

We welcome contributions from developers who want to create custom apps or plugins using App2. If you have an idea for an app or plugin that you'd like to develop using App2, please follow the guidelines below:

1. Develop your app or plugin using App2's No-code, Low-code, or Pro-code options.
2. Test your app or plugin to ensure it functions correctly.
3. Upload your app or plugin to your GitHub account.
4. Notify us of your app or plugin by emailing us at support@app2.ai.

Your contributions will be greatly appreciated by the App2 community and will help us improve the platform for everyone. If you have any questions or need assistance with developing your app or plugin, please don't hesitate to contact us at support@app2.ai.

Note that currently we do not have a marketplace for selling paid features, but we welcome developers to share their free apps and plugins on our website.

## Stay Connected

To stay up-to-date on the latest news and updates on App2, follow us on [Twitter](https://twitter.com/app2ai) and [LinkedIn](https://www.linkedin.com/exinno/app2).
