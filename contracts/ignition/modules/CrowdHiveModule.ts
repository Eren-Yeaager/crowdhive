import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CrowdHive = buildModule("CrowdHiveModule", (m) => {
  const crowdhive = m.contract("CrowdHive", []);

  return { crowdhive };
});

export default CrowdHive;
