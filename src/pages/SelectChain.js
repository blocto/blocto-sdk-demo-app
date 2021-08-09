
import { Link } from 'react-router-dom';

const SelectChain = () => (
  <div className="page-wrapper">
    <div className="card p-4 m-auto">
      <h2>Select Chain</h2>
      <Link className="plain-link my-2" to="ethereum">Ethereum</Link>
      <Link className="plain-link my-2" to="bsc">BSC</Link>
      <Link className="plain-link my-2" to="solana">Solana</Link>
    </div>
  </div>
);


export default SelectChain;