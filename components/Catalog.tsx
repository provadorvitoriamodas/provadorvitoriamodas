import React, { useState, useCallback, ChangeEvent } from 'react';
import { Product } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { generateTryOnImage } from '../services/geminiService';
import { fileToBase64, getImageUrl } from '../utils';
import Modal from './common/Modal';
import Spinner from './common/Spinner';

interface ProductCardProps {
  product: Product;
  onTryOnClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onTryOnClick }) => {
    const { whatsappNumber } = useAppContext();
    const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse na peça: ${product.name}`);
    const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-96 object-cover" />
            <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 h-16 overflow-hidden">{product.description}</p>
            <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-pink-500">R$ {product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onTryOnClick}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300"
                    >
                        Experimentar
                    </button>
                    {whatsappNumber && (
                        <a
                            href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition duration-300"
                            aria-label="Comprar no WhatsApp"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l.227.361-1.057 3.864 3.952-1.037.352.215z"/></svg>
                        </a>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

const TryOnModalContent: React.FC<{ product: Product }> = ({ product }) => {
    const [userImage, setUserImage] = useState<{ base64: string; file: File | null }>({ base64: '', file: null });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const base64 = await fileToBase64(file);
                setUserImage({ base64, file });
                setGeneratedImage(null);
                setError(null);
            } catch (err) {
                setError("Falha ao carregar a imagem.");
            }
        }
    };

    const handleGenerate = async () => {
        if (!userImage.file || !product.images[0]) {
            setError("Por favor, carregue sua foto e selecione um produto.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        
        try {
            // Check if product image is a picsum URL or base64
            let clothingImageBase64: string;
            let clothingMimeType = 'image/jpeg'; // Default

            if (product.images[0].startsWith('http')) {
                const response = await fetch(product.images[0]);
                const blob = await response.blob();
                const reader = new FileReader();
                clothingImageBase64 = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                clothingMimeType = blob.type;
            } else {
                clothingImageBase64 = product.images[0];
            }

            const resultBase64 = await generateTryOnImage(userImage.base64, clothingImageBase64, userImage.file.type, clothingMimeType);
            setGeneratedImage(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <h3 className="text-lg font-semibold mb-2">1. Peça Selecionada</h3>
                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                <h4 className="mt-4 text-xl font-bold">{product.name}</h4>
                <p className="text-pink-500 text-lg">R$ {product.price.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">2. Carregue sua foto</h3>
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-pink-500 rounded-lg shadow-md tracking-wide uppercase border border-pink-500 cursor-pointer hover:bg-pink-500 hover:text-white">
                        <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-4h2v4z" />
                        </svg>
                        <span className="mt-2 text-base leading-normal">Selecione uma foto</span>
                        <input type='file' className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {userImage.base64 && <img src={`data:${userImage.file?.type};base64,${userImage.base64}`} alt="Sua foto" className="mt-4 rounded-lg shadow-md w-full" />}
                </div>

                {userImage.base64 && (
                     <div>
                        <h3 className="text-lg font-semibold mb-2">3. Gerar Imagem</h3>
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Gerando...' : 'Ver resultado'}
                        </button>
                    </div>
                )}
                
                {isLoading && <Spinner />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                {generatedImage && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Resultado:</h3>
                        <img src={generatedImage} alt="Você vestindo a peça" className="rounded-lg shadow-xl w-full border-4 border-green-500"/>
                    </div>
                )}
            </div>
        </div>
    );
};

const Catalog: React.FC = () => {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleTryOnClick = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800 dark:text-white">Nosso Catálogo</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">Descubra as últimas tendências e experimente virtualmente.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onTryOnClick={() => handleTryOnClick(product)} />
        ))}
      </div>

      <Modal isOpen={!!selectedProduct} onClose={closeModal} title="Experimente Virtualmente">
        {selectedProduct && <TryOnModalContent product={selectedProduct} />}
      </Modal>
    </div>
  );
};

export default Catalog;