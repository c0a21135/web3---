"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../abi/MyToken.sol/MyToken.json";

// デプロイしたMyTokenのアドレス
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export default function Home() {
  // MetaMaskなどが提供するイーサリアムプロバイダーを格納する変数
  const [windowEthereum, setWindowEthereum] = useState();
  // MyTokenの保有者を格納する変数
  const [inputValue, setInputValue] = useState("");

  useEffect(() =>{
    // Ethereumプロバイダーを取得し、変数に代入
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);
  }, []);

  // ボタンを押下したときに実行される関数
  const handleButtonClick = async () => {
    if (windowEthereum){
      // Ethereumプロバイダーを設定
      const provider = new ethers.BrowserProvider(windowEthereum);
      // 署名オブジェクトの取得
      const signer = await provider.getSigner();
      // コントラクトの取得
      const contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
      );
      // ウォレットアドレスの取得
      const walletAddress : string = await signer.getAddress();
      // MyTokenコントラクトから指定したウォレットアドレスのトークン所有数を取得
      const balance = await contract.balanceOf(walletAddress);
      // BigIntリテラル付きで所有数が返されるのでテキストに変換して代入
      setInputValue(balance.toString());
    }
  };

  return (
    <div>
      <h1>Blockchain sample app</h1>
      <button onClick={handleButtonClick}>Tokens owned </button>
      <input type="text" value={inputValue} readOnly />
    </div>
  );
}