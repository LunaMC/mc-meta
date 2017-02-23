#!/usr/bin/env bash

# Decrypt private push key
mkdir -p ~/.ssh
openssl aes-256-cbc -K $encrypted_24624dd287c1_key -iv $encrypted_24624dd287c1_iv -in .build/resources/id_rsa.enc -out ~/.ssh/id_rsa -d
chmod 600 ~/.ssh/id_rsa

# First time git setup
git config --global user.name "LunaMC Auto Deployment"
git config --global user.email max.walsch@gmail.com

# Setup deployment remote
git remote add deployment git@github.com:LunaMC/mc-meta.git

# Git add, commit and push
git add --all || exit 0
git commit -m "Update data [ci skip]" || exit 0
git push deployment master || exit 0
