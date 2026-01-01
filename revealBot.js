import { ethers } from "ethers";

const ABI = [
  "function unlockTimeOf(uint256) view returns (uint256)",
  "function reveal(uint256)"
];

const {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  TOKEN_ID
} = process.env;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const unlockTime = await contract.unlockTimeOf(TOKEN_ID);
  const now = Math.floor(Date.now() / 1000);

  console.log("now:", now, "unlockTime:", unlockTime.toString());

  if (now < Number(unlockTime)) {
    console.log("Not time yet");
    return;
  }

  try {
    const tx = await contract.reveal(TOKEN_ID);
    console.log("Reveal tx sent:", tx.hash);
    await tx.wait();
    console.log("Reveal mined");
  } catch (e) {
    console.log("Reveal skipped:", e.message);
  }
}

main();
