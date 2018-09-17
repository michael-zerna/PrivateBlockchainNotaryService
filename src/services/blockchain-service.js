/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
import { Block } from "../model/block";
const SHA256 = require('crypto-js/sha256');
const level = require('level');

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class BlockchainService {
    constructor(){
        this.chainDB = './db/chaindata';
        this.db = level(this.chainDB, {
            valueEncoding: 'json'
        });
    }

    // Add new block
    async addBlock(newBlock){
        // Block height
        const blockHeight = await this.getBlockHeight();
        newBlock.height = blockHeight + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        // previous block hash
        if(newBlock.height > 0){
            const lastBlock = await this.getBlock(blockHeight);
            newBlock.previousBlockHash = lastBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        await this.db.put(newBlock.height, newBlock);
        return newBlock;
    }

    async getLatestBlock() {
        const blockHeight = await this.getBlockHeight();
        return this.getBlock(blockHeight);
    }

    async getChainKeys() {
        return new Promise((resolve, reject) => {
            const result = [];
            this.db.createKeyStream()
                .on('data',  (data) => {
                    result.push(parseFloat(data));
                })
                .on('end',  () =>  resolve(result))
                .on('error',  (err) => {
                    reject(err);
                });
        });
    }

    async getChain() {
        return new Promise((resolve, reject) => {
            const result = [];
            this.db.createReadStream()
                .on('data',  (data) => {
                    result.push(data.value);
                })
                .on('end',  () =>  resolve(result))
                .on('error',  (err) => {
                    reject(err);
                });
        });
    }

    // Get block height
    async getBlockHeight(){
        const heights = await this.getChainKeys();
        return heights.length - 1;
    }

    // get block
    async getBlock(blockHeight){
        return this.db.get(blockHeight);
    }

    // validate block
    async validateBlock(blockHeight){
        // get block object
        let block = await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;

        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
            return true;
        } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    async validateChain(){
        let errorLog = [];
        const blockHeight = await this.getBlockHeight();
        for (let i = 0; i <= blockHeight; i++) {
            // validate block
            const isValid = await this.validateBlock(i);
            if (!isValid)errorLog.push(i);
            // compare blocks hash link
            let block = this.getBlock(i);
            if(i < blockHeight) {
                let nextBlock = this.getBlock(i+1);
                if (block.hash!==nextBlock.previousBlockHash) {
                    errorLog.push(i);
                }
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
        } else {
            console.log('No errors detected');
        }
    }
}

export const blockchainService = new BlockchainService();