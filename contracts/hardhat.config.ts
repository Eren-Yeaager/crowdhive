import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/iZeYLKKDnpYnpu1bIkJRwCzKkJbSMYEz`,
      accounts: ['0xd69fd84a3f8f1af29a200a2e42c4a6917fdf60b77eb5f26abd5a559669a3ba24']
    }
}
}

export default config