import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { birthdayService } from '../services/api';
import { Cake, Share2, Download, Image as ImageIcon, X } from 'lucide-react';

const TodaysBirthdays = () => {
    const { t, language } = useTranslation();
    const { user } = useAuth();
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKaryakarta, setSelectedKaryakarta] = useState(null);
    const canvasRef = useRef(null);

    const fetchBirthdays = async () => {
        setLoading(true);
        try {
            const response = await birthdayService.getTodays();
            setBirthdays(response.data);
        } catch (error) {
            console.error('Failed to fetch birthdays', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBirthdays();
    }, []);

    const generatePoster = (k) => {
        setSelectedKaryakarta(k);
        setTimeout(() => drawPoster(k), 100);
    };

    const drawPoster = (k) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(1, '#fde68a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

        // Text: Happy Birthday
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 40px Inter, serif';
        ctx.textAlign = 'center';
        ctx.fillText(t('happyBirthday'), canvas.width / 2, 100);

        // Name
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 50px Inter, serif';
        ctx.fillText(k.fullName, canvas.width / 2, 200);

        // Wishes
        ctx.fillStyle = '#475569';
        ctx.font = '24px Inter, serif';
        ctx.fillText(t('wishingSuccess'), canvas.width / 2, 280);

        // Politician Name
        ctx.fillStyle = '#2563eb';
        ctx.font = 'italic bold 30px Inter, serif';
        ctx.fillText(`– ${user?.adminName || 'Politician Name'}`, canvas.width / 2, 360);

        // Decoration (Dots)
        ctx.fillStyle = '#f59e0b';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(50 + i * 100, 450, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const handleSendWhatsApp = (k) => {
        const message = language === 'en'
            ? `Happy Birthday ${k.fullName} 🎉\nWishing you good health and success.\n– ${user?.adminName}`
            : `वाढदिवसाच्या हार्दिक शुभेच्छा ${k.fullName} 🎉\nआपण निरोगी व यशस्वी राहावे हीच शुभेच्छा.\n– ${user?.adminName}`;

        const url = `https://wa.me/${k.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const downloadPoster = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `Birthday_${selectedKaryakarta.fullName}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('todaysBirthdays')}</h1>
                <button onClick={fetchBirthdays} className="btn btn-primary">
                    Reload
                </button>
            </div>

            {birthdays.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Cake size={64} style={{ color: '#e2e8f0', marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No birthdays today!</p>
                </div>
            ) : (
                <div className="grid">
                    {birthdays.map((k) => (
                        <div key={k.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{k.fullName}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{k.phoneNumber}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{k.constituency}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => generatePoster(k)} className="btn btn-outline" style={{ flex: 1 }}>
                                    <ImageIcon size={18} />
                                    {t('generatePoster')}
                                </button>
                                <button onClick={() => handleSendWhatsApp(k)} className="btn btn-primary" style={{ flex: 1, background: '#22c55e' }}>
                                    <Share2 size={18} />
                                    {t('sendWhatsApp')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedKaryakarta && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '540px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Poster Preview</h2>
                            <button onClick={() => setSelectedKaryakarta(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={500}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={downloadPoster} className="btn btn-primary" style={{ flex: 1 }}>
                                <Download size={20} />
                                Download
                            </button>
                            <button onClick={() => handleSendWhatsApp(selectedKaryakarta)} className="btn btn-outline" style={{ flex: 1, borderColor: '#22c55e', color: '#22c55e' }}>
                                <Share2 size={20} />
                                Share on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodaysBirthdays;
