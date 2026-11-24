# Nata's Drip

Aplicación de tienda con frontend React/Vite y backend Java Spring Boot conectado
a MySQL.

## Requisitos

- Node.js y npm
- JDK 21
- MySQL en ejecución

## Configuración local

1. Copia `.env.example` a `.env`.
2. Completa `DB_PASSWORD` con la contraseña de tu usuario MySQL.
3. Reemplaza `JWT_SECRET` por una clave aleatoria de al menos 32 caracteres.
4. Instala las dependencias del frontend:

   ```bash
   npm install
   ```

El backend crea la base `natasdrip_api` si no existe, administra sus tablas con
JPA y carga los datos iniciales desde
[`backend/src/main/resources/data.sql`](backend/src/main/resources/data.sql).
El usuario MySQL debe tener permiso para crear la base de datos. Los scripts
`database/*.sql` corresponden al esquema anterior y no se usan con este backend.

## Iniciar frontend y backend

Desde la raíz del proyecto:

```bash
npm run dev:all
```

Vite queda disponible en <http://localhost:5173> y reenvía `/api` a Spring Boot
en el puerto 8080. Swagger UI del backend está en
<http://localhost:8080/swagger-ui/index.html>.

También puedes iniciar cada servicio por separado:

```bash
npm run dev
npm run dev:backend
```

El comando `dev:all` detiene el otro servicio si uno de los dos termina.

## Validación

```bash
npm test
npm run build
```

Para ejecutar las pruebas del backend, desde la raíz:

```powershell
Set-Location backend
.\mvnw.cmd test
```
