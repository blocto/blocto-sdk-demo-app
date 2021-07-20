import { useCallback, useEffect, useRef, useState } from 'react';
import BloctoProvider from '@blocto/sdk';
import Web3 from 'web3'

const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unswappedAmount0",
        "type": "uint256"
      }
    ],
    "name": "Canceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token1",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountTotal0",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountTotal1",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftType",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct BounceNFT.Pool",
        "name": "pool",
        "type": "tuple"
      }
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousGovernor",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newGovernor",
        "type": "address"
      }
    ],
    "name": "GovernorshipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "swappedAmount0",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "swappedAmount1",
        "type": "uint256"
      }
    ],
    "name": "Swapped",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "cancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkToken0",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token1",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTotal0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTotal1",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "onlyBot",
        "type": "bool"
      }
    ],
    "name": "createErc1155",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token1",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTotal1",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "onlyBot",
        "type": "bool"
      }
    ],
    "name": "createErc721",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "creatorCanceledP",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBotToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getConfig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      }
    ],
    "name": "getConfig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getConfig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDisableErc1155",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDisableErc721",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMinValueOfBotHolder",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTxFeeRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "governor",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "initialize_bsc",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "initialize_rinkeby",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "myCreatedP",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "onlyBotHolderP",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pools",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token1",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTotal0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTotal1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nftType",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceGovernorship",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "swappedAmount0P",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "swappedAmount1P",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "swappedP",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "token0List",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "transferGovernor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newGovernor",
        "type": "address"
      }
    ],
    "name": "transferGovernorship",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const App = () => {
  const web3Ref = useRef(null);
  const web3 = web3Ref.current;

  const [chain, setChain] = useState('ETH');
  const [status, setStatus] = useState('NOT_ENABLED');
  const [account, setAccount] = useState(null);

  const [message, setMessage] = useState('Hello Blocto!');
  const [signStatus, setSignStatus] = useState('IDLE');
  const [signature, setSignature] = useState(null);

  const [balance, setBalance] = useState(null);
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('IDLE');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accounts = await web3.eth.getAccounts();
      const balanceResponse = await web3.eth.getBalance(accounts[0])
      setAccount(accounts[0]);
      setBalance(web3.utils.fromWei(balanceResponse));
    }
    if(status === 'FETCH_DATA') {
      fetchData().then(() => setStatus('ENABLED'))
    };
  }, [status, web3])

  const init = useCallback(async () => {
    // let provider
    // if(chain === 'ETH') {
    //   provider = new BloctoProvider({
    //     chainId: '0x4', // 4: Rinkeby
    //     rpc: 'https://rinkeby.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305',
    //     // server: 'http://localhost:8702'
    //   });
    // } else {
    //   provider = new BloctoProvider({
    //     chainId: '0x38', // 97: BSC Testnet,
    //     // server: 'http://localhost:8702'
    //   });
    // }

    // web3Ref.current = new Web3(provider);
    // let web3 = web3Ref.current;
    setStatus('ENABLED')
    // connect wallet
    // provider.enable().then(() => setStatus('FETCH_DATA'))
    const provider = new BloctoProvider({
      chainId: '0x38', // 97: BSC Testnet,
      // server: 'http://localhost:8702'
    });
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, '0x1C035FD1F11eA9Bb753625fD167205Cd40029607')
    const poolCount = await contract.methods.getPoolCount().call()
    alert(poolCount)
  }, [chain])

  const signMessage = useCallback((e) => {
    setSignStatus('PENDING');
    web3.eth.sign(message, account)
      .then(signature => {
        setSignature(signature)
        setSignStatus('SUCCESS')
      })
      .catch(() => setSignStatus('FAILED'))
    e.preventDefault();
  }, [account, message, web3])

  const sendTransaction = useCallback((e) => {
    const transaction = {
      from: sendTo,
      to: sendTo,
      value: amount,
    }
    setTransactionStatus('PENDING');
    web3.eth.sendTransaction(transaction)
      .then(response => {
        setReceipt(response)
        setTransactionStatus('SUCCESS')
        web3.eth.getBalance(account)
          .then(response => 
            setBalance(web3.utils.fromWei(response))
          )
      })
      .catch(() => setTransactionStatus('FAILED'));

    e.preventDefault();
  }, [account, sendTo, amount, web3]);

  const scannerURL = chain === 'ETH' 
    ? 'https://rinkeby.etherscan.io/tx'
    : 'https://testnet.bscscan.com/tx';

  return (
    <div className="page-wrapper">
      { status === 'NOT_ENABLED' && (
        <div className="card p-4 m-auto">
          {/* <div className="mb-2 d-flex justify-content-between">
            <div className="form-check">
              <input 
                className="form-check-input"
                type="radio"
                id="eth"
                value="ETH" 
                checked={chain === 'ETH'} 
                onChange={(e) => setChain(e.target.value)}
                />
              <label className="form-check-label" htmlFor="eth">
                ETH
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="radio"
                id="bsc"
                value="BSC"
                checked={chain === 'BSC'}
                onChange={(e) => setChain(e.target.value)}
              />
              <label className="form-check-label" htmlFor="bsc">
                BSC
              </label>
            </div>
          </div> */}
          <div>
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={init}
            >
              Connect to Blocto Wallet!
            </button>
          </div>
        </div>
      )}
      { status === 'FETCH_DATA' && (
        <div className="spinner-border m-auto big-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      { status === 'ENABLED' && (
        <div className="card m-auto">
          <div className="card-body">
            <h5 className="card-title">Account Info</h5>
            <div className="d-flex justify-content-between">
              <div className="me-4">Account</div>
              <div>{account}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="me-4">Balance</div>
              <div>{balance} {chain}</div>
            </div>
          </div>

          <hr />

          <div className="card-body">
            <h5  className="card-title">Sign Message</h5>
            <form onSubmit={signMessage}>
              <div className="input-group mb-3">
                <input type="text" className="form-control" value={message} onChange={e => setMessage(e.target.value)} />
                <button
                  type="submit"
                  className="btn btn-outline-primary"
                  disabled={signStatus === 'PENDING'}
                >
                  {signStatus === 'PENDING' 
                    ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"/>
                        <span>Signing</span>
                      </>
                    ) 
                    : 'Sign'
                  }
                </button>
              </div>
            </form>
            { signStatus === 'SUCCESS' && (
              <div>
                Your Signature for <strong>{message}</strong> is 
                <div className="alert alert-success">
                  {signature}
                </div>
              </div>
            )}
            { signStatus === 'FAILED' && (
              <div className="alert alert-danger">
                Something went wrong :'(
              </div>
            )}
          </div>

          <hr />

          <div className="card-body">
            <h5  className="card-title">Send Transaction</h5>
            <form onSubmit={sendTransaction}>
              <div className="mb-3">
                <label className="form-label">Receiver address</label>
                <input className="form-control" value={sendTo} onChange={e => setSendTo(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount(wei)</label>
                <input className="form-control" value={amount} onChange={e => setAmount(e.target.value)}  />
              </div>
              { transactionStatus === 'SUCCESS' && (
                <div className="alert alert-success">
                  Transaction Succeed! <br />
                  Check your transaction {' '} 
                  <a 
                    href={`${scannerURL}/${receipt.transactionHash}`} 
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    here
                  </a>
                </div>
              )}
              { transactionStatus === 'FAILED' && (
                <div className="alert alert-danger">
                  Something went wrong :'(
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={transactionStatus === 'PENDING'}
              >
                {transactionStatus === 'PENDING' 
                  ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"/>
                      <span>Sending</span>
                    </>
                  ) 
                  : 'Send'
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
