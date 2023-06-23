#!/usr/bin/env sh

set -env
npm run build
cd dist
git init
git add -addgit commit -m "New Deployment"