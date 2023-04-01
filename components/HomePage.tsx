import React from 'react';

function HomePage() {
  // check if logged in, show login or home page
  return (
    <div className="grid grid-cols-1 mt-28 place-items-center">
      <div>
        <h1 className="text-5xl">Whitecliffe Attendance Tracking System</h1>
      </div>
      <button className="bg-button-primary hover:bg-button-primary-hover text-black font-bold py-2 px-20 mt-20 rounded">
        Login
      </button>
      <button className="bg-button-primary hover:bg-button-primary-hover text-black font-bold py-2 px-20 mt-10 rounded">
        Register
      </button>
    </div>
  );
}

export default HomePage;
