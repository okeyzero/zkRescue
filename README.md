# 救援思路

分享下救援zk的思路和实践
其实我并没有撸zk，但是朋友一批zk号被盗了，昨天就研究了一下。
通过接口查询 https://api.zknation.io/eligibility
查询返回值：

```JSON

{
  "allocations": [
    {
      "userId": "0xDF908052********A6F9d7d760f6D2",
      "tokenAmount": "998000000000000000000",
      "criteria": [
        {
          "criteriaId": "contract_interactions",
          "description": "Interacted with 10 smart contracts",
          "criteriaType": "zksync"
        }
      ],
      "airdrop": {
        "id": "f66d93c9-2681-4428-9500-e19fe193b973",
        "contractAddress": "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4",
        "associationStopsAt": "2024-06-14T13:00:00.000Z",
        "claimStartsAt": "2024-06-17T07:00:00.000Z",
        "finalized": true
      },
      "associatedAddress": null,
      "merkleIndex": "604680",
      "merkleProof": [
        "0xd380a9d7d196e7c7d6f811e32e2a5e3da863d40f59563c55d94d8ac1db3d0963",
        "0xefbcf6a6ddd4d3afc0d52f81efa7ecd590c90d8cc28cebfe27e76ebb33b75dea",
        "0x91942cf6968462e18f32abb9c3ec150c50914e3ed1ef691f32d03d9974ef7ba0",
        "0x71a7da30aa8764fb9312fc85c9fffd3528dd53144426f446e1b304a47724bc3a",
        "0x234f3c413454fa23faffe1153dd9a50b6532bf6aa9b8880ed76628123b9772c7",
        "0xd24483e13814a6db80b9690510c937ff68531cf4da8562c2be529a70707ccf77",
        "0x5553cb54bcd070103124f7603fec7a95f205c1eb725ad875515848f680ccc3fa",
        "0xc7057632e93d50d62e3e638575696b656d502bf8bea801354cc71249fa7928ab",
        "0x289eeec5e3ebe30296de013be73f6f84ce2ae42cc8718570bc1ee4a98f77b1ef",
        "0xfda94f397c637e88bfea3bcf998d3396180ac58b47b48c2364fc50990bc256f5",
        "0x5385990034592e5be47553bb2b20f99cbe12b5b7db4eb70041ae4d95ad324035",
        "0x832ec785fe2911b5d795d0717127b1d97e1cffc6c6d7710f0d8206a06b2df626",
        "0xb7cd82736e07d6dc1ffa439c4ff73260d3469b4e6d19ca68580d0209545d7e1f",
        "0xa1ba0a280f7cbc5b5d768e5f60ef9a7455096fa99638609028a87d68f989a175",
        "0x1352d4de0c1982003bd5912cbb8035505356700782705ff708919d587db07888",
        "0xffdb01d44a20d6430853155d1258bee638cdd9913dc5b713c0a5b72bd56af464",
        "0x69c3a58bf4f7b5efd953c128e34a48e5cb7d47409a68b839fed15b7e64654ab1",
        "0x60129e33376f24766c7de887c815c0b36a385d82de2f93a0ba2515ab1eb80588",
        "0xf30b9e1d3ccc867b00fd1b4c8b66dbdbec17962a94b65b7751f783ec0789ef66"
      ]
    }
  ]
}
```

通过查询接口返回的数据，可以看到用户的领取代币的`contractAddress`和`merkleProof`等信息。

但是一开始查询，是无法查询到`contractAddress`
具体合约地址，经过群友在群里分享的`https://era.zksync.network/address/0x903fA9b6339B52FB351b1319c8C0411C044422dF#code`
这个合约
可以查看到合约的代码，通过阅读代码，能大概率肯定领取代币的代码就是这样的，只是还无法确定抢购的合约地址是否为此。

在合约里也能查询到 Zk 的合约地址 `0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E`
经过对代码的简单分析，以及持仓情况，也有很大的概率是这个合约地址。
首先肯定的一点 基于正常方案

1. 给被盗地址转手续费
2. 被盗地址领取
3. 被盗地址转移zk代币

这种方案，肯定胜率很低，三段交易，中间任何一个交易出现问题，就会导致失败。(当然，发交易的方式不一样，成功率也是不一样的)

再一方面，通过zk 的代码，可以把开盘同一时间发出交易数量变成2笔 (可以提前通过permit授权给自己大号地址，大号调用tranferFrom)
，当然这样还是有一定的几率会救援失败的。

所以就结合这两份代码以及以上思路，来做的下面的预案：

1. 写一份合约，利用合约完成 permit 和 transferFrom
2. 针对自己写的合约，进行抢救代码编写

对于1 部分，由于我很久没写solidity代码 短时间内 可能会花费的久一点，时间很紧急，就让色哥 `@fooyao158` (推特)
帮我完成了合约代码。色哥很给力，几分钟搞出来了，当然代码中还有一些可以优化的点，但是害怕修改之后出问题，就没有修改，毕竟当下的测试已经全部测试成功。避免修改后的bug，就没有改动了。
对于2 部分，我花费了很久的时间，去编写代码，测试代码。直到最后一刻，希望自己的代码不要出bug。
最终在抢购的过程中大获全胜。100%救援成功率。
