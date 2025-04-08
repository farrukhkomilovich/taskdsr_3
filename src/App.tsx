import { useState, useEffect, useRef } from 'react';
import { CryptoCard } from './components/CryptoCard';
import { SearchBar } from './components/SearchBar';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { fetchCryptoPrice } from './services/cryptoApi';
import { Coin } from './types';
import Button from './components/common/Button';

export const App = () => {
  const [coins, setCoins] = useState<Coin[]>([{ name: 'DOGE', price: 0 }]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const isOnline = useNetworkStatus();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateAllPrices = async () => {
    if (!isOnline) return;

    try {
      const updatedCoins = await Promise.all(
        coins.map(async (coin) => ({
          ...coin,
          price: await fetchCryptoPrice(coin.name),
        }))
      );
      setCoins(updatedCoins);
    } catch (err) {
      setError('Failed to update prices');
    }
  };

  useEffect(() => {
    updateAllPrices();
    intervalRef.current = setInterval(updateAllPrices, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchInput || !isOnline) return;

    const coinName = searchInput.toUpperCase();
    if (coins.some((coin) => coin.name === coinName)) {
      setError('Coin already in list');
      return;
    }

    try {
      const price = await fetchCryptoPrice(coinName);
      setCoins([...coins, { name: coinName, price }]);
      setSearchInput('');
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = (name: string) => setCoins(coins.filter((coin) => coin.name !== name))

  const handleUpdate = async (name: string) => {
    if (!isOnline) return;

    try {
      const price = await fetchCryptoPrice(name);
      setCoins(coins.map((coin) =>
        coin.name === name ? { ...coin, price } : coin
      ));
    } catch (err) {
      setError('Failed to update price');
    }
  };

  const handleUpdateAll = () => {
    if (!isOnline) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    updateAllPrices();
    intervalRef.current = setInterval(updateAllPrices, 10000);
  };

  return (
    <div className="mx-auto p-4 w-full min-h-screen bg-orange-500">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Crypto Tracker</h1>
        <span
          className={`px-2 py-1 rounded ${isOnline ? 'bg-green-200' : 'bg-red-200'}`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        disabled={!isOnline}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        {coins.map((coin) => (
          <CryptoCard
            key={coin.name}
            coin={coin}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      <Button
        label="Update All"
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
        disabled={!isOnline}
        onClick={handleUpdateAll}
      />
    </div>
  );
};