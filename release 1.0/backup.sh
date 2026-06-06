#!/usr/bin/env bash
set -euo pipefail

project="${COMPOSE_PROJECT_NAME:-epic-release-1-0}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_root="${BACKUP_DIR:-./backups}"
backup_dir="${backup_root}/${stamp}"

mkdir -p "${backup_dir}"
backup_host_dir="$(cd "${backup_dir}" && pwd)"

echo "Writing backup to ${backup_dir}"

echo "Backing up MySQL logical dump..."
docker compose exec -T mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases --single-transaction --routines --events' \
  > "${backup_dir}/mysql-all-databases.sql"

echo "Capturing Docker volume archives..."
for volume in mysql_data redis_data minio_data caddy_data caddy_config; do
  volume_name="${project}_${volume}"
  echo "Backing up ${volume_name}..."
  docker run --rm \
    -v "${volume_name}:/volume:ro" \
    -v "${backup_host_dir}:/backup" \
    caddy:2.8-alpine \
    tar czf "/backup/${volume}.tgz" -C /volume .
done

echo "Saving release environment and compose metadata..."
cp .env "${backup_dir}/env.backup"
cp server.env "${backup_dir}/server.env.backup"
docker compose config > "${backup_dir}/docker-compose.rendered.yml"
docker compose ps > "${backup_dir}/docker-compose.ps.txt"

cat > "${backup_dir}/RESTORE_NOTES.txt" <<EOF
Backup created: ${stamp}

Restore MySQL only:
  ./restore-mysql.sh "${backup_dir}/mysql-all-databases.sql"

Volume archives are included for disaster recovery:
  mysql_data.tgz
  redis_data.tgz
  minio_data.tgz
  caddy_data.tgz
  caddy_config.tgz

For full volume restore, stop the app first and restore carefully on a fresh VM.
EOF

echo "Backup complete: ${backup_dir}"
