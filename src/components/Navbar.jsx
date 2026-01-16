import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { LogOut, LayoutDashboard, Users, Cake } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t, language, toggleLanguage } = useTranslation();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>PracharSarthi</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/" className={`btn ${isActive('/') ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem' }}>
                        <LayoutDashboard size={18} />
                        {t('dashboard')}
                    </Link>
                    <Link to="/karyakartas" className={`btn ${isActive('/karyakartas') ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem' }}>
                        <Users size={18} />
                        {t('karyakartas')}
                    </Link>
                    <Link to="/birthdays" className={`btn ${isActive('/birthdays') ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem' }}>
                        <Cake size={18} />
                        {t('todaysBirthdays')}
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="lang-toggle">
                    <button
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => language !== 'en' && toggleLanguage()}
                    >
                        EN
                    </button>
                    <button
                        className={`lang-btn ${language === 'mr' ? 'active' : ''}`}
                        onClick={() => language !== 'mr' && toggleLanguage()}
                    >
                        मराठी
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 500 }}>{user?.adminName}</span>
                    <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
