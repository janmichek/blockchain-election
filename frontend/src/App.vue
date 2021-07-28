<template>
  <div v-if="!loading" id="app">
    <header>
        Account: {{ account }}
    </header>
    <div v-if="candidates">
      <div v-for="candidate in candidates" :key="candidate.id">
        Candidate: {{ candidate.id }} - {{ candidate.name }} - {{ candidate.voteCount }} votes
      </div>
    </div>

    <h2>Voting</h2>
    <select v-if="candidates" @input="updatePreselectedCandidate">
      <option
        v-for="(candidate, index) in candidates"
        :value="index"
        :key="index">
        {{ candidate.name }}
      </option>
    </select>
    <button @click="vote">Vote for {{ selectedCandidateId }}</button>
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
        loading: true,
        selectedCandidateId: null,
      }
    },
    async mounted () {
      await this.loadWeb3()
      await this.loadBlockchainData()
    },
    methods: {
      async loadWeb3 () {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      async loadBlockchainData () {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.account = accounts[0]

        const networkId = await web3.eth.net.getId()
        const networkdata = Election.networks[networkId]
        if (networkdata) {
          this.contract = new web3.eth.Contract(Election.abi, networkdata.address)
          this.candidateCount = await this.contract.methods.candidatesCount().call()
          for (let i = 1; i <= this.candidateCount; i++) {
            const can = await this.contract.methods.candidates(i).call()
            this.candidates[i - 1] = { id: can[0], name: can[1], voteCount: can[2] }
          }
          this.loading = false
        } else {
          window.alert('Token contract not depployed to detected network')
        }
      },
      updatePreselectedCandidate (e) {
        this.selectedCandidateId = parseInt(e.target.value) + 1
      },
      vote () {
        this.contract.methods.vote(this.selectedCandidateId).send({ from: this.account })
          .on('transactionHash', () => (this.loading = false))
      },
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
