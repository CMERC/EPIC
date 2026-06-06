#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: $0 path/to/mysql-all-databases.sql" >&2
  exit 1
fi

dump_file="$1"

if [ ! -f "${dump_file}" ]; then
  echo "Dump file not found: ${dump_file}" >&2
  exit 1
fi

echo "This will restore MySQL from ${dump_file} into the running mysql container."
echo "Existing databases may be overwritten."
read -r -p "Type RESTORE to continue: " confirm

if [ "${confirm}" != "RESTORE" ]; then
  echo "Restore cancelled."
  exit 1
fi

docker compose exec -T mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < "${dump_file}"
echo "MySQL restore complete."
