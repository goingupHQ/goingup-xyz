// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GoingUpNFT is ERC721, AccessControl, ERC721Burnable, ERC721Pausable, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public mintPrice = 10000000000000000; // 0.01 native asset (ETH, MATIC)     

    string private _baseTokenURI = 'https://app.goingup.xyz/api/token/';

    constructor() ERC721("GoingUp NFT", "GNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC721, ERC721Pausable, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
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

    modifier onlyPauser {
        require(hasRole(PAUSER_ROLE, msg.sender), "Sender is not pauser");
        _;
    }

    function pauseContract() public onlyPauser whenNotPaused { _pause(); }
    
    function unpauseContract() public onlyPauser whenPaused { _unpause(); }

    function setMintPrice(uint256 price) public onlyAdmin {
        mintPrice = price;
    }

    function mintAndSend(address to) public payable {
        require(mintPrice == 0 || msg.value >= mintPrice, "Amount sent not enough");
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    function manualMint(address to) public onlyMinter {
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    function manualBurn(uint256 tokenID) public onlyBurner {
        _burn(tokenID);
    }    

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) public onlyAdmin {
        _baseTokenURI = baseTokenURI;
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