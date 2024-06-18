// SPDX-License-Identifier: MIT
// twitter @0xNaiXi
// twitter @0xNaiXi
// twitter @0xNaiXi
// hdd.cm 推特低至2毛
// hdd.cm 推特低至2毛
// hdd.cm 推特低至2毛
pragma solidity ^0.8.19;

interface Tokenint {
    struct ClaimSignatureInfo {
        address claimant;
        uint256 expiry;
        bytes signature;
    }

    function isClaimed(uint256 index) external view returns (bool);

    function transferFrom(address from, address to, uint256 amount) external;

    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;

    function claimOnBehalf(uint256 index, uint256 amount, bytes32[] calldata proof, ClaimSignatureInfo calldata _claimSignatureInfo) external;
}

contract Batcher {
    Tokenint public constant ZK_token = Tokenint(0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E);

    address public immutable owner;
    mapping(address => bool) public whitelist;

    constructor(address _owner) {
        owner = _owner;
        whitelist[_owner] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isWhitelisted(address _address) {
        require(whitelist[_address], "Address is not whitelisted");
        _;
    }

    function addToWhitelist(address[] calldata _address) external onlyOwner {
        for (uint i = 0; i < _address.length; i++) {
            whitelist[_address[i]] = true;
        }
    }

    function removeFromWhitelist(address[] calldata _address) external onlyOwner {
        for (uint i = 0; i < _address.length; i++) {
            whitelist[_address[i]] = false;
        }
    }


    struct Param {
        uint256 index;
        address contractAddress;
        address account;
        uint256 amount;
        bytes32[] proof;
        Tokenint.ClaimSignatureInfo claimSignatureInfo;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    function bulkClaim(Param[] calldata calls) external isWhitelisted(msg.sender) {
        for (uint i = 0; i < calls.length; i++) {
            claim(calls[i]);
        }
    }


    function claim(Param calldata call) internal {
        address to = msg.sender;
        Tokenint Airdrop = Tokenint(call.contractAddress);
        if (!Airdrop.isClaimed(call.index)) {
            Airdrop.claimOnBehalf(call.index, call.amount, call.proof, call.claimSignatureInfo);
            ZK_token.permit(call.account, address(this), call.amount, call.deadline, call.v, call.r, call.s);
            ZK_token.transferFrom(call.account, to, call.amount);
        }
    }

}