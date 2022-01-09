import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import poapAbi from './abi/poap.json'
import logo from './logo.svg'
import './App.css'

function App() {
    const providerOptions = {
        /* See Provider Options Section */
    }

    const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    })

    const connectClick = async () => {
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)
        const signer = provider.getSigner()

        console.log(instance, provider, signer)
        alert('hello')
    }

    const getPoaps = async () => {
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)
        const signer = provider.getSigner()

        const abi = ['function name() public returns (string name)']

        const contract = new ethers.Contract('0xa1eB40c284C5B44419425c4202Fa8DabFF31006b', abi, signer)
        console.log(contract)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>goingup.xyz</h1>
                <p>
                    <button onClick={connectClick}>Connect your wallet</button>
                </p>
                <p>
                    <button onClick={getPoaps}>Get POAPs</button>
                </p>

            </header>
        </div>
    )
}

export default App
