import Button from "./common/Button";

interface ISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

export const SearchBar = ({ value, onChange, onSearch, disabled }: ISearchBarProps) => (
  <div className="mb-4 flex gap-2">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter cryptocurrency (e.g., BTC)"
      className="flex-1 p-2 border rounded disabled:bg-gray-100"
      disabled={disabled}
    />
    <Button
     label="Search"
     onClick={onSearch}
     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
     disabled={disabled}
    />
  </div>
);