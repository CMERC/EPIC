#!/usr/bin/env bash
set -euo pipefail

for image in images/*.tar; do
  echo "Loading ${image}"
  docker load -i "${image}"
done
