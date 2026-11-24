# Base de datos MySQL

El frontend se comunica con la API Java; nunca se conecta directamente a MySQL:

```text
React/Vite (5173) ── /api ──▶ Spring Boot (8080) ──▶ MySQL (natasdrip_api)
```

## Requisitos y configuración

1. Instala y ejecuta MySQL.
2. Copia `.env.example` a `.env` en la raíz del proyecto.
3. Configura `DB_USER` y `DB_PASSWORD` para una cuenta MySQL que pueda crear la
   base de datos.
4. Cambia `JWT_SECRET` por un valor aleatorio de al menos 32 caracteres. No uses
   el valor de ejemplo en un entorno compartido o de producción.

La aplicación carga ese archivo `.env` al arrancar desde `backend/`. Por defecto
usa la base `natasdrip_api` en `localhost:3306`; puedes cambiar esos valores en
`.env`. Hibernate crea o actualiza las tablas y
[`backend/src/main/resources/data.sql`](../backend/src/main/resources/data.sql)
carga los datos iniciales al iniciar la API. No ejecutes
`database/01_schema.sql` ni `database/02_seed.sql` para esta versión: pertenecen
al esquema del backend anterior y no son compatibles con las tablas Java.

## Ejecutar

Desde la raíz del repositorio:

```bash
npm install
npm run dev:all
```

Abre <http://localhost:5173>. La API está en <http://localhost:8080> y su
documentación OpenAPI en <http://localhost:8080/swagger-ui/index.html>.

Para iniciar un servicio por separado, usa `npm run dev` para Vite o
`npm run dev:backend` para Spring Boot. El carrito se mantiene en el navegador;
los productos, usuarios, cupones y órdenes se gestionan mediante la API.

## Pruebas

```bash
npm test
npm run build
```

Las pruebas Java se pueden ejecutar desde la raíz con:

```powershell
Set-Location backend
.\mvnw.cmd test
```
