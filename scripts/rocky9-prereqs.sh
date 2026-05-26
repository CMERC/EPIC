#!/usr/bin/env bash
set -euo pipefail
sudo dnf -y install dnf-plugins-core curl ca-certificates git
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER" || true
echo "Docker installed. Log out/in or run: newgrp docker"
