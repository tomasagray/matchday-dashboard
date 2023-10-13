#!/bin/bash

# validate usage/help
if [ $# -eq 0 ] || [ "$1" == "-h" ]; then
  echo "Usage:  install.sh <installation_path>"
  exit 1
fi

INSTALL_DIR=$1
echo "Installing Matchday Dashboard to: ${INSTALL_DIR}..."
# ensure installation directory exists
if [[ ! (-d ${INSTALL_DIR}) ]]; then
  echo "Directory: ${INSTALL_DIR} does not exist; quitting..."
  exit 1
fi

echo "This will PERMANENTLY delete the previous installation."
read -rp "Are you SURE you want to proceed? [y/N]: " proceed

if [[ "" != "${proceed}" ]] && [[ "yes" == *${proceed,,}* ]]; then
  BUILD_COUNT=$(find ./build -printf '.' | wc -m)
  # '.' and '..' will be counted as 2
  if ((BUILD_COUNT < 3)); then
    echo "No build files found; please build with: npm run build"
    exit 1
  fi

  rm -rfv "${INSTALL_DIR:?}"/*
  cp -rv ./build/* "$INSTALL_DIR"
  echo "Installation completed successfully."
else
  echo "Quitting..."
fi
