import type{CreateProductInput, Product} from "@/types/product";

const STORAGE_KEY = "minipos-products";

export function getProductById(id: string){
    const products = getProducts();
    const product = products.find((item)=>{
        return item.id===id;
    })
    return product ?? null;
}