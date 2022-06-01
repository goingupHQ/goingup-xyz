// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

/// @title GoingUP Platform Projects Smart Contract
/// @author Mark Ibanez
contract GoingUpProjects {
    struct Project {
        uint256 id;
        string name;
        string description;
        uint started;
        uint ended;
        string primaryUrl;
        string[] tags;
        address owner;
        address[] members;
        bool active;
    }


}