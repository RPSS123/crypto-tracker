import React, { useEffect, useState } from "react";
import PriceGraph from "./PriceGraph";
import axios from "axios";

const CryptoTracker = () => {
    const [coins, setCoins] = useState([]);
    const [currency, setCurrency] = useState("usd");
    const [searchInput, setSearchInput] = useState("");
    const [chartData, setChartData] = useState([]);
    const [searchedCoinName, setSearchedCoinName] = useState('');
    const [transactions, setTransactions] = useState([]);


    const fetchCryptoPrices = async (selectedCurrency) => {
        try {
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=${selectedCurrency}`
            );

            const data = res.data;

            const coinData = [
                { name: "Bitcoin", price: data.bitcoin[selectedCurrency] },
                { name: "Ethereum", price: data.ethereum[selectedCurrency] },
                { name: "Solana", price: data.solana[selectedCurrency] },
            ];

            setCoins(coinData);
        } catch (error) {
            alert("Failed to fetch prices: " + error.message);
        }
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        try {
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${searchInput}&vs_currencies=${currency}`
            );

            const data = res.data;

            if (Object.keys(data).length === 0) {
                alert("Coin not found. Try another one.");
                return;
            }

            const coinData = [
                {
                    name: searchInput.charAt(0).toUpperCase() + searchInput.slice(1),
                    price: data[searchInput][currency],
                },
            ];

            setCoins(coinData);
        } catch (error) {
            alert("Error fetching coin data: " + error.message);
        }
    };

    const fetchGraphData = async (coin, currency) => {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=7`
        );
        const data = await response.json();

        const graphData = data.prices.map(([timestamp, price]) => {
            const date = new Date(timestamp).toLocaleDateString();
            return { date, price: price.toFixed(2) };
        });

        setChartData(graphData);
    };

    const handleTransaction = async (action, coin, amount) => {
        try {
            const user = JSON.parse(localStorage.getItem("userDetails")); // Save this from modal
            const payload = {
                name: user.name,
                actionType: action,
                coin,
                amount,
                timestamp: new Date().toISOString()
            };

            await axios.post("http://localhost:5084/api/PersonTransaction", payload); // Your Web API URL
            alert("Transaction saved!");
        } catch (err) {
            console.error("Error saving transaction", err);
            alert("Failed to save transaction.");
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("http://localhost:5084/api/PersonTransaction");
            setTransactions(res.data.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    useEffect(() => {
        fetchCryptoPrices(currency);
    }, [currency]);

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);


    return (
        <div>
            <header className="bg-primary text-white py-3">
                <div className="container text-center">
                    <h1>💹 Live Crypto Tracker</h1>
                    <p className="lead">Get live cryptocurrency prices instantly</p>
                </div>
            </header>
            <br />
            <div className="text-center mb-4">
                <label htmlFor="currency-select" className="form-label fs-5">Choose Currency:</label>
                <br />
                <select
                    id="currency-select"
                    className="form-select w-auto d-inline-block"
                    value={currency}
                    onChange={handleCurrencyChange}
                >
                    <option value="usd">USD</option>
                    <option value="inr">INR</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                </select>
            </div>
            <div className="d-flex justify-content-center mt-4">
                <div className="input-group w-50 shadow-sm" style={{ maxWidth: '500px' }}>
                    <input
                        type="text"
                        className="form-control rounded-start-pill px-4 py-2"
                        placeholder="🔍 Search coin like bitcoin, dogecoin..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                    />
                    <button
                        className="btn btn-primary rounded-end-pill px-4"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                </div>
            </div>
            <br />

            <div className="row justify-content-center">
                {coins.map((coin, index) => (
                    <div key={index} className="col-md-3 m-2">
                        <div className="card text-center bg-light shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{coin.name}</h5>
                                <p className="card-text fs-4 text-primary">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: currency.toUpperCase(),
                                    }).format(coin.price)}
                                </p>

                                {/* Refresh Prices Button */}
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-sm btn-outline-secondary mb-2"
                                        onClick={() => fetchCryptoPrices(currency)}
                                    >
                                        🔄 Refresh Prices
                                    </button>
                                </div>

                                {/* Show Graph Button */}
                                <div className="text-center">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            const coinId = coin.name.toLowerCase(); // Convert 'Bitcoin' → 'bitcoin'
                                            setSearchedCoinName(coin.name); // Proper name for the title
                                            fetchGraphData(coinId, currency); // Coin ID for API
                                        }}
                                    >
                                        📈 Show 7-Day Chart
                                    </button>
                                </div>

                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleTransaction("Buy", coin.name, 1)}
                                    >
                                        🟢 Buy
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleTransaction("Sell", coin.name, 1)}
                                    >
                                        🔴 Sell
                                    </button>
                                </div>


                                {/* Graph Display */}
                                {searchedCoinName === coin.name && chartData.length > 0 && (
                                    <div className="mt-3">
                                        <PriceGraph data={chartData} coinName={searchedCoinName} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            <div className="container mt-5">
                <h3 className="text-center mb-3">📜 Transaction History</h3>
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index}>
                                <td>{tx.name}</td>
                                <td>{tx.actionType}</td>
                                <td>{tx.coin}</td>
                                <td>{tx.amount}</td>
                                <td>{new Date(tx.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>


    );
};

export default CryptoTracker;
