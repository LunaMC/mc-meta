#!/usr/bin/env bash

# Decrypt private push key
mkdir -p ~/.ssh
rm -f ~/.ssh/id_rsa
openssl aes-256-cbc -K $encrypted_1013681eee50_key -iv $encrypted_1013681eee50_iv -in .build/resources/id_rsa.enc -out ~/.ssh/id_rsa -d
chmod 600 ~/.ssh/id_rsa
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa

# First time git setup
git config --global user.name "LunaMC Auto Deployment"
git config --global user.email max.walsch@gmail.com

# Setup deployment remote
git remote add deployment git@github.com:LunaMC/mc-meta.git

# Git add, commit and push
git checkout master || exit 0
git add --all || exit 0
git commit -m "Update data [ci skip]" || exit 0
git push deployment master || exit 0
