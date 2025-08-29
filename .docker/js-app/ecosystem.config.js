module.exports = {
    apps: [
        {
            name: "node-app",
            script: "app/dist/index.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
