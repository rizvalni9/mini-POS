import type{ProductInput, Product} from "@/types/product";
import { getProducts } from "@/utils/product-storage";

const STORAGE_KEY = "minipos-product";

export function getProductById(id: string){
    const products = getProducts();
    const product = products.find((item)=>{
        return item.id===id;
    })
    return product ?? null
}

export function updateProduct(id:string, input:ProductInput){
    const products = getProducts();
    const updateProducts = products.map((product)=>{
        if(product.id !==id){
            return product;
        }

        return{
            ...product,
            ...input,
            updateAt: new Date().toISOString(),
        };
    });
    saveProducts(updateProducts);
    return getProductById(id);
}

export function deleteProduct(id:string){
    const products = getProducts();

    const filterProducts = products.filter((product)=>{
        return product.id !==id;
    });

    saveProducts(filterProducts);
}

export function saveProducts(products:Product[]){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}