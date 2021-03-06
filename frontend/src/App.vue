<template>
  <div
    v-if="!isLoading"
    id="app">
    <header>
      <h1>
        Election DAPP
      </h1>
      Account: {{ account }}
    </header>
    <section>
      <table>
        <tr>
          <th>Candidate Name</th>
          <th>Votes</th>
        </tr>
        <tr v-for="candidate in candidates" :key="candidate.id">
          <td>{{ candidate.name }}</td>
          <td>{{ candidate.voteCount }}</td>
        </tr>
      </table>
    </section>
    <section v-if="!hasAccountVoted">
      <h2>Voting</h2>
      <select
        @input="updatePreselectedCandidate">
        <option disabled selected> --- select candidate ---</option>
        <option
          v-for="candidate in candidates"
          :value="candidate.id"
          :key="candidate.id">
          {{ candidate.name }}
        </option>
      </select>
      <button @click="vote">Vote</button>
    </section>
    <section>
      <i> hint: You can only vote once from an account, but you may try to switch account and send another vote</i>
    </section>
  </div>
  <div v-else>
    Loading
  </div>
</template>

<script>
  import Web3 from "web3"
  import Election from './contracts/Election.json'

  export default {
    name: 'app',
    data () {
      return {
        account: '',
        contract: '',
        ethBalance: '',
        candidateCount: '',
        candidates: [],
        isLoading: true,
        selectedCandidateId: null,
        web3: null,
        hasAccountVoted: false,
      }
    },
    async mounted () {
      await this.loadWeb3()
      await this.loadBlockchainData()
      await this.listenForEvents()
    },
    methods: {
      async loadWeb3 () {
        if (window.ethereum) {
          this.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (this.web3) {
          this.web3 = new Web3(window.web3.currentProvider)
        } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      async loadBlockchainData () {
        const accounts = await this.web3.eth.getAccounts()
        this.account = accounts[0]

        const networkId = await this.web3.eth.net.getId()
        const networkdata = Election.networks[networkId]
        if (networkdata) {
          this.contract = new this.web3.eth.Contract(Election.abi, networkdata.address)
          this.candidateCount = await this.contract.methods.candidatesCount().call()
          for (let i = 1; i <= this.candidateCount; i++) {
            const can = await this.contract.methods.candidates(i).call()
            this.candidates[i - 1] = { id: can[0], name: can[1], voteCount: can[2] }
          }
          this.isLoading = false
        } else {
          window.alert('Token contract not deployed to detected network')
        }
      },
      async listenForEvents () {
        const self = this
        this.contract.once('voted', {
          filter: { event: 'voted' }, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0,
        }, async function () {
          await self.loadBlockchainData()
          self.hasAccountVoted = true
          self.isLoading = false
        })
      },
      updatePreselectedCandidate (e) {
        this.selectedCandidateId = e.target.value
      },
      vote () {
        this.isLoading = true
        this.contract.methods
          .vote(this.selectedCandidateId)
          .send({ from: this.account })
          .on('transactionHash', () => {
            this.isLoading = false
          })
      },
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
