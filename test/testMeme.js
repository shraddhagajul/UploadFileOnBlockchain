const Meme = artifacts.require('./Meme.sol');
// require('chai').use(require('chai-as-promised')).should();

contract('Meme', accounts => {
    let meme ;
    describe('development',async()=> {
        it('deploys successfully',async() => {
        meme = await Meme.deployed();
        const address= meme.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        });
        
    });

    describe('storage',async() => {
        it('updates the memeHash', async() => {
            meme = await Meme.deployed();

            const address= meme.address;
            let memeHash 
            memeHash = 'abc123'
            await meme.setMemeHash(memeHash)
            const result = await meme.getMemeHash()
            assert.equal(result,memeHash)

        })
    })
});
