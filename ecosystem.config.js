module.exports = {
  apps: [
    {
      name: "alerta",
      script: "server.js",
      instances: 1,           // 1 instancia; si querés clúster: "max"
      exec_mode: "fork",      // o "cluster"
      watch: false,
      env: {
        NODE_ENV: "development"
        // En dev, server.js ya carga .env (dotenv) del directorio
      },
      env_production: {
        NODE_ENV: "production"
        // En prod también lee .env (dotenv). No guardes secretos acá.
      }
    }
  ]
}
