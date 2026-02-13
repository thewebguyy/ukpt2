import { useState } from 'react';
import { db, storage } from '../../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';

const AdminUpload = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'apparel',
        description: '',
        stock: 100,
        hasBulkPricing: false,
        bulkPricing: [
            { quantity: 10, price: 0 },
            { quantity: 20, price: 0 }
        ]
    });
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) return toast.error('Please select an image');

        setIsSubmitting(true);
        try {
            // 1. Upload Image
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);

            // 2. Save to Firestore
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                imageUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, 'products'), productData);

            toast.success('Product uploaded successfully!');
            // Reset form
            setFormData({
                name: '', price: '', category: 'apparel', description: '', stock: 100,
                hasBulkPricing: false, bulkPricing: [{ quantity: 10, price: 0 }, { quantity: 20, price: 0 }]
            });
            setImageFile(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkPricingChange = (index, field, value) => {
        const newTiers = [...formData.bulkPricing];
        newTiers[index][field] = parseFloat(value);
        setFormData({ ...formData, bulkPricing: newTiers });
    };

    return (
        <div>
            <h2 className="h4 fw-bold mb-4">UPLOAD NEW PRODUCT</h2>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label className="form-label small fw-bold">PRODUCT NAME *</label>
                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">BASE PRICE (£) *</label>
                                <input type="number" step="0.01" className="form-control" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">CATEGORY *</label>
                                <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="apparel">Apparel</option>
                                    <option value="stickers">Stickers</option>
                                    <option value="party-decor">Party Decor</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">DESCRIPTION *</label>
                            <textarea className="form-control" rows="4" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-light border-0 p-3 mb-3">
                            <label className="form-label small fw-bold">MAIN IMAGE *</label>
                            <input type="file" className="form-control mb-2" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            {imageFile && <p className="small text-muted mb-0 text-truncate">{imageFile.name}</p>}
                        </div>

                        <div className="card bg-light border-0 p-3">
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" id="bulkMode" checked={formData.hasBulkPricing} onChange={e => setFormData({ ...formData, hasBulkPricing: e.target.checked })} />
                                <label className="form-check-label small fw-bold" htmlFor="bulkMode">BULK PRICING MODE</label>
                            </div>

                            {formData.hasBulkPricing && (
                                <div className="bulk-tiers">
                                    {formData.bulkPricing.map((tier, idx) => (
                                        <div key={idx} className="d-flex gap-2 mb-2">
                                            <input type="number" className="form-control form-control-sm" placeholder="Qty" value={tier.quantity} onChange={e => handleBulkPricingChange(idx, 'quantity', e.target.value)} />
                                            <input type="number" step="0.01" className="form-control form-control-sm" placeholder="Price" value={tier.price} onChange={e => handleBulkPricingChange(idx, 'price', e.target.value)} />
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-sm btn-link p-0" onClick={() => setFormData({ ...formData, bulkPricing: [...formData.bulkPricing, { quantity: 0, price: 0 }] })}>+ Add Tier</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark btn-lg mt-4 w-100" disabled={isSubmitting}>
                    {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    UPLOAD PRODUCT
                </button>
            </form>
        </div>
    );
};

export default AdminUpload;
