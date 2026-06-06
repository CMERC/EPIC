# EPIC Release 1.0 Production Checklist

Use this before running EPIC for a real exercise.

## VM

- Linux VM has at least 8 vCPU, 32 GiB RAM; 64 GiB RAM is preferred for all-in-one deployments.
- Docker Engine and Docker Compose plugin are installed.
- Firewall allows only required inbound traffic: 80, 443, and restricted SSH.
- Data disk is mounted with enough free space for MySQL, Redis, MinIO, Caddy certs, and backups.
- Host time is synchronized with NTP.

## Secrets

- `.env` was created from `.env.example`.
- `server.env` was created from `server.env.example`.
- `MYSQL_ROOT_PASSWORD`, `MINIO_ROOT_PASSWORD`, and `PRISMA_SECRET` were changed from defaults.
- Any external API keys are present only in env files, not in docs or shell history.
- Env files are readable only by deployment administrators.

## Persistence

- MySQL, Redis, MinIO, Caddy data, and Caddy config are backed up.
- `./backup.sh` has been run and the resulting backup has been copied off the VM.
- `./restore-mysql.sh` has been tested on a non-production copy.
- Disk free space alerting is configured.

## Launch

- Images were loaded with `./load-images.sh`.
- Preflight passes with `./doctor.sh`.
- App starts with `./start.sh`.
- Smoke test passes with `./smoke-test.sh`.
- `docker compose ps` shows healthy services.

## Operations

- `DISABLE_SCHEDULER` is set intentionally.
- TLS/domain behavior has been verified through Caddy.
- Logs are reviewed after startup: `docker compose logs --tail 200 server caddy`.
- Backup schedule exists and is documented.
- A rollback copy of the previous release folder is retained.
