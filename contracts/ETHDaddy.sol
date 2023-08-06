// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    uint256 public maxSupply;
    uint256 public totalSupply;
    address private owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) domains;

    constructor() ERC721("ETH Daddy", "ETHD") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == getOwner(), "Sender is not owner");
        _;
    }

    function listOfDomain(string memory _name, uint256 _cost) public onlyOwner {
        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply);
        require(domains[_id].isOwned == false, "Already sold");
        require(msg.value >= domains[_id].cost, "Send correct amount of Eth");
        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }

    function withdraw() public onlyOwner {
        (bool sucess, ) = owner.call{value: address(this).balance}("");
        require(sucess, "Something went wrong");
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
