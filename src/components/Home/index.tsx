import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default Home;
