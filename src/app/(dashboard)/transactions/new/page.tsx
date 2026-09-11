"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import type { CartItem, PaymentMethod } from "@/types/cart";
import { formatRupiah } from "@/utils/format";

export default function NewTransactionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }
  loadProducts()}, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
    const keyword = search.toLowerCase();
    
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)
    )
    })
  }, [products, search]);
  
  function handleAddToCart(product: Product) {setCartItems((currentItems) => {
    const existingItem = currentItems.find((item) => item.productId === product.id);

    if (existingItem) {
      return currentItems.map((item) =>
        item.productId === product.id
          ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
          : item
      );
    }

    return [...currentItems, { productId: product.id, name: product.name, price: product.price, qty: 1, subtotal: product.price }]
  })}

  function handleUpdateQty(productId: string, qty: number) {
    if (qty < 1) return;
    
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId? { ...item, qty, subtotal: qty * item.price }: item));
  }

  function handleRemoveItem(productId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId));
  }

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  }, [cartItems]);
  
  const grandTotal = useMemo(() => {
    return Math.max(subtotal - discount, 0);
  }, [subtotal, discount]);

  function handleCheckout() {
    if (cartItems.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    const payload = {
      items: cartItems,
      subtotal,
      discount,
      grandTotal,
      paymentMethod,
    };

    console.log("checkout payload", payload);
    alert("Checkout berhasil disiapkan. Lihat console.");
  }


  return (
    <div>
        <div className="flex flex-col py-3">
          <p className="text-sm font-bold text-indigo-600">TRANSACTION</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-200">Kasir / POS</h1>
        </div>
      <div className="grid gap-3">
        {filtered.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-2xl border bg-white p-4">
            <div>
              <h3 className="font-bold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500">{formatRupiah(product.price)}</p>
            </div>
              
            <Button onClick={() => handleAddToCart(product)}>Tambah</Button>
            </div>
        ))}

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <ShoppingCart className="mx-auto text-slate-400" />
            <h3 className="mt-4 font-bold">Keranjang masih kosong</h3>
            <p className="mt-1 text-sm text-slate-500">Pilih produk dari daftar di sebelah kiri.</p>
          </div>) : (<div className="text-orange-500">Cart List</div>
        )}

        {cartItems.map((item) => (
          <div key={item.productId} className="rounded-2xl border bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">
                  {formatRupiah(item.price)} x {item.qty}
                </p>
              </div>

              <Button onClick={() => handleRemoveItem(item.productId)}>
                Hapus
              </Button>
            </div>
            <Input type="number" min={1} value={item.qty} onChange={(event) => handleUpdateQty(item.productId, Number(event.target.value))}/>
          </div>
        ))}
        <div className="border-2 rounded-2xl p-2 border-indigo-600">
          <div className="flex justify-center gap-2">
            <Input type="number" min={0} value={discount} onChange={(event) => setDiscount(Number(event.target.value))} className="max-w-[80px] text-center"/>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
            </select>
            <Button type="button" disabled={cartItems.length === 0} onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

