import { exe, contractInt } from "./interfaces.js"
let contractAddress = "CCCFRNUGELJS7ESWCL2O3T2LC6MH477WGZDIIUGIXCOBQCAN6RQQXZ3O"


async function readContract() {
    try{
        let output = await exe(`soroban contract invoke --id ${contractAddress} --source-account sidpranay --network testnet -- hello --to Siddharth_pranay`)
        console.log(output);
    }catch (e){
        console.error("error",e);
    }
}

readContract()

// let res = await contractInt()
// console.log(res)