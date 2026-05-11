import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const Dashboard = () => {
    const { transactions, budgets } = useContext(FinanceContext);

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let income = 0;
        let expense = 0;
        transactions.forEach((t) => {
            if (t.type === 'Income') income += t.amount;
            if (t.type === 'Expense') expense += t.amount;
        });
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    const expenseByCategory = useMemo(() => {
        const expenses = transactions.filter((t) => t.type === 'Expense');
        const data = {};
        expenses.forEach((t) => {
            data[t.category] = (data[t.category] || 0) + t.amount;
        });
        return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
    }, [transactions]);

    const budgetVsActual = useMemo(() => {
        return budgets.map((b) => {
            const spent = transactions
                .filter((t) => t.type === 'Expense' && t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                category: b.category,
                Budget: b.amount,
                Spent: spent,
            };
        });
    }, [transactions, budgets]);

    return (
        <div>
            <div className="header">
                <h1>Dashboard Overview</h1>
            </div>

            <div className="dashboard-grid">
                <div className="card stat-card">
                    <div className="stat-icon balance">
                        <Wallet size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Current Balance</h3>
                        <p>${balance.toFixed(2)}</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon income">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Total Income</h3>
                        <p>${totalIncome.toFixed(2)}</p>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon expense">
                        <ArrowDownCircle size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Total Expense</h3>
                        <p>${totalExpense.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Expenses by Category</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {expenseByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Budget vs Spending</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetVsActual}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="category" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }} />
                                <Legend />
                                <Bar dataKey="Budget" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Spent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Recent Transactions</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 5).map((t) => (
                                <tr key={t._id}>
                                    <td>{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                                    <td>{t.title}</td>
                                    <td>{t.category}</td>
                                    <td>
                                        <span className={`badge ${t.type === 'Income' ? 'badge-income' : 'badge-expense'}`}>
                                            {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
