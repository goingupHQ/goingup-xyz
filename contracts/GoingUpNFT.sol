// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract GoingUpNFT is ERC1155, AccessControl, ERC1155Pausable {
    struct TokenSetting {
        string description;
        string metadataURI;
        uint category;
        uint tier;
        uint price;
    }

    string private _contractURI = "ipfs://QmYWnXmp5wLUeCNHsrS3PLtnFBXhEwpnKvmRhrjYY3id2J";
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    mapping(uint256 => TokenSetting) public tokenSettings;

    constructor() ERC1155("https://app.goingup.xyz/api/1155-metadata/") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
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

    modifier onlyPauser {
        require(hasRole(PAUSER_ROLE, msg.sender), "Sender is not pauser");
        _;
    }

    function pauseContract() public onlyPauser whenNotPaused { _pause(); }
    
    function unpauseContract() public onlyPauser whenPaused { _unpause(); }

    function setTokenSettings(uint256 tokenID, string calldata _description, string calldata _metadataURI, uint _category, uint _tier, uint _price) public onlyAdmin {
        tokenSettings[tokenID] = TokenSetting({
            description: _description,
            metadataURI: _metadataURI,
            category: _category,
            tier: _tier,
            price: _price
        });
    }

    function mint(address account, uint256 tokenID, uint256 qty) public payable whenNotPaused {
        TokenSetting memory ts = tokenSettings[tokenID];
        require(ts.category != 0 && ts.tier != 0, "Token setting not found");
        require(ts.price == 0 || msg.value >= ts.price * qty, "Amount sent not enough");
        _mint(account, tokenID, qty, "");
    }

    function manualMint(address account, uint256 tokenID, uint256 qty) public onlyMinter whenNotPaused {
        _mint(account, tokenID, qty, "");
    }

    function manualMintBatch(address account, uint256[] calldata tokenIDs, uint256[] calldata qtys) public onlyMinter whenNotPaused {        
        _mintBatch(account, tokenIDs, qtys, "");
    }   

    function uri(uint256 tokenID) override public view returns (string memory) {
        TokenSetting memory ts = tokenSettings[tokenID];
        require(ts.category != 0 && ts.tier != 0, "Token not found");
        return ts.metadataURI;
    }

    function setContractURI(string calldata _uri) public onlyAdmin { _contractURI = _uri; }

    function contractURI() public view returns (string memory) { return _contractURI; }

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