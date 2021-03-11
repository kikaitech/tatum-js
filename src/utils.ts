const cardanoCrypto = require('cardano-crypto.js');
import {
  ADA_DERIVATION_PATH,
  HARDENED_THRESHOLD,
} from './constants';
/**
 * Generate Ada key (private key or public key)
 * @param mnemonic mnemonic seed to use
 * @param startInd An integer that specifies where to start the selection in the slice() function
 * @param endInd An integer that specifies where to end the selection in the slice() function
 * @returns string
 */
export const generateAdaKey = async (mnemonic: string, privateKey: boolean): Promise<string> => {
  const derivationScheme = 1;
  const walletSecret = await cardanoCrypto.mnemonicToRootKeypair(mnemonic, derivationScheme);
  const key = ADA_DERIVATION_PATH
    .split('/')
    .slice(1)
    .map(index => index.slice(-1) === '\'' ? HARDENED_THRESHOLD + parseInt(index.slice(0, -1)) : parseInt(index))
    .reduce((secret, index) => cardanoCrypto.derivePrivate(secret, index, derivationScheme), walletSecret)

  return privateKey ? key.slice(0, 63).toString('hex') : key.slice(64, 128).toString('hex');
};