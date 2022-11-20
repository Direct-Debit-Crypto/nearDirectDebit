#!/bin/sh

echo ">> Building contract"

near-sdk-js build src/contract.ts build/hello_near.wasm
near-sdk-js build src/direct_debit.ts build/direct_debit.wasm
