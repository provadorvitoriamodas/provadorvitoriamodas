
import { Product } from './types';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'password123';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral de Verão',
    price: 189.90,
    description: 'Um vestido leve e arejado, perfeito para os dias quentes de verão. Estampa floral vibrante e tecido de algodão confortável.',
    images: ['https://picsum.photos/id/1015/800/1200'],
  },
  {
    id: '2',
    name: 'Jaqueta Jeans Clássica',
    price: 299.90,
    description: 'A jaqueta jeans que nunca sai de moda. Versátil, durável e estilosa para qualquer ocasião.',
    images: ['https://picsum.photos/id/1025/800/1200'],
  },
  {
    id: '3',
    name: 'Calça de Alfaiataria',
    price: 249.50,
    description: 'Elegância e conforto em uma única peça. Ideal para o trabalho ou eventos formais. Corte impecável.',
    images: ['https://picsum.photos/id/102/800/1200'],
  },
  {
    id: '4',
    name: 'Blusa de Seda Pura',
    price: 350.00,
    description: 'Toque suave e caimento perfeito. Uma blusa de seda que eleva qualquer look com sofisticação.',
    images: ['https://picsum.photos/id/20/800/1200'],
  },
   {
    id: '5',
    name: 'Saia Midi Plissada',
    price: 199.99,
    description: 'Movimento e feminilidade. A saia midi plissada é uma tendência que combina com tudo, do tênis ao salto alto.',
    images: ['https://picsum.photos/id/200/800/1200'],
  },
  {
    id: '6',
    name: 'T-Shirt Básica de Algodão',
    price: 89.90,
    description: 'A peça essencial em qualquer guarda-roupa. Confortável, versátil e feita com algodão de alta qualidade.',
    images: ['https://picsum.photos/id/21/800/1200'],
  },
];
