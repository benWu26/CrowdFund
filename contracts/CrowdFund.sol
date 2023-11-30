// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract crowdFund {
    address public company;
    uint public availableFunds;
    string public title;
    string public description;
    uint public deadline;
    withdraw[] public withdraws;

    // creates key value pair for how much each contributor has contributed
    mapping(address => uint) contributions;

    // structure that includes amount withdrawn and the reason
    struct withdraw {
        uint amount;
        string reason;
    }


    constructor(string memory _title, string memory _description) {
        company = msg.sender;
        availableFunds = 0;
        // makes crowdfunding end in a month
        deadline = block.timestamp + 60 * 60 * 24 * 30;
        crowdFund.title = _title;
        crowdFund.description = _description;
    }

    function makeContribution() public payable {
        uint value = msg.value;
        require (msg.value > 0, "Cannot Contribute Negative Ether");
        require (msg.sender.balance <= value, "Not Enough in Account");
        require (block.timestamp <= deadline,  "Funding has ended");
        availableFunds += value;
        contributions[msg.sender] += value;
    }

    function withdrawFunds(uint amount, string memory reason) public payable {
        require (msg.sender == company, "Not your funds");
        require (amount <= availableFunds, "Insufficient funding");
        
        withdraws.push(withdraw(amount, reason));
        availableFunds -= amount;
        payable(company).transfer(amount);
    }


}