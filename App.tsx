
import React, { useState } from 'react';
import Catalog from './components/Catalog';
import Admin from './components/Admin';
import { useAppContext } from './hooks/useAppContext';
import Notification from './components/common/Notification';

type View = 'catalog' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('catalog');
  const { isAuthenticated, logout } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Notification />
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-pink-500 cursor-pointer" onClick={() => setView('catalog')}>
            Vitoria Modas
          </div>
          <div>
            {view === 'catalog' ? (
              <button
                onClick={() => setView('admin')}
                className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300"
              >
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              </button>
            ) : (
              <button
                onClick={() => {
                  if(isAuthenticated) logout();
                  setView('catalog');
                }}
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                {isAuthenticated ? 'Logout & View Catalog' : 'View Catalog'}
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8">
        {view === 'catalog' ? <Catalog /> : <Admin />}
      </main>

      <footer className="bg-white dark:bg-gray-800 text-center py-6 shadow-inner">
        <p>&copy; {new Date().getFullYear()} Vitoria Modas. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
