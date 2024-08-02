import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from './components/AppHeader';
import RequestForm from './components/RequestForm';
import RequestsList from './components/RequestList';

function App() {
  const handleFormSubmit = () => {
    console.log("Request published");
  };

  return (
    <div className="App row justify-content-center p-5">
      <AppHeader />
      <RequestForm onSubmit={handleFormSubmit} />
      <RequestsList />
    </div>
  );
}

export default App;