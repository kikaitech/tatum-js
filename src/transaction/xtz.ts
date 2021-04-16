import { Sotez } from 'sotez';
import { TransferXtz } from '../model';
import { XTZ_DEFAULT_FEE } from '../constants';

const prepareTezos = (testnet: boolean) => {
  const url = testnet ? 'https://testnet-tezos.giganode.io' : 'https://mainnet-tezos.giganode.io';
  return new Sotez(url, 'main', {
    defaultFee: XTZ_DEFAULT_FEE,
    localForge: true,
    validateLocalForge: false,
    debugMode: false,
    useMutez: true,
  });
}

/**
 * Prepare a signed Xtz transaction with the private key locally. Nothing is broadcasted to the blockchain.
 * @param body content of the transaction to prepare.
 * @returns raw transaction data in hex, to be broadcasted to blockchain.
 */
export const sendXtzTransaction = async (body: TransferXtz, testnet: boolean):Promise<string> => {
  const tezos = prepareTezos(testnet);
  await tezos.importKey(body.privateKey);

  return (await tezos.transfer({
    to: body.to,
    amount: body.amount,
  })).hash;
};

/**
 * Broadcast a signed Xtz transaction to the blockchain.
 * @param txData raw transaction data in hex, to be broadcasted to blockchain.
 * @returns txId - the broadcasted transaction ID .
 */
export const broadcastXtzTransaction = async (txData: string, testnet: boolean):Promise<string> => {
  const tezos = prepareTezos(testnet);
  return (await tezos.silentInject(txData)).hash;
}
