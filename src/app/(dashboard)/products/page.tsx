"use client"

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { deleteProduct, getProducts } from '@/services/product.service';
import { formatCurrency } from '@/utils/currency';
import type { Product } from '@/types/product';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  // const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Membungkus loadProducts dengan useCallback agar tidak memicu memory leak
  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      // Memastikan data yang masuk selalu berupa Array valid
      setProducts(data);

    } catch (error) {
      console.error(error);
      setError("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmed) return;
    await deleteProduct(id);
    await loadProducts();
  }
  
  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return products.filter((product)=>
      product.name.toLowerCase().includes(keyword) ||
    product.sku.toLowerCase().includes(keyword)
  );
},[products, search]);

useEffect(() => {
  loadProducts();
}, []);

if (loading) {
  return (
    <div className='rounded-2xl border bg-white p-6 text-slate-600'>
      Memuat data produk...
    </div>
  );
}

if (error) {
  return (
    <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700'>
      {error}
    </div>
  );
}
  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">MASTER DATA</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-200">Produk</h1>
          <p className="mt-2 text-sm text-slate-500">Kelola produk, harga, dan stok</p>
        </div>
        <Link href="/products/create">
          <Button className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2">
            <Plus size={18} />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="mb-5 max-w-md">
        <Input 
          placeholder="Cari nama atau SKU..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-3"
        />
      </div>

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Produk</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Harga</th>
                  <th className="px-5 py-4">Stok</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const stockColor = (product.stock ?? 0) <= 5 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-emerald-100 text-emerald-800";

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-bold text-slate-900">{product.name}</td>
                      <td className="px-5 py-4 text-slate-500 font-mono">{product.sku}</td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(product.price)}</td>
                      <td className="flex justify-center px-5 py-4 font-bold text-slate-900">
                        <span className={
                            "rounded-full px-2.5 py-1 text-xs font-bold " +
                            stockColor
                          }
                          >
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Link 
                            href={"/products/"+product.id+"/edit"} 
                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                          >
                            <Pencil size={15} />
                            Edit
                          </Link>
                          <button type="button"
                            onClick={() => handleDelete(product.id)} 
                            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer hover:bg-rose-500 transition-colors"
                          >
                            <Trash2 size={15} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {products.length === 0 && (
        <EmptyState 
          title="Belum ada produk" 
          description="Tambahkan produk pertama untuk memulai transaksi POS"
        />
      )}

      {products.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 border border-slate-200">
          <Search className="mx-auto mb-2 text-slate-400" size={24} />
          Produk tidak ditemukan
        </div>
      )}
    </div>
  );
}