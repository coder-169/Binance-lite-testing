import React from "react";

const CoinData = ({ amount, symbol, inOrder }) => {
  return (
    <div className="flex w-full justify-between px-4 py-2 my-4 border-b border-gray-300">
      <div className="w-1/4">
        <h3 className="font-medium ">{symbol}</h3>
        <small>In Orders {inOrder}</small>
      </div>

      <div className="w-1/12">
        <h3 className="text-sm font-medium ">{amount}</h3>
      </div>
    </div>
  );
};

export default CoinData;
