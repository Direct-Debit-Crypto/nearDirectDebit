#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near dev-deploy --wasmFile build/hello_near.wasm

echo ">> Remove old variable"
rm ./neardev/hello_neardev
cp ./neardev/dev-account ./neardev/hello_neardev
rm ./neardev/dev-account ./neardev/dev-account.env

echo ">> Deploying contract"
near dev-deploy --wasmFile build/direct_debit.wasm

echo ">> Remove old variable"
rm ./neardev/direct_debit_dev
cp ./neardev/dev-account ./neardev/direct_debit_dev
rm ./neardev/dev-account ./neardev/dev-account.env