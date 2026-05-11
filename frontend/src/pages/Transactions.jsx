import { useState, useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { format } from 'date-fns';
import { Plus, Trash2, Search } from 'lucide-react';

const Transactions = () => {
    const { transactions, categories, addTransaction, deleteTransaction } = useContext(FinanceContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('All');
    
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        type: 'Expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: '',
    });

    const filteredTransactions = useMemo(() => {
        if (filterType === 'All') return transactions;
        return transactions.filter(t => t.type === filterType);
    }, [transactions, filterType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addTransaction({ ...formData, amount: Number(formData.amount) });
        setIsModalOpen(false);
        setFormData({ ...formData, title: '', amount: '', note: '' });
    };

    return (
        <div>
            <div className="header">
                <h1>Transactions</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Transaction
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <select className="select" style={{ width: '200px' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="All">All Types</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Note</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr key={t._id}>
                                    <td>{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                                    <td>{t.title}</td>
                                    <td>{t.category}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{t.note}</td>
                                    <td>
                                        <span className={`badge ${t.type === 'Income' ? 'badge-income' : 'badge-expense'}`}>
                                            {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => deleteTransaction(t._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        No transactions found.
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
                            <h2>Add Transaction</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Title</label>
                                <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Amount</label>
                                <input type="number" step="0.01" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select className="select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select className="select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                    <option value="">Select Category</option>
                                    {categories.filter(c => c.type === formData.type).map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Date</label>
                                <input type="date" className="input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Note (Optional)</label>
                                <input type="text" className="input" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
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

export default Transactions;
