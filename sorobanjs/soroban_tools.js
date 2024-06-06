import { Keypair } from "@stellar/stellar-sdk";
import "dotenv/config"
import { exe } from "./interfaces.js";

async function generateKeypair() {
    const kp = await Keypair.random();
    const secret = kp.secret();
    const publicKey = kp.publicKey();
    console.log({ secret, publicKey });
    return { secret, publicKey };
}

// generateKeypair()

async function fundAccount() {
    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(process.env.PUBLIC_KEY)}`);
        const json = await response.json();
        console.log("Account funded!!", json, encodeURIComponent(process.env.PUBLIC_KEY));
    } catch (error) {
        console.error("error",error);
    }
}

// fundAccount()

async function storeAccount(){
    try{
        console.log("Storing account...", process.env.SECRET);
        await exe(`export SOROBAN_SECRET_KEY=${process.env.SECRET}`);
        console.log("Account stored!!");
        await exe(`soroban keys add sid --secret-key`)
        console.log("Account stored!!");
    }catch (e){
        console.error("error",e);
    }
}

storeAccount()