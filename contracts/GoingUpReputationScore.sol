// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract GoingUpReputationScore is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public mintPrice = 10000000000000000; // 0.01 native asset (ETH, MATIC)    

    constructor() ERC20("GoingUp Reputation Score", "GRSC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    modifier onlyAdmin {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Sender is not admin");
        _;
    }

    modifier onlyMinter {
        require(hasRole(MINTER_ROLE, msg.sender), "Sender is not minter");
        _;
    }

    modifier onlyBurner {
        require(hasRole(BURNER_ROLE, msg.sender), "Sender is not burner");
        _;
    }

    function setMintPrice(uint256 price) public onlyAdmin {
        mintPrice = price;
    }

    function mintAndSend(address account, uint256 amount) public payable {
        require(mintPrice == 0 || msg.value >= mintPrice * amount, "Amount sent not enough");
        _mint(account, amount);
    }

    function manualMint(address account, uint256 amount) public onlyMinter {
        _mint(account, amount);
    }

    function manualBurn(address account, uint256 amount) public onlyBurner {
        _burn(account, amount);
    }

    function withdrawFunds() public onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawERC20(address _tokenContract, uint256 _amount) external onlyAdmin {
        IERC20 tokenContract = IERC20(_tokenContract);
        tokenContract.transfer(msg.sender, _amount);
    }

    function withdrawERC721(address _tokenContract, uint256 _tokenID) external onlyAdmin {
        IERC721 tokenContract = IERC721(_tokenContract);
        tokenContract.safeTransferFrom(address(this), msg.sender, _tokenID);
    }
    
    function withdrawERC1155(address _tokenContract, uint256 _tokenID, uint256 _amount, bytes memory _data) external onlyAdmin {
        IERC1155 tokenContract = IERC1155(_tokenContract);
        tokenContract.safeTransferFrom(address(this), msg.sender, _tokenID, _amount, _data);
    }
}