import { create } from 'zustand';

type ProductLite = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
};

interface ProductStore {
  products: ProductLite[];
  loading: boolean;
  error: string | null;
  setProducts: (products: ProductLite[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
