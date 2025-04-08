import { useEffect, useState } from 'react';
import { Coin } from '../types';
import Button from './common/Button';

interface ICryptoCardProps {
  coin: Coin;
  onDelete: (name: string) => void;
  onUpdate: (name: string) => void;
}

export const CryptoCard = ({ coin, onDelete, onUpdate }:CryptoCardProps) => {
  const [prevPrice, setPrevPrice] = useState(coin.price);
  const priceChange = coin.price > prevPrice ? 'up' : 
                    coin.price < prevPrice ? 'down' : 'stable';

  useEffect(() => {
    if (coin.price !== prevPrice) {
      const timeout = setTimeout(() => setPrevPrice(coin.price), 2000);
      return () => clearTimeout(timeout);
    }
  }, [coin.price, prevPrice]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-2">
      <div className="flex items-center">
        <span className="font-bold mr-2">{coin.name}</span>
        <span>${coin.price.toFixed(2)}</span>
        {priceChange === 'up' && <span className="ml-2 text-green-500">↑</span>}
        {priceChange === 'down' && <span className="ml-2 text-red-500">↓</span>}
      </div>
      <div className="space-x-2">
        <Button
          label="Update"
          variant='primary'
          onClick={() => onUpdate(coin.name)}
        />
        <Button
          label="Delete"
          variant='secondary'
          onClick={() => onDelete(coin.name)}
        />
      </div>
    </div>
  );
};