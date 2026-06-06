# EPIC Release 1.0

This folder contains the Docker Compose files and Docker image archives needed to launch EPIC without rebuilding from source.

## Contents

- `docker-compose.yml` - production compose file using prebuilt images
- `.env.example` - compose environment template
- `server.env.example` - server runtime environment template
- `caddy/Caddyfile` - reverse proxy configuration
- `schema.faker.graphql` - GraphQL faker schema mounted by the faker service
- `doctor.sh` - preflight checks for Docker, env files, compose validity, and disk space
- `smoke-test.sh` - post-launch checks for HTTP, healthcheck, GraphQL, MySQL, Redis, and MinIO
- `backup.sh` - MySQL dump plus Docker volume archive backup
- `restore-mysql.sh` - guarded MySQL restore helper
- `PRODUCTION_CHECKLIST.md` - deployment checklist for real exercise use
- `RELEASE_MANIFEST.md` - packaged image IDs and operational entry points
- `images/` - Docker image tar archives

## Launch on a Linux VM

1. Install Docker Engine and the Docker Compose plugin.
2. Copy this folder to the VM.
3. From inside `release 1.0`, load the images:

```bash
chmod +x *.sh
./load-images.sh
```

4. Create local env files:

```bash
cp .env.example .env
cp server.env.example server.env
```

5. Edit `.env` and `server.env` for the VM domain, passwords, and API keys.
6. Run preflight checks:

```bash
./doctor.sh
```

7. Start the app:

```bash
./start.sh
```

8. Check status:

```bash
docker compose ps
docker compose logs -f server
```

9. Run the smoke test:

```bash
./smoke-test.sh
```

The app is exposed through Caddy on ports `80` and `443`.

## Backups

Run a backup from inside this folder:

```bash
./backup.sh
```

Backups are written under `./backups/<timestamp>/` by default. To use another location:

```bash
BACKUP_DIR=/mnt/epic-backups ./backup.sh
```

Restore a MySQL dump into a running stack:

```bash
./restore-mysql.sh backups/<timestamp>/mysql-all-databases.sql
```

## Notes

- MySQL, Redis, MinIO, and Caddy data are stored in Docker named volumes.
- Back up the `mysql_data`, `redis_data`, `minio_data`, `caddy_data`, and `caddy_config` volumes.
- Change all default passwords before using this outside a local test VM.
- Read `PRODUCTION_CHECKLIST.md` before using this release for a real exercise.
