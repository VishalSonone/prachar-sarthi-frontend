import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { karyakartaService, birthdayService } from '../services/api';
import { Users, Cake, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ total: 0, today: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [kReponse, bResponse] = await Promise.all([
                    karyakartaService.getAll(),
                    birthdayService.getTodays()
                ]);
                setStats({
                    total: kReponse.data.length,
                    today: bResponse.data.length
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t('welcome')}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your karyakartas and celebrate their birthdays.</p>
            </header>

            <div className="grid">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#dbeafe', color: 'var(--primary)', borderRadius: '50%' }}>
                            <Users size={32} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.total}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{t('totalKaryakartas')}</div>
                    <Link to="/karyakartas" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>
                        View All
                    </Link>
                </div>

                <div className="stat-card" style={{ border: stats.today > 0 ? '2px solid var(--accent)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#fef3c7', color: 'var(--accent)', borderRadius: '50%' }}>
                            <Cake size={32} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.today}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{t('todaysBirthdays')}</div>
                    <Link to="/birthdays" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', background: 'var(--accent)' }}>
                        {t('loadBirthdays')}
                    </Link>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#dcfce7', color: 'var(--success)', borderRadius: '50%' }}>
                            <Calendar size={32} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{new Date().toLocaleDateString()}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Today's Date</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
