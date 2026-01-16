import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { karyakartaService } from '../services/api';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const KaryakartaManagement = () => {
    const { t } = useTranslation();
    const [karyakartas, setKaryakartas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        constituency: ''
    });

    const fetchKaryakartas = async () => {
        try {
            const response = await karyakartaService.getAll();
            setKaryakartas(response.data);
        } catch (error) {
            console.error('Failed to fetch karyakartas', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKaryakartas();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                fullName: item.fullName,
                phoneNumber: item.phoneNumber,
                dateOfBirth: item.dateOfBirth.split('T')[0],
                constituency: item.constituency
            });
        } else {
            setEditingItem(null);
            setFormData({
                fullName: '',
                phoneNumber: '',
                dateOfBirth: '',
                constituency: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await karyakartaService.update(editingItem.id, { ...editingItem, ...formData });
            } else {
                await karyakartaService.create(formData);
            }
            fetchKaryakartas();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save karyakarta', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this karyakarta?')) {
            try {
                await karyakartaService.delete(id);
                fetchKaryakartas();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('karyakartas')}</h1>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <Plus size={20} />
                    {t('addKaryakarta')}
                </button>
            </div>

            <div className="card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>{t('fullName')}</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>{t('phoneNumber')}</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>{t('dob')}</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>{t('constituency')}</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {karyakartas.map((k) => (
                            <tr key={k.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>{k.fullName}</td>
                                <td style={{ padding: '1rem' }}>{k.phoneNumber}</td>
                                <td style={{ padding: '1rem' }}>{new Date(k.dateOfBirth).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>{k.constituency}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleOpenModal(k)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)', borderColor: 'var(--primary)', marginRight: '0.5rem' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(k.id)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>{editingItem ? t('editKaryakarta') : t('addKaryakarta')}</h2>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>{t('fullName')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('phoneNumber')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('dob')}</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('constituency')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.constituency}
                                    onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={handleCloseModal} className="btn btn-outline" style={{ flex: 1 }}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    <Check size={20} />
                                    {t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KaryakartaManagement;
