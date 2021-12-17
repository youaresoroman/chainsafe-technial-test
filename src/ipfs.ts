import { create, Options } from 'ipfs-http-client';
import { readFile } from 'fs';

/**
 * Add a file to IPFS
 * 
 * @param node - IPFS node to connect to
 * @param file - file to add
 * 
 * @returns cid of the file
 */

interface AddToIPFSProps {
    (props: {
        node?: Options, file: string
    }): Promise<string>
}

export const addToIPFS: AddToIPFSProps = async ({ node, file }) => {
    const client = create(node);
    let buffer = '';

    await readFile(file, 'utf8', async (err, data) => {
        if (err) {
            return console.log(err.message);
        }
        buffer = data;
    });

    const { cid } = await client.add(buffer);
    return cid.toString();
}