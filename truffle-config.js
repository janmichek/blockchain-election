module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    develop: {
      port: 8545,
    },
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './frontend/src/contracts/',
}
