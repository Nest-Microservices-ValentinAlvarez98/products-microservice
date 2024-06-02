# Product Microservice

## Dev

1. Clonar el repositorio.
2. Instalar dependencias.
3. Crear un archivo `.env` basado en el `env.template`.
4. Ejecutar migración de prisma `npx prisma migrate dev`.
5. Ejecutar en terminal el comando `docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats` para crear el servidor NATS en Docker Desktop.
6. Ejecutar `npm run start:dev`.
