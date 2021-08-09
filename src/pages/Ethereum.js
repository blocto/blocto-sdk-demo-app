
import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import BloctoSDK from '@blocto/sdk';
import Web3 from 'web3';

const Ethereum = () => {
  const location = useLocation();
  const path = location.pathname;

  const web3Ref = useRef(null);
  const web3 = web3Ref.current;

  const [status, setStatus] = useState('NOT_ENABLED');
  const [account, setAccount] = useState(null);

  const [message, setMessage] = useState('Hello Blocto!');
  const [signType, setSignType] = useState('eth_sign');
  const [signStatus, setSignStatus] = useState('IDLE');
  const [signature, setSignature] = useState(null);

  const [balance, setBalance] = useState(null);
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('IDLE');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    let sdk
    if(path === '/ethereum') {
      sdk = new BloctoSDK({
        ethereum: {
          chainId: '0x4', // 4: Rinkeby
          rpc: 'https://rinkeby.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305',
        }
        
      });
    } else {
      sdk = new BloctoSDK({
        ethereum: {
          chainId: '0x61', // 97: BSC Testnet,
          rpc: 'https://rinkeby.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305',
        }
      });
    }

    web3Ref.current = new Web3(sdk.ethereum);
    setStatus('ENABLING')
    // connect wallet
    sdk.ethereum.enable().then(() => setStatus('FETCH_DATA'))
  }, [path])

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

  const signMessage = useCallback((e) => {
    setSignStatus('PENDING');
    if (signType === 'eth_sign') {
      web3.eth.sign(message, account)
        .then(signature => {
          setSignature(signature)
          setSignStatus('SUCCESS')
        })
        .catch(() => setSignStatus('FAILED'))
    } else if (signType === 'personal_sign') {
      web3.eth.personal.sign(message, account)
        .then(signature => {
          setSignature(signature)
          setSignStatus('SUCCESS')
        })
        .catch(() => setSignStatus('FAILED'))
    } else {
      setSignStatus('Unknown signType')
    }
    e.preventDefault();
  }, [account, message, web3, signType])

  const sendTransaction = useCallback((e) => {
    const transaction = {
      from: account,
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

  const scannerURL = path === '/ethereum' 
    ? 'https://rinkeby.etherscan.io/tx'
    : 'https://testnet.bscscan.com/tx';

  return (
    <div className="page-wrapper">
      { status === 'FETCH_DATA' && (
        <div className="spinner-border m-auto big-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      { status === 'ENABLED' && (
        <div className="card m-auto">
          <div className="card-body">
          <Link className="d-inline-block plain-link mb-2 text-dark" to="/">
            <i className="fas fa-chevron-left me-2" />
          </Link>
            <h5 className="card-title">Account Info</h5>
            <div className="d-flex justify-content-between">
              <div className="me-4">Account</div>
              <div>{account}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="me-4">Balance</div>
              <div>{balance} {path === '/ethereum' ? 'ETH' : 'BSC'}</div>
            </div>
          </div>

          <hr />

          <div className="card-body">
            <h5  className="card-title">Sign Message</h5>
            <div className="mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="eth_sign"
                  value="eth_sign"
                  checked={signType === 'eth_sign'}
                  onChange={(e) => setSignType(e.target.value)}
                  />
                <label className="form-check-label">
                  eth_sign
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="personal_sign"
                  value="personal_sign"
                  checked={signType === 'personal_sign'}
                  onChange={(e) => setSignType(e.target.value)}
                />
                <label className="form-check-label">
                  personal_sign
                </label>
              </div>
            </div>
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

export default Ethereum