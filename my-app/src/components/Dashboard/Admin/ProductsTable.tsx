import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

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
  variants: [{ variantActualSellPrice: 0, colors: { colorName: '', colorCode: '' } }],
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
        const res = await fetch('/api/dashboard/products');
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

  function handleVariantChange(idx: number, e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      variants: (f.variants || []).map((v, i) =>
        i === idx ? { ...v, [name]: name.includes('Price') || name === 'discountPercentage' ? Number(value) : value } : v
      ),
    }));
  }

  function handleVariantColorChange(idx: number, e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      variants: (f.variants || []).map((v, i) =>
        i === idx ? { ...v, colors: { ...(v.colors || {}), [name]: value } } : v
      ),
    }));
  }

  function addVariant() {
    setForm(f => ({ ...f, variants: [...(f.variants || []), { variantActualSellPrice: 0, colors: { colorName: '', colorCode: '' } }] }));
  }

  function removeVariant(idx: number) {
    setForm(f => ({ ...f, variants: (f.variants || []).filter((_, i) => i !== idx) }));
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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg text-gray-900">Products</div>
        <button
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
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
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="py-2 px-4 font-semibold">Image</th>
                <th className="py-2 px-4 font-semibold">Name</th>
                <th className="py-2 px-4 font-semibold">SKU</th>
                <th className="py-2 px-4 font-semibold">Price</th>
                <th className="py-2 px-4 font-semibold">Inventory</th>
                <th className="py-2 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4">
                    {p.productImageSet?.[0] && (
                      <img src={p.productImageSet[0]} alt={p.productNameEn} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900">{p.productNameEn}</td>
                  <td className="py-2 px-4 text-gray-700">{p.productSku}</td>
                  <td className="py-2 px-4 text-gray-700">${p.variants?.[0]?.variantActualSellPrice?.toFixed(2) || '-'}</td>
                  <td className="py-2 px-4 text-gray-700">{p.inventory}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="text-gray-900 hover:underline"
                      onClick={() => { setEditProduct(p); setForm(p); setShowModal(true); }}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(p._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
            onSubmit={handleSubmit}
          >
            <div className="font-bold text-2xl mb-6 text-center">{editProduct ? 'Edit Product' : 'Add Product'}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">Name
                <input name="productNameEn" value={form.productNameEn || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
              </label>
              <label className="block">SKU
                <input name="productSku" value={form.productSku || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
              </label>
              <label className="block">Inventory
                <input name="inventory" type="number" value={form.inventory || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
              </label>
              <label className="block">Packing Weight
                <input name="packingWeight" type="number" value={form.packingWeight || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
              <label className="block">Shipping Charge
                <input name="shippingCharge" type="number" value={form.shippingCharge || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
              <label className="block">Tags (comma separated)
                <input name="tags" value={form.tags?.join(', ') || ''} onChange={e => handleArrayChange('tags', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
              <label className="block md:col-span-2">Short Description
                <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
              <label className="block md:col-span-2">Description
                <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
              <label className="block md:col-span-2">Image URLs (comma separated)
                <input name="productImageSet" value={form.productImageSet?.join(', ') || ''} onChange={e => handleArrayChange('productImageSet', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
              </label>
            </div>
            <div className="mt-6">
              <div className="font-bold text-lg mb-2 flex items-center gap-2">Variants
                <button type="button" className="ml-2 bg-green-100 text-green-700 rounded-full p-1 hover:bg-green-200" onClick={addVariant} title="Add Variant"><FaPlus /></button>
              </div>
              {(form.variants || []).map((v, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-4 relative bg-gray-50">
                  <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeVariant(idx)} title="Remove Variant"><FaTrash /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">Variant ID
                      <input name="vid" value={v.vid || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Sell Price
                      <input name="variantSellPrice" type="number" value={v.variantSellPrice || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Suggested Sell Price
                      <input name="variantSugSellPrice" type="number" value={v.variantSugSellPrice || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Actual Sell Price
                      <input name="variantActualSellPrice" type="number" value={v.variantActualSellPrice || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Discount (%)
                      <input name="discountPercentage" type="number" value={v.discountPercentage || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Variant Image URL
                      <input name="variantImage" value={v.variantImage || ''} onChange={e => handleVariantChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Color Name
                      <input name="colorName" value={v.colors?.colorName || ''} onChange={e => handleVariantColorChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                    <label className="block">Color Code
                      <input name="colorCode" value={v.colors?.colorCode || ''} onChange={e => handleVariantColorChange(idx, e)} className="w-full border rounded px-3 py-2 mt-1" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save</button>
              <button type="button" className="bg-gray-200 px-6 py-2 rounded" onClick={() => { setShowModal(false); setEditProduct(null); setForm(initialForm); }}>Cancel</button>
            </div>
            {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
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