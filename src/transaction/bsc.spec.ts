import {Currency, DeployEthErc20, TransferBscBep20, TransferCustomErc20} from '../model';
import {
  bscGetGasPriceInWei,
  prepareBscOrBep20SignedTransaction,
  prepareCustomBep20SignedTransaction,
  prepareDeployBep20SignedTransaction,
  sendBep721Transaction,
  sendBscSmartContractMethodInvocationTransaction,
  sendBscSmartContractReadMethodInvocationTransaction,
  sendBurnBep721Transaction,
  sendDeployBep721Transaction,
  sendMintBep721Transaction,
  sendMintMultipleBep721Transaction
} from './bsc';

describe('BSC transactions', () => {
  it('should test valid transaction BSC data', async () => {
    const body = new TransferBscBep20();
    body.fromPrivateKey = '0x2dedb85f2a87f17e143dbd5e51a589f27b4c6acf6bf29ebff8eb5c32b5e9de05';
    body.amount = '0';
    body.currency = Currency.BSC;
    body.to = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    const txData = await prepareBscOrBep20SignedTransaction(body);
    expect(txData).toContain('0x');
  });

  it('should test valid transaction ERC20 data', async () => {
    const body = new TransferBscBep20();
    body.fromPrivateKey = '0x2dedb85f2a87f17e143dbd5e51a589f27b4c6acf6bf29ebff8eb5c32b5e9de05';
    body.amount = '0';
    body.currency = Currency.PLTC;
    body.to = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    const txData = await prepareBscOrBep20SignedTransaction(body);
    expect(txData).toContain('0x');
  });

  it('should test valid custom transaction ERC20 data', async () => {
    const body = new TransferCustomErc20();
    body.fromPrivateKey = '0x2dedb85f2a87f17e143dbd5e51a589f27b4c6acf6bf29ebff8eb5c32b5e9de05';
    body.amount = '0';
    body.contractAddress = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    body.to = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    body.digits = 10;
    const txData = await prepareCustomBep20SignedTransaction(body);
    expect(txData).toContain('0x');
  });

  it('should test valid custom deployment ERC20', async () => {
    const body = new DeployEthErc20();
    body.fromPrivateKey = '0x2dedb85f2a87f17e143dbd5e51a589f27b4c6acf6bf29ebff8eb5c32b5e9de05';
    body.symbol = 'SYMBOL';
    body.name = 'Test_ERC20';
    body.supply = '100';
    body.address = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    body.digits = 10;
    const txData = await prepareDeployBep20SignedTransaction(body);
    expect(txData).toContain('0x');
  });

  it('should test invalid custom deployment ERC20, missing supply', async () => {
    const body = new DeployEthErc20();
    body.fromPrivateKey = '0x4874827a55d87f2309c55b835af509e3427aa4d52321eeb49a2b93b5c0f8edfb';
    body.symbol = 'SYMBOL';
    body.name = 'Test_ERC20';
    body.address = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    body.digits = 10;
    try {
      await prepareDeployBep20SignedTransaction(body);
      fail('Validation did not pass.');
    } catch (e) {
      console.error(e);
    }
  });

  it('should test invalid custom transaction ERC20 data, missing digits', async () => {
    const body = new TransferCustomErc20();
    body.fromPrivateKey = '0x4874827a55d87f2309c55b835af509e3427aa4d52321eeb49a2b93b5c0f8edfb';
    body.amount = '0';
    body.contractAddress = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    body.to = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    try {
      await prepareCustomBep20SignedTransaction(body);
      fail('Validation did not pass.');
    } catch (e) {
      console.error(e);
    }
  });

  it('should not test valid transaction data, missing currency', async () => {
    const body = new TransferBscBep20();
    body.fromPrivateKey = '0x4874827a55d87f2309c55b835af509e3427aa4d52321eeb49a2b93b5c0f8edfb';
    body.amount = '0';
    body.to = '0x8cb76aed9c5e336ef961265c6079c14e9cd3d2ea';
    try {
      await prepareBscOrBep20SignedTransaction(body);
      fail('Validation did not pass.');
    } catch (e) {
      console.error(e);
    }
  });

  it('should test ethGetGasPriceInWei', async () => {
    const gasPrice = await bscGetGasPriceInWei();
    expect(gasPrice).not.toBeNull();
  });

  it('should test read smart contract method invocation', async () => {
    const result = await sendBscSmartContractReadMethodInvocationTransaction({
      fromPrivateKey: '0x192afdb39073e202f200117b609e8d40c1c8f50c3baebe1bda4773db48df81a0',
      contractAddress: '0x595bad1621784e9b0161d909be0117f17a5d37ca',
      methodName: 'balanceOf',
      methodABI: {
        constant: true,
        inputs: [
          {
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      params: ['0x8c76887d2e738371bd750362fb55887343472346'],
    });
    console.log(result);
    expect(result).not.toBeNull();
  });

  it('should test write smart contract method invocation', async () => {
    const result = await sendBscSmartContractMethodInvocationTransaction({
      fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
      contractAddress: '0xd7d3e5e2174b530fdfb6d680c07c8b34495e2195',
      fee: {gasLimit: '40000', gasPrice: '200'},
      methodName: 'transferFrom',
      methodABI: {
        constant: false,
        inputs: [
          {
            name: 'from',
            type: 'address',
          },
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      params: ['0x811dfbff13adfbc3cf653dcc373c03616d3471c9', '0x8c76887d2e738371bd750362fb55887343472346', '1'],
    });
    expect(result).not.toBeNull();
  });

  it('should test bep 721 mint transaction', async () => {
    try {
      const tokenId = new Date().getTime().toString();
      const mintedToken = await sendMintBep721Transaction({
        to: '0x811dfbff13adfbc3cf653dcc373c03616d3471c9',
        tokenId,
        url: 'https://www.seznam.cz',
        fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
        contractAddress: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
        fee: {
          gasLimit: '50000',
          gasPrice: '110'
        }
      });
      console.log(tokenId);
      expect(mintedToken).not.toBeNull();
    } catch (e) {
      console.log(e);
    }
  });

  it('should test bep 721 mint multiple transaction', async () => {
    const firstTokenId = new Date().getTime();
    const secondTokenId = firstTokenId + 1;
    const mintedTokens = await sendMintMultipleBep721Transaction({
      to: ['0x811dfbff13adfbc3cf653dcc373c03616d3471c9', '0x811dfbff13adfbc3cf653dcc373c03616d3471c9'],
      tokenId: [firstTokenId.toString(), secondTokenId.toString()],
      url: ['https://www.seznam.cz', 'https://www.seznam.cz'],
      fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
      contractAddress: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
      fee: {
        gasLimit: '50000',
        gasPrice: '100'
      }
    });
    expect(mintedTokens).not.toBeNull();
  });

  it('should test bep 721 burn transaction', async () => {
    const burnBep721Token = await sendBurnBep721Transaction({
      tokenId: '1615552558810',
      fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
      contractAddress: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
      fee: {
        gasLimit: '5000000',
        gasPrice: '110'
      },
    });
    expect(burnBep721Token).not.toBeNull();
  });

  it('should test bep 721 send transaction', async () => {
    const sendBep721Token = await sendBep721Transaction({
      to: '0x811dfbff13adfbc3cf653dcc373c03616d3471c9',
      tokenId: '1615546122766',
      fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
      contractAddress: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
      fee: {
        gasLimit: '5000000',
        gasPrice: '100'
      },
    });
    expect(sendBep721Token).not.toBeNull();
  });

  it('should test bep 721 deploy transaction', async () => {
    const deployBep721Token = await sendDeployBep721Transaction({
      symbol: '1oido3id3',
      fromPrivateKey: '0x1a4344e55c562db08700dd32e52e62e7c40b1ef5e27c6ddd969de9891a899b29',
      name: '2123kd',
    });
    expect(deployBep721Token).not.toBeNull();
  });

});