const cardanoCrypto = require('cardano-crypto.js');

import {
  ADA_DERIVATION_SCHEME,
  ADA_DERIVATION_PATH,
  HARDENED_THRESHOLD,
} from '../constants';

/**
 * Generate an Ada key for the standard derivation path
 * @param mnemonic mnemonic seed to use
 * @returns the key buffer
 */
const generateKey = async (mnemonic: string): Promise<Buffer> => {
  const walletSecret = await cardanoCrypto.mnemonicToRootKeypair(mnemonic, ADA_DERIVATION_SCHEME);
  return ADA_DERIVATION_PATH
    .split('/')
    .slice(1)
    .map(index => index.slice(-1) === '\'' ? HARDENED_THRESHOLD + parseInt(index.slice(0, -1)) : parseInt(index))
    .reduce((secret, index) => cardanoCrypto.derivePrivate(secret, index, ADA_DERIVATION_SCHEME), walletSecret);
};

/**
 * Generate an Ada private key for the standard derivation path
 * @param mnemonic mnemonic seed to use
 * @param i derivation index of private key to generate
 * @returns the private key string
 */
const generatePrivateKey = async (mnemonic: string, i: number): Promise<string> => {
  return cardanoCrypto.derivePrivate(
    await generateKey(mnemonic),
    i,
    ADA_DERIVATION_SCHEME
  ).slice(0, 64).toString('hex');
}

/**
 * Generate an Ada public key for the standard derivation path
 * @param mnemonic mnemonic seed to use
 * @returns the public key string
 */
const generatePublicKey = async (mnemonic: string): Promise<string> => {
  return (await generateKey(mnemonic)).slice(64, 128).toString('hex');
}

export default {
  generatePrivateKey,
  generatePublicKey
}
