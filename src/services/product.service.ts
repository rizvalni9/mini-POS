import {db} from "@/lib/firebase";
import type {Product, ProductInput} from "@/types/product";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";

  // const DEMO_USER_ID = "demo-user";
  function productCollection(uid: string){
    return collection(db, "users", uid, "products");
  }

  export async function getProducts(uid: string): Promise<Product[]>{
    const snapshot = await getDocs(query(productCollection(uid), orderBy("createdAt","desc")));
    return snapshot.docs.map((item) => ({
      id: item.id,...item.data(),
    } as Product));
  }

  export async function getProduct(uid: string, productId: string): Promise<Product | null>{
    const snapshot = await getDoc(doc(db,"users",uid, "products", productId));
    if(!snapshot.exists())return null;
    return { id:snapshot.id,...snapshot.data()} as Product;
  }

  export async function createProduct(uid: string, input: ProductInput){
    await addDoc(productCollection(uid),{
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  export async function updateProduct(uid: string, productId: string, input: ProductInput) {
    return updateDoc(doc(db, "users", uid, "products", productId),{
      ...input,
      updatedAt: serverTimestamp(),
    })
  }

  export async function deleteProduct(uid:string, productId:string) {
    return deleteDoc(doc(db,"users",uid, "products", productId));
  }

  // export async function getProductById(id: string){
  //   const products = await getProducts();

  //   return products.find(
  //     (product) => product.id === id
  //   );
  // }