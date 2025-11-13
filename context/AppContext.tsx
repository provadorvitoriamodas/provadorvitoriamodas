import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS, ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

interface NotificationState {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
}

interface AdminCredentials {
  username: string;
  password?: string;
}

interface AppContextType {
  products: Product[];
  isAuthenticated: boolean;
  notification: NotificationState;
  adminUsername: string;
  whatsappNumber: string;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  hideNotification: () => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateWhatsappNumber: (newNumber: string) => void;
  updateAdminCredentials: (credentials: AdminCredentials) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // State from localStorage for persistence
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => localStorage.getItem('whatsappNumber') || '');
  const [adminUsername, setAdminUsername] = useState<string>(() => localStorage.getItem('adminUsername') || ADMIN_USERNAME);
  const [adminPassword, setAdminPassword] = useState<string>(() => localStorage.getItem('adminPassword') || ADMIN_PASSWORD);

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    localStorage.setItem('adminUsername', adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    localStorage.setItem('adminPassword', adminPassword);
  }, [adminPassword]);


  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ isOpen: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  const login = useCallback((user: string, pass: string): boolean => {
    if (user === adminUsername && pass === adminPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [adminUsername, adminPassword]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: new Date().toISOString(),
      ...productData,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    showNotification('Peça adicionada com sucesso!');
  }, [showNotification]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showNotification('Peça atualizada com sucesso!');
  }, [showNotification]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    showNotification('Peça removida com sucesso!');
  }, [showNotification]);

  const updateWhatsappNumber = useCallback((newNumber: string) => {
    setWhatsappNumber(newNumber);
    showNotification('Número do WhatsApp atualizado com sucesso!');
  }, [showNotification]);

  const updateAdminCredentials = useCallback(({ username, password }: AdminCredentials) => {
    setAdminUsername(username);
    if (password) {
      setAdminPassword(password);
    }
    showNotification('Credenciais de administrador atualizadas!');
  }, [showNotification]);

  const value = {
    products,
    isAuthenticated,
    notification,
    adminUsername,
    whatsappNumber,
    showNotification,
    hideNotification,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    updateWhatsappNumber,
    updateAdminCredentials,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};