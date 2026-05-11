import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Tags, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <PieChart color="#4F46E5" />
                <span>Finance Tracker</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Receipt size={20} />
                    <span>Transactions</span>
                </NavLink>
                <NavLink to="/budgets" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <PieChart size={20} />
                    <span>Budgets</span>
                </NavLink>
                <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Tags size={20} />
                    <span>Categories</span>
                </NavLink>
            </nav>
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar">{user?.name?.charAt(0)}</div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>
                </div>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
