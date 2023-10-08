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

if [[ "yes" == *${proceed,,}* ]]; then
  echo "Cleaning up previous build(s)..."
  if [[ -d ./build/ ]]; then
      rm ./build/ -rf
      fi
  echo "Building..."
  npm run build
  rm "${INSTALL_DIR:?}/*" -rf
  cp -r ./build/* "$INSTALL_DIR"
  echo "Installation completed successfully."
else
  echo "Quitting..."
fi
