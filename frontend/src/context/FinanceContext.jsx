import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);

    const fetchData = async () => {
        try {
            const [transRes, catRes, budRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/categories'),
                api.get('/budgets'),
            ]);
            setTransactions(transRes.data);
            setCategories(catRes.data);
            setBudgets(budRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const addTransaction = async (data) => {
        const res = await api.post('/transactions', data);
        setTransactions([res.data, ...transactions]);
    };

    const deleteTransaction = async (id) => {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter((t) => t._id !== id));
    };

    const addCategory = async (data) => {
        const res = await api.post('/categories', data);
        setCategories([...categories, res.data]);
    };

    const deleteCategory = async (id) => {
        await api.delete(`/categories/${id}`);
        await fetchData(); // Refetch everything to sync cascading changes
    };

    const updateCategory = async (id, data) => {
        await api.put(`/categories/${id}`, data);
        await fetchData(); // Refetch everything to sync cascading changes
    };

    const addBudget = async (data) => {
        const res = await api.post('/budgets', data);
        setBudgets([...budgets, res.data]);
    };

    const updateBudget = async (id, data) => {
        const res = await api.put(`/budgets/${id}`, data);
        setBudgets(budgets.map((b) => (b._id === id ? res.data : b)));
    };

    const deleteBudget = async (id) => {
        await api.delete(`/budgets/${id}`);
        setBudgets(budgets.filter((b) => b._id !== id));
    };

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                categories,
                budgets,
                addTransaction,
                deleteTransaction,
                addCategory,
                deleteCategory,
                updateCategory,
                addBudget,
                updateBudget,
                deleteBudget,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};
