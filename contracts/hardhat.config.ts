import { config as dotEnvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/iZeYLKKDnpYnpu1bIkJRwCzKkJbSMYEz`,
      accounts: [`${process.env.SEPOLIA_PRIVATE_KEY}`],
    },
  },
};

export default config;
