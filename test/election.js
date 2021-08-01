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

    it('allows a voter to cast a vote', async () => {
      const candidateId = 1
      const reciept = await election.vote(candidateId, { from: accounts[0] })
      const voted = await election.voters(accounts[0])
      assert.equal(reciept.logs.length,1, "an event was triggered")
      assert.equal(reciept.logs[0].event, "voted", "the event type is correct")
      assert.equal(reciept.logs[0].args._candidateId.toNumber(), candidateId, "the candidate Id is correct")
      return election.voters(accounts[0])

      assert.equal(voted, true, "the voter was marked as voted")
      const candidate = await election.candidates(candidateId)

      let voteCount = candidate[2]
      assert.equal(voteCount, 1, "increments candidate's vote count")
    })

    it('throws an exception for invalid candidate', async () => {
      try {
        const reciept = await election.vote(99, { from: accounts[1] })
      } catch (error) {
        assert(error.message.indexOf('revert') >= 0, "error must contain revert")
      }

      const candidate1 = await election.candidates(1)

      let voteCount1 = candidate1[2]
      assert.equal(voteCount1, 1, "candidate 1 did not recieve any votes")

      const candidate2 = await election.candidates(2)
      let voteCount2 = candidate2[2]
      assert.equal(voteCount2, 0, "candidate 2 did not recieve any votes")
    })


    it('throws an exception for double voting', async () => {
      const candidateId = 2
      const reciept = await election.vote(candidateId, { from: accounts[1] })
      const candidate = await election.candidates(candidateId)
      let voteCount = candidate[2]
      assert.equal(voteCount, 1, "accepts first vore")

      try {
        const reciept = await election.vote(candidateId, { from: accounts[1] })
      } catch (error) {
        assert(error.message.indexOf('revert') >= 0, "error must contain revert")
      }

      const candidate1 = await election.candidates(1)
      let voteCount1 = candidate1[2]
      assert.equal(voteCount1, 1, "candidate 1 did not recieve any votes")
      const candidate2 = await election.candidates(2)
      let voteCount2 = candidate2[2]
      assert.equal(voteCount2, 1, "candidate 2 did not recieve any votes")
    })
  })
})