import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import logo from './logo.svg'
import './App.css'

function App() {
    const providerOptions = {
        /* See Provider Options Section */
    }

    const web3Modal = new Web3Modal({
        network: "mainnet", // optional
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

    return (
        <div className="App">
            <header className="App-header">
                <h1>goingup.xyz</h1>
                <button onClick={connectClick}>Connect your wallet</button>
            </header>
        </div>
    )
}

export default App
