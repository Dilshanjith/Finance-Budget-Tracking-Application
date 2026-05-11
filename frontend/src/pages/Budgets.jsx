import { useState, useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus } from 'lucide-react';

const Budgets = () => {
    const { budgets, categories, addBudget, updateBudget, transactions } = useContext(FinanceContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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
        const existing = budgets.find(b => b.category === formData.category);
        if (existing) {
            await updateBudget(existing._id, { ...formData, amount: Number(formData.amount) });
        } else {
            await addBudget({ ...formData, amount: Number(formData.amount) });
        }
        setIsModalOpen(false);
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 600 }}>{b.category}</h3>
                            <span style={{ color: 'var(--text-muted)' }}>{b.period}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>${b.spent.toFixed(2)}</span>
                            <span style={{ color: 'var(--text-muted)' }}>of ${b.amount.toFixed(2)}</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', 
                                width: `${b.progress}%`, 
                                backgroundColor: b.exceeded ? 'var(--danger)' : 'var(--primary)',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        {b.exceeded && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
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
                            <h2>Set Budget</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
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
                                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budgets;
