<template>
  <div v-if="isDrizzleInitialized || !loading" id="app">
    <div>Hello world</div>
    {{ candidates }}
    <div v-if="candidates">
      <div v-for="candidate in candidates" :key="candidate.id">
        {{ candidate.id }} - {{ candidate.name }} - {{ candidate.voteCount }}
      </div>
    </div>
    <div>
      your account {{ account }}
    </div>
  </div>
  <div v-else>
    Loading
  </div>
</template>

<script>
  import Web3 from "web3"
  import Election from './contracts/Election.json'
  import { mapGetters } from 'vuex'

  export default {
    name: 'app',
    data () {
      return {
        account: '',
        election: '',
        ethBalance: '',
        candidateCount: '',
        candidates: null,
        loading: true,
      }
    },
    computed: mapGetters('drizzle', ['isDrizzleInitialized']),
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
        this.ethBalance = await web3.eth.getBalance(this.account)

        const networkId = await web3.eth.net.getId()
        const tokenData = Election.networks[networkId]
        if (tokenData) {
          this.election = new web3.eth.Contract(Election.abi, tokenData.address)
          // call() from web3
          this.candidateCount = await this.election.methods.candidatesCount().call()
          // this.tokenBalance = await this.token.methods.balanceOf(this.account).call().toString()
          for (let i = 1; i <= this.candidateCount; i++) {
            console.log('i', i)
            const can = await this.election.methods.candidates(i).call()
            console.log('XXXXX can', can)
            const candidate = { id: can[0], name: can[1], voteCount: can[2] }
            console.log('XXXXX candidate', candidate)
            this.candidates[i - 1] = candidate
          }
          this.loading = false
        } else {
          window.alert('Token contract not depployed to detected network')
        }
      },
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
