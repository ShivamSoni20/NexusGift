const { Connection, PublicKey } = require('@solana/web3.js');

async function checkBalance() {
    const address = '2tRFtXAzWCpwdB4MSRn6bSDjVajtwD6EHZGPcsmVhLx3';
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    try {
        const balance = await connection.getBalance(new PublicKey(address));
        console.log(`\nAddress: ${address}`);
        console.log(`Balance: ${balance / 1e9} SOL`);
        console.log(`Network: Devnet\n`);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

checkBalance();
