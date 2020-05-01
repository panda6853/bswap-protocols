const Encoder = artifacts.require('Encoder')
const { emptySignature } = require('@airswap/types')
const { padAddressToLocator } = require('@airswap/test-utils').padding

contract('Encoder', async accounts => {
  let encoder

  const order = {
    nonce: 123456,
    expiry: 123456,
    signer: {
      kind: '0x36372b07',
      wallet: accounts[1],
      token: accounts[2],
      data: '0x',
    },
    sender: {
      kind: '0x36372b07',
      wallet: accounts[1],
      token: accounts[2],
      data: '0x',
    },
    affiliate: {
      kind: '0x36372b07',
      wallet: accounts[1],
      token: accounts[2],
      data: '0x',
    },
    signature: emptySignature,
  }

  const bytesOne = padAddressToLocator(accounts[4])
  const no0x = bytesOne.slice(2)

  before('Deploy', async () => {
    encoder = await Encoder.new()
  })

  describe('test gas costs', async () => {
    it('should test the gas costs', async () => {
      let data = '0x'
      let tx

      for (let i = 0; i < 100; i++) {
        tx = await encoder.hashOrderEncode(order, emptySignature.r)
        console.log(
          'data length ' +
            (data.length - 2) / 2 +
            ', encode,      gas used: ' +
            tx.receipt.gasUsed
        )
        tx = await encoder.hashDataThenEncode(order, emptySignature.r)
        console.log(
          'data length ' +
            (data.length - 2) / 2 +
            ', hashed data, gas used: ' +
            tx.receipt.gasUsed
        )

        data = data.concat(no0x)
        order.signer.data = data
        order.sender.data = data
        order.affiliate.data = data
      }
    })
  })
})
