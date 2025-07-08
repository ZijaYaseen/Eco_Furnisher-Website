import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

// Product type based on Sanity schema
interface Variant {
  vid?: string;
  variantSellPrice?: number;
  variantSugSellPrice?: number;
  variantActualSellPrice?: number;
  discountPercentage?: number;
  colors?: { colorName: string; colorCode: string };
  variantImage?: string;
}
interface Product {
  _id: string;
  productNameEn: string;
  productSku: string;
  productImageSet: string[];
  categoryId: string;
  CategoryName: string[];
  packingWeight: number;
  shippingCharge: number;
  shortDescription: string;
  description: string;
  rating: number;
  inventory: number;
  tags: string[];
  slug: { current: string };
  variants: Variant[];
}

const initialForm: Partial<Product> = {
  productNameEn: '',
  productSku: '',
  productImageSet: [],
  categoryId: '',
  CategoryName: [],
  packingWeight: 0,
  shippingCharge: 0,
  shortDescription: '',
  description: '',
  rating: 0,
  inventory: 0,
  tags: [],
  slug: { current: '' },
  variants: [{ variantActualSellPrice: 0 }],
};

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(initialForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/product');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        setError('Failed to fetch products');
      }
      setLoading(false);
    }
    fetchProducts();
  }, [showModal, deletingId, success]);

  // Handle form input
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleArrayChange(name: keyof Product, value: string) {
    setForm({ ...form, [name]: value.split(',').map(v => v.trim()) });
  }

  function handleVariantChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      variants: [{ ...(f.variants?.[0] || {}), [name]: name.includes('Price') ? Number(value) : value }],
    }));
  }

  // Add or update product
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const method = editProduct ? 'PATCH' : 'POST';
      const body = editProduct ? { ...form, _id: editProduct._id } : form;
      const res = await fetch('/api/dashboard/product', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save product');
      setShowModal(false);
      setEditProduct(null);
      setForm(initialForm);
      setSuccess('Product saved successfully!');
    } catch (e) {
      setError('Failed to save product');
    }
  }

  // Delete product
  async function handleDelete(id: string) {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/dashboard/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeletingId(null);
      setSuccess('Product deleted successfully!');
    } catch (e) {
      setError('Failed to delete product');
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg text-black">Products</div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => { setShowModal(true); setEditProduct(null); setForm(initialForm); }}
        >
          Add Product
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">SKU</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Inventory</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {p.productImageSet?.[0] && (
                      <img src={p.productImageSet[0]} alt={p.productNameEn} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium text-black">{p.productNameEn}</td>
                  <td className="py-2 px-4">{p.productSku}</td>
                  <td className="py-2 px-4">${p.variants?.[0]?.variantActualSellPrice?.toFixed(2) || '-'}</td>
                  <td className="py-2 px-4">{p.inventory}</td>
                  <td className="py-2 px-4">{p.CategoryName?.join(', ')}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() => { setEditProduct(p); setForm(p); setShowModal(true); }}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => setDeletingId(p._id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative"
            onSubmit={handleSubmit}
          >
            <div className="font-bold text-lg mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</div>
            <label className="block mb-2">Name
              <input name="productNameEn" value={form.productNameEn || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </label>
            <label className="block mb-2">SKU
              <input name="productSku" value={form.productSku || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </label>
            <label className="block mb-2">Inventory
              <input name="inventory" type="number" value={form.inventory || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </label>
            <label className="block mb-2">Category Name (comma separated)
              <input name="CategoryName" value={form.CategoryName?.join(', ') || ''} onChange={e => handleArrayChange('CategoryName', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block mb-2">Short Description
              <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block mb-2">Price (first variant)
              <input name="variantActualSellPrice" type="number" value={form.variants?.[0]?.variantActualSellPrice || ''} onChange={handleVariantChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </label>
            <label className="block mb-2">Image URL (comma separated)
              <input name="productImageSet" value={form.productImageSet?.join(', ') || ''} onChange={e => handleArrayChange('productImageSet', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <div className="flex gap-2 mt-6">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
              <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setShowModal(false); setEditProduct(null); setForm(initialForm); }}>Cancel</button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </div>
      )}
      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
            <div className="font-bold text-lg mb-4">Delete Product?</div>
            <div className="mb-4">Are you sure you want to delete this product?</div>
            <div className="flex gap-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleDelete(deletingId)}>Delete</button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setDeletingId(null)}>Cancel</button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 