import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { fileToBase64, getImageUrl } from '../utils';
import Modal from './common/Modal';
import ConfirmationModal from './common/ConfirmationModal';

// --- Login Component ---
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(username, password)) {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">Acesso Administrador</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Product Form Component ---
interface ProductFormProps {
    productToEdit?: Product | null;
    onClose: () => void;
}
const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onClose }) => {
    const { addProduct, updateProduct } = useAppContext();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setPrice(productToEdit.price);
            setDescription(productToEdit.description);
            setImages(productToEdit.images.map(img => getImageUrl(img)));
        }
    }, [productToEdit]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files: File[] = Array.from(e.target.files);
            setImageFiles(files);
            const base64Promises = files.map(file => fileToBase64(file));
            const base64Images = await Promise.all(base64Promises);
            setImages(base64Images.map(b64 => `data:image/jpeg;base64,${b64}`));
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const productData = { name, price, description, images: images.map(img => img.split(',')[1] || img) };
        if (productToEdit) {
            updateProduct({ ...productData, id: productToEdit.id });
        } else {
            addProduct(productData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Peça</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preço</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" rows={4} required></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagens</label>
                <input type="file" onChange={handleImageChange} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" multiple accept="image/*"/>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {images.map((img, index) => <img key={index} src={img} className="h-24 w-24 object-cover rounded"/>)}
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="py-2 px-4 rounded-md bg-pink-500 text-white hover:bg-pink-600">{productToEdit ? 'Salvar Alterações' : 'Adicionar Peça'}</button>
            </div>
        </form>
    );
};

// --- Admin Dashboard Component ---
const AdminDashboard: React.FC = () => {
  const { 
    products, 
    deleteProduct,
    whatsappNumber,
    updateWhatsappNumber,
    adminUsername,
    updateAdminCredentials,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Local state for settings forms
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsappNumber);
  const [localUsername, setLocalUsername] = useState(adminUsername);
  const [localPassword, setLocalPassword] = useState('');
  const [localPasswordConfirm, setLocalPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAddProduct = () => {
      setProductToEdit(null);
      setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
      setProductToEdit(product);
      setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
      setProductToDelete(productId);
  }

  const onConfirmDelete = () => {
      if(productToDelete) {
          deleteProduct(productToDelete);
          setProductToDelete(null); 
      }
  }

  const closeModal = useCallback(() => {
      setIsModalOpen(false);
      setProductToEdit(null);
  }, []);

  const handleWhatsappSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateWhatsappNumber(localWhatsapp);
  };

  const handleCredentialsSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (localPassword && localPassword !== localPasswordConfirm) {
        setPasswordError('As senhas não coincidem.');
        return;
    }
    updateAdminCredentials({
        username: localUsername,
        password: localPassword || undefined
    });
    setLocalPassword('');
    setLocalPasswordConfirm('');
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gerenciar Catálogo</h1>
            <button onClick={handleAddProduct} className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-pink-600 transition duration-300">
                + Adicionar Peça
            </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Peça</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Preço</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-16 h-24">
                                        <img className="w-full h-full rounded object-cover" src={getImageUrl(product.images[0])} alt={product.name} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-semibold">{product.name}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                <p className="text-gray-900 dark:text-white whitespace-no-wrap">R$ {product.price.toFixed(2)}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Editar</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Remover</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Configurações da Loja</h2>
                <form onSubmit={handleWhatsappSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número do WhatsApp</label>
                        <input
                            id="whatsapp"
                            type="text"
                            value={localWhatsapp}
                            onChange={(e) => setLocalWhatsapp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            placeholder="(XX) XXXXX-XXXX"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Este número será usado no botão "Comprar no WhatsApp".</p>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-pink-500 hover:bg-pink-600">
                        Salvar Número
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Segurança</h2>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="adminUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome de Usuário</label>
                        <input
                            id="adminUser"
                            type="text"
                            value={localUsername}
                            onChange={(e) => setLocalUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="adminPass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
                        <input
                            id="adminPass"
                            type="password"
                            value={localPassword}
                            onChange={(e) => setLocalPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            placeholder="Deixe em branco para não alterar"
                        />
                    </div>
                    <div>
                        <label htmlFor="adminPassConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                        <input
                            id="adminPassConfirm"
                            type="password"
                            value={localPasswordConfirm}
                            onChange={(e) => setLocalPasswordConfirm(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        />
                    </div>
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-pink-500 hover:bg-pink-600">
                        Salvar Credenciais
                    </button>
                </form>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={productToEdit ? 'Editar Peça' : 'Adicionar Nova Peça'}>
            <ProductForm productToEdit={productToEdit} onClose={closeModal} />
        </Modal>

        <ConfirmationModal
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={onConfirmDelete}
            title="Confirmar Remoção"
            message="Tem certeza que deseja remover esta peça do catálogo? Esta ação não pode ser desfeita."
        />
    </div>
  );
};


// --- Main Admin Router Component ---
const Admin: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <AdminDashboard />;
};

export default Admin;