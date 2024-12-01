import { Product } from '../models/product.model';

const products: Product[] = []; // Simulación de base de datos

export class ProductService {
    async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const newProduct: Product = { id: Date.now().toString(), ...product };
        products.push(newProduct);
        return newProduct;
    }

    async getAllProducts(): Promise<Product[]> {
        return products;
    }

    async getProductById(id: string): Promise<Product | undefined> {
        return products.find((product) => product.id === id);
    }

    async updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
        const product = products.find((product) => product.id === id);
        if (!product) return null;
        Object.assign(product, updates);
        return product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) return false;
        products.splice(index, 1);
        return true;
    }

    async updateStock(id: string, quantity: number): Promise<Product | null> {
        const product = products.find((product) => product.id === id);
        if (!product) return null;
        product.stock += quantity;
        return product;
    }
}
