import { useState, useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Budgets = () => {
    const { budgets, categories, addBudget, updateBudget, deleteBudget, transactions } = useContext(FinanceContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        period: 'Monthly',
    });

    const expenseCategories = useMemo(() => {
        return categories.filter(c => c.type === 'Expense');
    }, [categories]);

    const budgetProgress = useMemo(() => {
        return budgets.map((b) => {
            const spent = transactions
                .filter((t) => t.type === 'Expense' && t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                ...b,
                spent,
                progress: Math.min((spent / b.amount) * 100, 100),
                exceeded: spent > b.amount
            };
        });
    }, [budgets, transactions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (editingId) {
            await updateBudget(editingId, { ...formData, amount: Number(formData.amount) });
        } else {
            const existing = budgets.find(b => b.category === formData.category);
            if (existing) {
                await updateBudget(existing._id, { ...formData, amount: Number(formData.amount) });
            } else {
                await addBudget({ ...formData, amount: Number(formData.amount) });
            }
        }
        closeModal();
    };

    const handleEdit = (budget) => {
        setEditingId(budget._id);
        setFormData({ category: budget.category, amount: budget.amount, period: budget.period });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            await deleteBudget(id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ category: '', amount: '', period: 'Monthly' });
    };

    return (
        <div>
            <div className="header">
                <h1>Budgets</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Set Budget
                </button>
            </div>

            <div className="dashboard-grid">
                {budgetProgress.map((b) => (
                    <div key={b._id} className="card" style={{ border: b.exceeded ? '1px solid var(--danger)' : '' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{b.category}</h3>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.period}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    onClick={() => handleEdit(b)}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                                    title="Edit Budget"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(b._id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                                    title="Delete Budget"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>${b.spent.toFixed(2)}</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>of ${b.amount.toFixed(2)}</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', 
                                width: `${b.progress}%`, 
                                backgroundColor: b.exceeded ? 'var(--danger)' : 'var(--primary)',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        {b.exceeded && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>
                                Budget exceeded by ${(b.spent - b.amount).toFixed(2)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Budget' : 'Set Budget'}</h2>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Category</label>
                                <select className="select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                    <option value="">Select Category</option>
                                    {expenseCategories.map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Amount</label>
                                <input type="number" step="0.01" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Period</label>
                                <select className="select" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} required>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
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

export default Budgets;
