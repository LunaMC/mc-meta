#!/usr/bin/env bash

# Decrypt private push key
openssl aes-256-cbc -K $encrypted_24624dd287c1_key -iv $encrypted_24624dd287c1_iv -in .build/resources/id_rsa.enc -out ~/.ssh/id_rsa -d

# First time git setup
git config --global user.name "LunaMC Auto Deployment"
git config --global user.email max.walsch@gmail.com

# Git add, commit and push
git add target/* || exit 0
git commit -m "Update data" || exit 0
git push origin master || exit 0
