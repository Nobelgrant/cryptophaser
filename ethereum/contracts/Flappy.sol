// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Flappy {
    address public manager;
    address payable[] public players;
    mapping (address => uint256) public playerScores;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    function saveBestScore(uint256 newScore) public {
        if(playerScores[msg.sender] == 0 || playerScores[msg.sender] < newScore){
            playerScores[msg.sender] = newScore;
        }
        else if (playerScores[msg.sender] >= newScore) {
            playerScores[msg.sender] = playerScores[msg.sender];
        }
    }

    function getPlayerScore() public view returns (uint256) {
    return playerScores[msg.sender];
}
    
    function pickWinner() public restricted {
        uint256 maxScore = 0;
        address payable maxScoreAddress;
        for (uint i = 0; i < players.length; i++) {
            if (playerScores[players[i]] > maxScore) {
                maxScore = playerScores[players[i]];
                maxScoreAddress = players[i];
            }
        }
        maxScoreAddress.transfer(address(this).balance);
        resetScores();
    }

    function resetScores() public {
        for (uint256 i = 0; i < players.length; i++) {
            playerScores[players[i]] = 0;
        }
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}   