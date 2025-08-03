import react from 'react';
import CryptoPrices from './Components/CryptoPrices';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <CryptoPrices/>
      <Footer/>
    </div>
  );
}

export default App;
