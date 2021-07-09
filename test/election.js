const Election = artifacts.require("Election")

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', (accounts) => {
let election
  before(async () => {
    election = await Election.deployed()
  })

  describe('Election', async () => {
    it('initializes with two candidates', async () => {
      const canCount = await election.candidatesCount()
      assert.equal(canCount, 2)
    })


    it('initializes the candidates with correct values', async () => {
      const can1 = await election.candidates(1)
      assert.equal(can1[0], 1, "contains correct id")
      assert.equal(can1[1], "Sandwich", "contains correct name")
      assert.equal(can1[2], 0, "contains correct votes count")

      const can2 = await election.candidates(2)
      assert.equal(can2[0], 2, "contains correct id")
      assert.equal(can2[1], "Giant", "contains correct name")
      assert.equal(can2[2], 0, "contains correct votes count")
    })
  })
})