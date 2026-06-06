# EPIC Release 1.0 Manifest

Generated: 2026-06-06

## Packaged Images

| Image | Image ID |
|---|---|
| `epic-modernized-client:latest` | `sha256:2271963cdf1e2013f99fc4dfa4f8b7c4b9a7c28851acf294e9c0c1b8ab5e2c11` |
| `epic-modernized-server:latest` | `sha256:0426bd698311d417f8b056391b20c0ec492ace5a9ad59074ccd25c0c2a7ee725` |
| `caddy:2.8-alpine` | `sha256:af32e97399febea808609119bb21544d0265c58a02836576e32a2d082c262c17` |
| `mysql:5.7` | `sha256:4bc6bc963e6d8443453676cae56536f4b8156d78bae03c0145cbe47c2aad73bb` |
| `redis:7-alpine` | `sha256:6ab0b6e7381779332f97b8ca76193e45b0756f38d4c0dcda72dbb3c32061ab99` |
| `prismagraphql/prisma:1.34.10` | `sha256:de3e5a9d44c4e0cd24af9a9d435b8893a11a494d408d9f610fcfccfee1f99d28` |
| `minio/minio:RELEASE.2025-04-22T22-12-26Z` | `sha256:a1ea29fa28355559ef137d71fc570e508a214ec84ff8083e39bc5428980b015e` |
| `minio/mc:RELEASE.2025-04-16T18-13-26Z` | `sha256:aead63c77f9db9107f1696fb08ecb0faeda23729cde94b0f663edf4fe09728e3` |
| `apisguru/graphql-faker:latest` | `sha256:55c153a02c321e38e8f03cd89ca502f1d38a21de5917cdeed3bced62c68edebe` |

## Operational Entry Points

- Preflight: `./doctor.sh`
- Load images: `./load-images.sh`
- Start stack: `./start.sh`
- Post-launch smoke test: `./smoke-test.sh`
- Backup: `./backup.sh`
- MySQL restore: `./restore-mysql.sh <dump.sql>`

## Persistence

The release uses Docker named volumes:

- `mysql_data`
- `redis_data`
- `minio_data`
- `caddy_data`
- `caddy_config`

Backups created by `backup.sh` include a MySQL logical dump, volume archives, rendered compose config, env snapshots, and service status.

## Security Notes

The included `.env` and `server.env` are launchable test defaults. Replace secrets before production use.
