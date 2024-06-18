const {ethers} = require('ethers');
const fs = require('fs');
const axios = require("axios");

const provider = new ethers.providers.JsonRpcProvider("节点rpc");

const claimContract = "*******" //部署的抢购合约


const batcherAbi = [{
    "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "inputs": [],
    "name": "ZK_token",
    "outputs": [{"internalType": "contract Tokenint", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address[]", "name": "_address", "type": "address[]"}],
    "name": "addToWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "components": [{
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
        }, {"internalType": "address", "name": "contractAddress", "type": "address"}, {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
        }, {
            "components": [{
                "internalType": "address",
                "name": "claimant",
                "type": "address"
            }, {"internalType": "uint256", "name": "expiry", "type": "uint256"}, {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }], "internalType": "struct Tokenint.ClaimSignatureInfo", "name": "claimSignatureInfo", "type": "tuple"
        }, {"internalType": "uint256", "name": "deadline", "type": "uint256"}, {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
        }, {"internalType": "bytes32", "name": "r", "type": "bytes32"}, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }], "internalType": "struct Batcher.Param[]", "name": "calls", "type": "tuple[]"
    }], "name": "bulkClaim", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address[]", "name": "_address", "type": "address[]"}],
    "name": "removeFromWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "whitelist",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}]
const iface = new ethers.utils.Interface(batcherAbi);
const ZkAbi = [{
    "inputs": [{"internalType": "uint256", "name": "expiry", "type": "uint256"}],
    "name": "DelegateSignatureExpired",
    "type": "error"
}, {"inputs": [], "name": "DelegateSignatureIsInvalid", "type": "error"}, {
    "inputs": [],
    "name": "ERC6372InconsistentClock",
    "type": "error"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "delegator", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "fromDelegate",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "toDelegate", "type": "address"}],
    "name": "DelegateChanged",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "delegate", "type": "address"}, {
        "indexed": false,
        "internalType": "uint256",
        "name": "previousBalance",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256"}],
    "name": "DelegateVotesChanged",
    "type": "event"
}, {"anonymous": false, "inputs": [], "name": "EIP712DomainChanged", "type": "event"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"}],
    "name": "Initialized",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
    }, {"indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32"}],
    "name": "RoleAdminChanged",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}],
    "name": "RoleGranted",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}],
    "name": "RoleRevoked",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
}, {
    "inputs": [],
    "name": "BURNER_ADMIN_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "BURNER_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "CLOCK_MODE",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "DELEGATION_TYPEHASH",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MINTER_ADMIN_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_from", "type": "address"}, {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "uint32",
        "name": "pos",
        "type": "uint32"
    }],
    "name": "checkpoints",
    "outputs": [{
        "components": [{
            "internalType": "uint32",
            "name": "fromBlock",
            "type": "uint32"
        }, {"internalType": "uint224", "name": "votes", "type": "uint224"}],
        "internalType": "struct ERC20VotesUpgradeable.Checkpoint",
        "name": "",
        "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "clock",
    "outputs": [{"internalType": "uint48", "name": "", "type": "uint48"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
    }],
    "name": "decreaseAllowance",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "delegatee", "type": "address"}],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "delegatee", "type": "address"}, {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "expiry", "type": "uint256"}, {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    }, {"internalType": "bytes32", "name": "r", "type": "bytes32"}, {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }], "name": "delegateBySig", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_signer", "type": "address"}, {
        "internalType": "address",
        "name": "_delegatee",
        "type": "address"
    }, {"internalType": "uint256", "name": "_expiry", "type": "uint256"}, {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
    }], "name": "delegateOnBehalf", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "delegates",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [{"internalType": "bytes1", "name": "fields", "type": "bytes1"}, {
        "internalType": "string",
        "name": "name",
        "type": "string"
    }, {"internalType": "string", "name": "version", "type": "string"}, {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
    }, {"internalType": "address", "name": "verifyingContract", "type": "address"}, {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
    }, {"internalType": "uint256[]", "name": "extensions", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "timepoint", "type": "uint256"}],
    "name": "getPastTotalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {
        "internalType": "uint256",
        "name": "timepoint",
        "type": "uint256"
    }],
    "name": "getPastVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}],
    "name": "getRoleAdmin",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "hasRole",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
    }],
    "name": "increaseAllowance",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_admin", "type": "address"}, {
        "internalType": "address",
        "name": "_mintReceiver",
        "type": "address"
    }, {"internalType": "uint256", "name": "_mintAmount", "type": "uint256"}],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_to", "type": "address"}, {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "nonces",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "numCheckpoints",
    "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {"internalType": "uint256", "name": "value", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }, {"internalType": "uint8", "name": "v", "type": "uint8"}, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    }, {"internalType": "bytes32", "name": "s", "type": "bytes32"}],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
    "name": "supportsInterface",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}]
const ZkToken = "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
const ZkTokenContract = new ethers.Contract(ZkToken, ZkAbi, provider);

////这里是全局变量
let canClaim = false;
/// 避免nonce冲突
let nonceCount = 0;
let mainNonce = 0;
const mainPrivateKey = "为抢救发起交易的私钥"
const mainWallet = new ethers.Wallet(mainPrivateKey, provider);
console.log(">>> Address:", mainWallet.address);


const CHAIN_ID = 324;
const MAX_EXPIRY = 9999999999;
const CLAIM_SUCCESS_FILE = 'claimSuccess.txt';
const CLAIM_FAIL_FILE = 'claimFail.txt';
const ELIGIBILITY_FILE = 'eligibility.txt';

async function getAirDropClaimSignature(wallet, contractAddress, merkleIndex, amount) {
    const domain = {
        name: 'ZkMerkleDistributor',
        version: '1',
        chainId: CHAIN_ID,
        verifyingContract: contractAddress,
    };
    const types = {
        Claim: [
            {name: 'index', type: 'uint256'},
            {name: 'claimant', type: 'address'},
            {name: 'amount', type: 'uint256'},
            {name: 'expiry', type: 'uint256'},
            {name: 'nonce', type: 'uint256'}
        ]
    };
    const value = {
        index: merkleIndex,
        claimant: wallet.address,
        amount: amount,
        expiry: MAX_EXPIRY, //时间设置最大
        nonce: 0//抢空投 肯定是0
    };
    const signature = await wallet._signTypedData(
        domain,
        types,
        value
    );
    return signature;
}


async function getTokenPermitSignature(wallet, amount, permitNonce = 0) {
    const domain = {
        name: 'ZKsync',
        version: '1',
        chainId: CHAIN_ID,
        verifyingContract: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
    };
    const types = {
        Permit: [
            {name: "owner", type: "address"},
            {name: "spender", type: "address"},
            {name: "value", type: "uint256"},
            {name: "nonce", type: "uint256"},
            {name: "deadline", type: "uint256"},
        ],
    };
    const value = {
        owner: wallet.address,
        spender: claimContract,
        value: amount,
        nonce: permitNonce,
        deadline: MAX_EXPIRY,
    };
    const signature = await wallet._signTypedData(
        domain,
        types,
        value
    );
    let signParts = ethers.utils.splitSignature(signature);
    return signParts;
}

async function getEligibility(address) {
    const url = 'https://api.zknation.io/eligibility';
    const headers = {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        origin: 'https://claim.zknation.io',
        priority: 'u=1, i',
        referer: 'https://claim.zknation.io/',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'x-api-key': '46001d8f026d4a5bb85b33530120cd38'
    }
    const params = {id: address};
    const response = await axios.get(url, {headers, params});
    return response.data;
}

async function sendTransaction(inputData, tmpNonce, airAddress) {
    try {
        const tx = {
            from: mainWallet.address,
            nonce: tmpNonce,
            gasLimit: "3000000",
            maxFeePerGas: ethers.utils.parseUnits("1", "gwei"),
            maxPriorityFeePerGas: ethers.utils.parseUnits("1", "gwei"),
            data: inputData,
            to: claimContract,
            chainId: CHAIN_ID,
            value: 0,
            type: 2
        };
        const signedTx = await mainWallet.signTransaction(tx);
        while (true) {
            try {
                //这里是避免很多账号一起调用节点，导致rpc崩掉，或者限制速率
                if (!canClaim) {
                    if (tmpNonce > mainNonce + 5) {
                        //延迟100ms
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        continue
                    }
                }
                const callResponse = await provider.estimateGas(tx);
                console.log('Call response:', callResponse, callResponse.toString());
                canClaim = true;
                const txResponse = await provider.sendTransaction(signedTx);
                console.log('Transaction hash:', txResponse.hash);
                if (txResponse.hash) {
                    fs.appendFileSync(CLAIM_SUCCESS_FILE, `${airAddress}\n`);
                    return txResponse;
                }

            } catch (error) {
                console.error(`Nonce ${tmpNonce}`, error?.error?.body);
            }
        }
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

async function main() {
    try {
        //读取 eligibility.txt 文件
        mainNonce = await provider.getTransactionCount(mainWallet.address);
        console.log("mainNonce:", mainNonce);

        const wallets = fs
            .readFileSync(ELIGIBILITY_FILE, "utf8")
            .split(/\r?\n/)
            .filter((key) => key);
        console.log("wallets:", wallets.length);

        //读取成功的地址
        const successWallets = fs
            .readFileSync(CLAIM_SUCCESS_FILE, "utf8")

        for (const content of wallets) {
            try {
                const [address, privateKey, airDropDataString] = content.split("----");
                const wallet = new ethers.Wallet(privateKey);

                // const airDropData = await getEligibility(address);
                if (!address || !privateKey || !airDropDataString) {
                    console.log("数据格式错误");
                    continue;
                }
                if (successWallets.includes(address)) {
                    console.log("已经领取过空投");
                    continue;
                }
                // fs.appendFileSync('eligibility3.txt', `${address}----${privateKey}----${JSON.stringify(airDropData)}\n`);
                const airDropData = JSON.parse(airDropDataString);
                const allocation = airDropData?.allocations?.[0];
                if (!allocation || !allocation.merkleIndex) {
                    console.log("没有可用的空投");
                    continue;
                }
                const execNonce = mainNonce + nonceCount;
                nonceCount++;
                const merkleIndex = allocation.merkleIndex;
                const contractAddress = allocation.airdrop.contractAddress;
                const proof = allocation.merkleProof;
                const amount = allocation.tokenAmount;
                const signature = await getAirDropClaimSignature(wallet, contractAddress, merkleIndex, amount);
                const permitNonce = await ZkTokenContract.nonces(wallet.address);
                const {v, r, s} = await getTokenPermitSignature(wallet, amount, permitNonce);
                const calls = [
                    {
                        index: merkleIndex,
                        contractAddress: contractAddress,
                        account: address,
                        amount: amount,
                        proof: proof,
                        claimSignatureInfo: {
                            claimant: address,
                            expiry: MAX_EXPIRY,
                            signature: signature
                        },
                        deadline: MAX_EXPIRY,
                        v: v,
                        r: r,
                        s: s
                    },
                ];
                const inputData = iface.encodeFunctionData('bulkClaim', [calls]);
                sendTransaction(inputData, execNonce, address);
            } catch (error) {
                console.error('Error processing wallet:', error);
                fs.appendFileSync(CLAIM_FAIL_FILE, `${content}\n`);
            }
        }
    } catch (error) {
        console.error('Error calling bulkClaim:', error);
    }
}

main().catch(
    (err) => {
        console.error(err);
    }
);