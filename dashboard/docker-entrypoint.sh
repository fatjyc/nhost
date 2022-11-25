#!/bin/sh

set -e

# read ports from env variables or use defaults
NEXT_PUBLIC_NHOST_MIGRATIONS_PORT="${NEXT_PUBLIC_NHOST_MIGRATIONS_PORT:=9693}"
NEXT_PUBLIC_NHOST_HASURA_PORT="${NEXT_PUBLIC_NHOST_HASURA_PORT:=9695}"
NEXT_PUBLIC_NHOST_LOCAL_BACKEND_PORT="${NEXT_PUBLIC_NHOST_LOCAL_BACKEND_PORT:=1337}"

# replace placeholders
find dashboard -type f -exec sed -i "s/__NEXT_PUBLIC_NHOST_MIGRATIONS_PORT__/${NEXT_PUBLIC_NHOST_MIGRATIONS_PORT}/g" {} +
find dashboard -type f -exec sed -i "s/__NEXT_PUBLIC_NHOST_HASURA_PORT__/${NEXT_PUBLIC_NHOST_HASURA_PORT}/g" {} +
find dashboard -type f -exec sed -i "s/__NEXT_PUBLIC_NHOST_LOCAL_BACKEND_PORT__/${NEXT_PUBLIC_NHOST_LOCAL_BACKEND_PORT}/g" {} +

exec "$@"