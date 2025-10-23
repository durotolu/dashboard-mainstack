
import { Header } from './components/Header';
import { WalletSummary } from './components/WalletSummary';
import { RevenueChart } from './components/RevenueChart';
import { TransactionList } from './components/TransactionList';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <WalletSummary />
          <RevenueChart />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}

export default App;
