import { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus, Trash2, Pencil } from 'lucide-react';

const Categories = () => {
    const { categories, addCategory, deleteCategory, updateCategory } = useContext(FinanceContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'Expense',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateCategory(editingId, formData);
        } else {
            await addCategory(formData);
        }
        closeModal();
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData({ name: category.name, type: category.type });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', type: 'Expense' });
    };

    return (
        <div>
            <div className="header">
                <h1>Categories</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c._id}>
                                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                                    <td>
                                        <span className={`badge ${c.type === 'Income' ? 'badge-income' : 'badge-expense'}`}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-ghost" 
                                            style={{ padding: '0.5rem', color: 'var(--primary)', marginRight: '0.5rem' }} 
                                            onClick={() => handleEdit(c)}
                                            title="Edit Category"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button 
                                            className="btn btn-ghost" 
                                            style={{ padding: '0.5rem', color: 'var(--danger)' }} 
                                            onClick={() => handleDelete(c._id)}
                                            title="Delete Category"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select className="select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
