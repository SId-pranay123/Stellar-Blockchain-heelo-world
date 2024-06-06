import { promisify } from "util";
import { exec } from "child_process";
import { Contract, SorobanRpc, TransactionBuilder, Networks, nativeToScVal,
    BASE_FEE, 
    Keypair } from "@stellar/stellar-sdk";

const execute = promisify(exec);

async function exe(command){
    let {stdout} = await execute(command, {stdio: 'inherit'});
    return stdout;
}
let contractAddress = "CCCFRNUGELJS7ESWCL2O3T2LC6MH477WGZDIIUGIXCOBQCAN6RQQXZ3O"

let rpcUrl = "https://soroban-testnet.stellar.org"

let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}

const stringToSym = (str) => {
    return nativeToScVal(str,{type: "symbol"})
}

async function contractInt(){
    let to = stringToSym("Sid")
    let values = [to]
    const kp = Keypair.fromSecret(process.env.SECRET);
    const caller = kp.publicKey();
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress)
    const buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call("hello", ...values))
        .setTimeout(30)
        .build();

    let prepareTx = await provider.prepareTransaction(buildTx);
    prepareTx.sign(kp);

    try{
        let sendTx = await provider.sendTransaction(prepareTx).catch(err => {
            return err
        })

        if(sendTx.errorResult){
            throw new Error("Unable to send Tx");
        }
        if (sendTx.status === "PENDING") {
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    }catch (e){
        console.error("error",e);
        return e
    }
}

export {exe, contractInt}