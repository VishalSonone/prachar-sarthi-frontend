import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('1234567890');
    const [password, setPassword] = useState('Password123');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t, language, toggleLanguage } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(phoneNumber, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem' }}>PracharSarthi</h1>
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
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('phoneNumber')}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="1234567890"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <LogIn size={20} />
                        {t('login')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
