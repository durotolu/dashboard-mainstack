
import { Header } from './components/Header';
import { WalletSummary } from './components/WalletSummary';
import { TransactionList } from './components/TransactionList';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <WalletSummary />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}

export default App;
