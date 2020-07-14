pragma solidity >=0.4.0  < 0.7.0;
contract Meme{
    //Smart contract code here
    string memeHash;
    //Write function
    function setMemeHash(string memory _memeHash) public {
     memeHash = _memeHash;
    }

    function getMemeHash() public view returns (string memory){
        return memeHash;
    }



}