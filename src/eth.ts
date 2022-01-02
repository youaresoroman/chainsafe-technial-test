import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { readFile } from 'fs';
interface AddAccountProps {
    (props: {
        web3: Web3;
        privateKey: string;
    }): Web3
}

interface PrepareContractForInteractionsFunctionProps {
    provider: string;
    privateKey?: string;
    contractAddress: string;
    abiFile: string;
}

interface PrepareContractForInteractionsProps {
    (props: PrepareContractForInteractionsFunctionProps): Promise<{ contract: Contract, web3: Web3 }>
}

interface SetCIDProps {
    (props: PrepareContractForInteractionsFunctionProps & { cid: string }): Promise<string>
}

interface GetCIDProps {
    (props: PrepareContractForInteractionsFunctionProps): Promise<string>
}


interface ContractErrorResponse { message: string | PromiseLike<string>; }

/**
 * Reads an ABI file and returns the ABI object
 * 
 * @param file - file to read
 * @returns 
 */

export const readContractJSONFile = (file: string): Promise<AbiItem | AbiItem[]> => {
    return new Promise((resolve, reject) => {
        readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

/**
 * Adds an account to the web3 instance
 * 
 * @param web3 - web3 instance
 * @param privateKey - private key of the account
 */

export const addAccount: AddAccountProps = ({ web3, privateKey }) => {
    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    return web3;
}

/**
 * Prepares a web3 instance for interacting with a contract
 * 
 * @param provider - provider to use
 * @param privateKey - private key of the account
 * @param contractAddress - address of the contract
 * @param abiFile - ABI of the contract
 */

export const prepareContractForInteractions: PrepareContractForInteractionsProps = async ({
    provider,
    privateKey,
    abiFile,
    contractAddress,
}) => {
    const abi = await readContractJSONFile(abiFile);
    let web3 = new Web3(provider);

    if (privateKey) {
        web3 = addAccount({ web3, privateKey });
    }

    const contract = new web3.eth.Contract(abi, contractAddress)

    return {
        contract,
        web3
    }
}

/**
 * Gets the CID of a file and sets it on the contract
 * 
 * @param provider - provider to use
 * @param privateKey - private key of the account
 * @param contractAddress - address of the contract
 * @param abiFile - ABI of the contract
 * @param cid - CID of the file
 * 
 * @returns transaction hash
 */

export const setCid: SetCIDProps = async ({
    cid,
    provider,
    privateKey,
    abiFile,
    contractAddress,
}) => {
    return new Promise((resolve) => {
        (async () => {
            const { contract, web3 } = await prepareContractForInteractions({
                provider,
                privateKey,
                abiFile,
                contractAddress
            })
            await contract.methods.set(cid)
                .send({ from: web3.eth.defaultAccount, gasLimit: 500000 })
                .then((res: { transactionHash: string | PromiseLike<string>; }) => resolve(res.transactionHash))
                .catch((err: ContractErrorResponse) => resolve(err.message));
        })()
    })
}

/**
 * 
 * Gets the last CID from the contract
 * 
 * @param provider - provider to use
 * @param contractAddress - address of the contract
 * @param abiFile - ABI of the contract
 * 
 * @returns CID of the file
 */

export const getCid: GetCIDProps = async ({
    provider,
    abiFile,
    contractAddress,
}) => {
    return new Promise((resolve) => {
        (async () => {
            const { contract } = await prepareContractForInteractions({
                provider,
                abiFile,
                contractAddress
            })
            await contract.methods.get()
                .call()
                .then((res: string | PromiseLike<string>) => resolve(res))
                .catch((err: ContractErrorResponse) => resolve(err.message));
        })()
    })
}