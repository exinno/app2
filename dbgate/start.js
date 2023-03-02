process.env.PORT = process.argv[2];
process.env.WORKSPACE_DIR = process.argv[3];
console.log(`Start dbgate on port ${process.env.PORT}, on workspace ${process.env.WORKSPACE_DIR}`);
import('dbgate-serve/bin/dbgate-serve.js');

// for oracle: https://github.com/rinie/dbgate/tree/oracle/plugins/dbgate-plugin-oracle
