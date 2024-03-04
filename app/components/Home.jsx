import React, { useState } from "react";

const Home = () => {
  const [user, setUser] = useState({ isSubscribed: true });
  return (
    <div className="mt-16">
      {user.isSubscribed ? (
        <div>
          <h1 className="text-3xl font-medium">Your Wallet</h1>
        </div>
      ) : (
        <div>
            
        </div>
      )}
    </div>
  );
};

export default Home;
