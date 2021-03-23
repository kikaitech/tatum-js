import {generatePrivateKey, getAddressFromPrivateKey} from '@binance-chain/javascript-sdk/lib/crypto';
import Neon, {wallet} from '@cityofzion/neon-js';
import {generateMnemonic, mnemonicToSeed} from 'bip39';
import {HDNode, Mnemonic} from 'bitbox-sdk';
import {bip32, networks} from 'bitcoinjs-lib';
import {hdkey as ethHdKey} from 'ethereumjs-wallet';
// @ts-ignore
import hdkey from 'hdkey';
import {RippleAPI} from 'ripple-lib';
import {Keypair} from 'stellar-sdk';
import {
    HARDENED_THRESHOLD,
    BCH_DERIVATION_PATH,
    BTC_DERIVATION_PATH,
    CELO_DERIVATION_PATH,
    ETH_DERIVATION_PATH,
    LTC_DERIVATION_PATH,
    LTC_NETWORK,
    LTC_TEST_NETWORK,
    LYRA_DERIVATION_PATH,
    LYRA_NETWORK,
    LYRA_TEST_NETWORK,
    TESTNET_DERIVATION_PATH,
    TRON_DERIVATION_PATH,
    VET_DERIVATION_PATH,
    ADA_DERIVATION_PATH,
} from '../constants';
import {Currency} from '../model';
// tslint:disable-next-line:no-var-requires
const TronWeb = require('tronweb');
// tslint:disable-next-line:no-var-requires
const cardanoCrypto = require('cardano-crypto.js');

export interface Wallet {

    /**
     * mnemonic seed
     */
    mnemonic: string;

    /**
     * extended public key to derive addresses from
     */
    xpub: string;
}

/**
 * Generate BnB wallet
 * @param testnet testnet or mainnet version of address
 * @returns wallet
 */
export const generateBnbWallet = async (testnet: boolean) => {
    const privateKey = generatePrivateKey();
    const prefix = testnet ? 'tbnb' : 'bnb';
    return {
        address: getAddressFromPrivateKey(privateKey, prefix),
        privateKey,
    };
};

/**
 * Generate VeChain wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateVetWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const path = testnet ? TESTNET_DERIVATION_PATH : VET_DERIVATION_PATH;
    const hdwallet = ethHdKey.fromMasterSeed(await mnemonicToSeed(mnem));
    const derivePath = hdwallet.derivePath(path);
    return {
        xpub: derivePath.publicExtendedKey().toString(),
        mnemonic: mnem
    };
};

/**
 * Generate Ethereum or any other ERC20 wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateEthWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const path = testnet ? TESTNET_DERIVATION_PATH : ETH_DERIVATION_PATH;
    const hdwallet = ethHdKey.fromMasterSeed(await mnemonicToSeed(mnem));
    const derivePath = hdwallet.derivePath(path);
    return {
        xpub: derivePath.publicExtendedKey().toString(),
        mnemonic: mnem
    };
};

/**
 * Generate BSC or any other BEP-20 or BEP-721 wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateBscWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    return generateEthWallet(testnet, mnem);
};

/**
 * Generate Celo or any other ERC20 wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateCeloWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const path = testnet ? TESTNET_DERIVATION_PATH : CELO_DERIVATION_PATH;
    const hdwallet = ethHdKey.fromMasterSeed(await mnemonicToSeed(mnem));
    const derivePath = hdwallet.derivePath(path);
    return {
        xpub: derivePath.publicExtendedKey().toString(),
        mnemonic: mnem
    };
};

/**
 * Generate Bitcoin Cash wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateBchWallet = (testnet: boolean, mnem: string): Wallet => {
    const m = new Mnemonic();
    const node = new HDNode();
    const rootSeedBuffer = m.toSeed(mnem);
    const hdNode = node.fromSeed(rootSeedBuffer, testnet ? 'testnet' : 'mainnet');
    const path = node.derivePath(hdNode, BCH_DERIVATION_PATH);
    return {
        mnemonic: mnem,
        xpub: node.toXPub(path),
    };
};

/**
 * Generate Bitcoin wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateBtcWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const hdwallet = hdkey.fromMasterSeed(await mnemonicToSeed(mnem), testnet ? networks.testnet.bip32 : networks.bitcoin.bip32);
    return {
        mnemonic: mnem,
        xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BTC_DERIVATION_PATH).toJSON().xpub
    };
};

/**
 * Generate Tron wallet
 * @returns mnemonic for the wallet
 */
export const generateTronWallet = async (mnem: string) => {
    const w = bip32.fromSeed(await mnemonicToSeed(mnem));
    const bip32Interface = w.derivePath(TRON_DERIVATION_PATH);
    return {
        mnemonic: mnem,
        xpub: bip32Interface.publicKey.toString('hex') + bip32Interface.chainCode.toString('hex')
    };
};

/**
 * Generate Litecoin wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateLtcWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const hdwallet = hdkey.fromMasterSeed(await mnemonicToSeed(mnem), testnet ? LTC_TEST_NETWORK.bip32 : LTC_NETWORK.bip32);
    return {
        mnemonic: mnem,
        xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : LTC_DERIVATION_PATH).toJSON().xpub
    };
};

/**
 * Generate Neo address and private key.
 */
export const generateNeoWallet = () => {
    const privateKey = Neon.create.privateKey();
    return {privateKey, address: new wallet.Account(privateKey).address};
};

/**
 * Generate Xrp address and secret.
 */
export const generateXrpWallet = () => {
    const {address, secret} = new RippleAPI().generateAddress();
    return {address, secret};
};

/**
 * Generate Stellar address and secret.
 * @param secret secret of the account to generate address
 */
export const generateXlmWallet = (secret?: string) => {
    const keypair = secret ? Keypair.fromSecret(secret) : Keypair.random();
    return {address: keypair.publicKey(), secret: keypair.secret()};
};

/**
 * Generate Scrypta wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateLyraWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const hdwallet = hdkey.fromMasterSeed(await mnemonicToSeed(mnem), testnet ? LYRA_TEST_NETWORK.bip32 : LYRA_NETWORK.bip32);
    return {mnemonic: mnem, xpub: hdwallet.derive(LYRA_DERIVATION_PATH).toJSON().xpub};
};

/**
 * Generate ADA wallet
 * @param mnemonic mnemonic seed to use
 * @returns wallet
 */
 export const generateAdaWallet = async (mnemonic: string): Promise<Wallet> => {
    const derivationScheme = 1;
    const walletSecret = await cardanoCrypto.mnemonicToRootKeypair(mnemonic, derivationScheme);
    const xpub = ADA_DERIVATION_PATH
                    .split('/')
                    .slice(1)
                    .map(index => index.slice(-1) === '\'' ? HARDENED_THRESHOLD + parseInt(index.slice(0, -1)) : parseInt(index))
                    .reduce((secret, index) => cardanoCrypto.derivePrivate(secret, index, derivationScheme), walletSecret)
                    .slice(64, 128)
                    .toString('hex');
    return { mnemonic, xpub };
};

/**
 * Generate wallet
 * @param currency blockchain to generate wallet for
 * @param testnet testnet or mainnet version of address
 * @param mnemonic mnemonic seed to use. If not present, new one will be generated
 * @returns wallet or a combination of address and private key
 */
export const generateWallet = (currency: Currency, testnet: boolean, mnemonic?: string) => {
    const mnem = mnemonic ? mnemonic : generateMnemonic(256);
    switch (currency) {
        case Currency.BTC:
            return generateBtcWallet(testnet, mnem);
        case Currency.LTC:
            return generateLtcWallet(testnet, mnem);
        case Currency.BCH:
            return generateBchWallet(testnet, mnem);
        case Currency.TRON:
        case Currency.USDT_TRON:
            return generateTronWallet(mnem);
        case Currency.CELO:
            return generateCeloWallet(testnet, mnem);
        case Currency.USDT:
        case Currency.WBTC:
        case Currency.LEO:
        case Currency.LINK:
        case Currency.UNI:
        case Currency.FREE:
        case Currency.MKR:
        case Currency.USDC:
        case Currency.BAT:
        case Currency.TUSD:
        case Currency.PAX:
        case Currency.PAXG:
        case Currency.PLTC:
        case Currency.XCON:
        case Currency.ETH:
        case Currency.BSC:
        case Currency.BETH:
        case Currency.BBTC:
        case Currency.BADA:
        case Currency.WBNB:
        case Currency.BDOT:
        case Currency.BXRP:
        case Currency.BLTC:
        case Currency.BBCH:
        case Currency.MMY:
            return generateEthWallet(testnet, mnem);
        case Currency.XRP:
            return generateXrpWallet();
        case Currency.XLM:
            return generateXlmWallet();
        case Currency.VET:
            return generateVetWallet(testnet, mnem);
        case Currency.NEO:
            return generateNeoWallet();
        case Currency.BNB:
            return generateBnbWallet(testnet);
        case Currency.LYRA:
            return generateLyraWallet(testnet, mnem);
        case Currency.ADA:
            return generateAdaWallet(mnem);
        default:
            throw new Error('Unsupported blockchain.');
    }
};
