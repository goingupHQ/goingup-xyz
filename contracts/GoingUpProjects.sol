// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

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
        address[] invites;
        bool active;
        bool allowMembersToEdit;
        uint[] scores;
        string[] reviews;
        string[] extraData;
    }

    constructor () {        
        owner = msg.sender;
    }

    uint256 private idCounter = 1;

    address public owner;
    modifier onlyOwner {
        require(msg.sender == owner, 'not the owner');
        _;
    }
    /// @notice Transfer ownership of contract
    /// @param newOwner New contract owner address
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    mapping(address => bool) public admins;
    modifier onlyAdmin {
        require(owner == msg.sender || admins[msg.sender], "not admin");
        _;
    }
    /// @notice Sets the admin flag for address
    /// @param targetAddress Target address to set admin flag
    /// @param isAdmin Admin flag to set (true means address is admin, false mean address is not admin)
    function setAdmin(address targetAddress, bool isAdmin) public onlyAdmin {
        admins[targetAddress] = isAdmin;
    }

    uint256 public price = 1 * 10 ** 16; // default price is 0.01 matic
    modifier sentEnough {
        require(msg.value >= price, "did not send enough");
        _;
    }
    /// @notice Sets the price for creating and updating projects
    /// @param newPrice New price for creating and updating projects
    function setPrice(uint256 newPrice) public onlyAdmin {
        price = newPrice;
    }

    mapping(uint256 => Project) public projects;
    modifier canEditProject(uint256 projectId) {
        Project memory project = projects[projectId];
        
        if (msg.sender == project.owner) {
            _;
        } else {
            if (!project.allowMembersToEdit) {
                revert("cannot edit project");
            } else {
                bool isMember = false;
                for (uint i = 0; i < project.members.length; i++) {
                    address member = project.members[i];
                    if (msg.sender == member) {
                        isMember = true;
                        break;
                    }
                }

                if (!isMember) {
                    revert("cannot edit project");
                }

                _;
            }            
        }   
    }
    /// @notice Create a project
    /// @param name Project name
    /// @param description Project description
    /// @param started Project start (Unix timestamp, set to zero if you do not want to set any value)
    /// @param ended Project ended (Unix timestamp, set to zero if you do not want to set any value)
    /// @param primaryUrl Project primary url
    /// @param tags Project tags
    function create(string memory name, string memory description, uint started, uint ended, string memory primaryUrl, string[] memory tags) public payable sentEnough {
        Project memory newProject;

        newProject.id = idCounter;
        newProject.name = name;
        newProject.description = description;
        newProject.started = started;
        newProject.ended = ended;
        newProject.primaryUrl = primaryUrl;
        newProject.tags = tags;
        newProject.owner = msg.sender;
        newProject.active = true;
        newProject.allowMembersToEdit = false;

        projects[idCounter] = newProject;
        idCounter++;
    }
    /// @notice Update a project
    /// @param id Project ID
    /// @param name Project name
    /// @param description Project description
    /// @param started Project start (Unix timestamp, set to zero if you do not want to set any value)
    /// @param ended Project ended (Unix timestamp, set to zero if you do not want to set any value)
    /// @param primaryUrl Project primary url
    /// @param tags Project tags
    function update(uint256 id, string memory name, string memory description, uint started, uint ended, string memory primaryUrl, string[] memory tags) public payable sentEnough canEditProject(id) {        
        projects[id].name = name;
        projects[id].description = description;
        projects[id].started = started;
        projects[id].ended = ended;
        projects[id].primaryUrl = primaryUrl;
        projects[id].tags = tags;
        projects[id].active = true;
        emit ProjectUpdated(msg.sender, id, projects[id]);
    }
    /// @notice Invite a collaborator to project
    /// @param collaborator Collaborator's address
    function inviteCollaborator(uint256 id, address collaborator) public canEditProject(id) {
        projects[id].invites.push(collaborator);
    }

    /// @notice Withdraw native tokens (matic)
    function withdrawFunds() public onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    /// @notice Withdraw ERC20 tokens
    /// @param tokenAddress Address of ERC20 contract
    /// @param amount Amount to transfer
    function withdrawERC20(address tokenAddress, uint256 amount) external onlyAdmin {
        IERC20 tokenContract = IERC20(tokenAddress);
        tokenContract.transfer(msg.sender, amount);
    }

    /// @notice Withdraw ERC721 token
    /// @param tokenAddress Address of ERC721 contract
    /// @param tokenID Token ID to withdraw
    function withdrawERC721(address tokenAddress, uint256 tokenID) external onlyAdmin {
        IERC721 tokenContract = IERC721(tokenAddress);
        tokenContract.safeTransferFrom(address(this), msg.sender, tokenID);
    }
    
    /// @notice Withdraw ERC1155 token
    /// @param tokenAddress Address of ERC1155 contract
    /// @param tokenID Token ID to withdraw
    function withdrawERC1155(address tokenAddress, uint256 tokenID, uint256 amount, bytes memory data) external onlyAdmin {
        IERC1155 tokenContract = IERC1155(tokenAddress);
        tokenContract.safeTransferFrom(address(this), msg.sender, tokenID, amount, data);
    }
} 