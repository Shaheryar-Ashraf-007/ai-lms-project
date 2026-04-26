import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [count, setCount] = useState(5);
  const [particles, setParticles] = useState([]);

  // Generate confetti particles once
  useEffect(() => {
    const colors = ["#7c5fe6", "#b06aff", "#f59e0b", "#10b981", "#f43f5e", "#38bdf8"];
    const shapes = ["circle", "square", "triangle"];
    const generated = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 2.5 + Math.random() * 2,
      size: 6 + Math.random() * 10,
      rotate: Math.random() * 720,
    }));
    setParticles(generated);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="ps-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ps-root {
          min-height: 100vh;
          background: #0a0618;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient background orbs ── */
        .ps-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .ps-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,95,230,0.22) 0%, transparent 70%);
          top: -120px; left: -100px;
          animation: orbFloat1 8s ease-in-out infinite;
        }
        .ps-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(176,106,255,0.18) 0%, transparent 70%);
          bottom: -80px; right: -60px;
          animation: orbFloat2 10s ease-in-out infinite;
        }
        .ps-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: orbFloat3 6s ease-in-out infinite;
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 40px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -30px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }

        /* ── Grid texture ── */
        .ps-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(124,95,230,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,95,230,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* ── Confetti particles ── */
        .ps-confetti-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .ps-particle {
          position: absolute;
          top: -20px;
          opacity: 0;
          animation: confettiFall var(--dur) var(--delay) ease-in forwards;
        }
        .ps-particle.circle { border-radius: 50%; }
        .ps-particle.square { border-radius: 2px; }
        .ps-particle.triangle {
          width: 0 !important; height: 0 !important;
          background: transparent !important;
          border-left: calc(var(--sz) / 2 * 1px) solid transparent;
          border-right: calc(var(--sz) / 2 * 1px) solid transparent;
          border-bottom: calc(var(--sz) * 1px) solid var(--color);
        }
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(var(--rot)); }
        }

        /* ── Main card ── */
        .ps-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 540px;
          margin: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 32px;
          padding: 56px 48px 48px;
          text-align: center;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(124,95,230,0.15),
            0 40px 100px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.08);
          animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Check icon ── */
        .ps-icon-wrap {
          position: relative;
          width: 100px; height: 100px;
          margin: 0 auto 32px;
          animation: iconIn 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes iconIn {
          from { opacity: 0; transform: scale(0.4) rotate(-20deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .ps-icon-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(16,185,129,0.3);
          animation: ringPulse 2s ease-in-out infinite;
        }
        .ps-icon-ring-2 {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1.5px solid rgba(16,185,129,0.15);
          animation: ringPulse 2s 0.4s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }
        .ps-icon-circle {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10b981, #34d399);
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            0 0 40px rgba(16,185,129,0.5),
            0 0 80px rgba(16,185,129,0.2);
        }
        .ps-check {
          width: 46px; height: 46px;
          stroke: #fff;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawCheck 0.5s 0.5s ease forwards;
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        /* ── Text content ── */
        .ps-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 10px;
          animation: fadeUp 0.5s 0.35s ease both;
        }
        .ps-title {
          font-family: 'Fraunces', serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 14px;
          animation: fadeUp 0.5s 0.45s ease both;
        }
        .ps-title em {
          font-style: italic;
          background: linear-gradient(135deg, #7c5fe6, #b06aff, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 380px;
          margin: 0 auto 32px;
          animation: fadeUp 0.5s 0.55s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Info pills row ── */
        .ps-pills {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 36px;
          animation: fadeUp 0.5s 0.65s ease both;
        }
        .ps-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          backdrop-filter: blur(8px);
        }
        .ps-pill-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── Divider ── */
        .ps-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin-bottom: 32px;
          animation: fadeUp 0.5s 0.7s ease both;
        }

        /* ── User greeting ── */
        .ps-greeting {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 28px;
          animation: fadeUp 0.5s 0.75s ease both;
        }
        .ps-greeting strong {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        /* ── CTA buttons ── */
        .ps-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeUp 0.5s 0.8s ease both;
        }
        .ps-btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4f3cdb, #7c5fe6, #b06aff);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 32px rgba(79,60,219,0.4);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .ps-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(79,60,219,0.55);
        }
        .ps-btn-secondary {
          width: 100%;
          padding: 14px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .ps-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        /* ── Countdown ring ── */
        .ps-countdown {
          margin-top: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          animation: fadeUp 0.5s 0.9s ease both;
        }
        .ps-countdown-num {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 700;
          color: #7c5fe6;
          min-width: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        /* ── Top shimmer bar ── */
        .ps-shimmer-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1a1040, #4f3cdb, #10b981, #b06aff, #1a1040);
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite;
          z-index: 100;
        }
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 300% 0; }
        }

        @media (max-width: 600px) {
          .ps-card { padding: 40px 28px 36px; }
          .ps-title { font-size: 34px; }
        }
      `}</style>

      <div className="ps-shimmer-bar" />

      {/* Background layers */}
      <div className="ps-grid" />
      <div className="ps-orb ps-orb-1" />
      <div className="ps-orb ps-orb-2" />
      <div className="ps-orb ps-orb-3" />

      {/* Confetti */}
      <div className="ps-confetti-wrap">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`ps-particle ${p.shape}`}
            style={{
              left: `${p.left}%`,
              width: p.shape !== "triangle" ? p.size : undefined,
              height: p.shape !== "triangle" ? p.size : undefined,
              backgroundColor: p.shape !== "triangle" ? p.color : undefined,
              "--color": p.color,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--rot": `${p.rotate}deg`,
              "--sz": p.size,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="ps-card">
        {/* Check icon */}
        <div className="ps-icon-wrap">
          <div className="ps-icon-ring" />
          <div className="ps-icon-ring-2" />
          <div className="ps-icon-circle">
            <svg className="ps-check" viewBox="0 0 46 46">
              <polyline points="8,24 19,35 38,14" />
            </svg>
          </div>
        </div>

        <p className="ps-eyebrow">Payment Confirmed</p>
        <h1 className="ps-title">
          You're <em>enrolled!</em>
        </h1>
        <p className="ps-subtitle">
          Your payment was processed successfully. Your course access has been activated and is ready to go.
        </p>

        {/* Info pills */}
        <div className="ps-pills">
          <div className="ps-pill">
            <div className="ps-pill-dot" style={{ background: "#10b981" }} />
            Instant Access
          </div>
          <div className="ps-pill">
            <div className="ps-pill-dot" style={{ background: "#7c5fe6" }} />
            Lifetime Validity
          </div>
          <div className="ps-pill">
            <div className="ps-pill-dot" style={{ background: "#f59e0b" }} />
            Certificate Included
          </div>
        </div>

        <div className="ps-divider" />

        {userData?.name && (
          <p className="ps-greeting">
            Welcome aboard, <strong>{userData.name}</strong> 🎉
          </p>
        )}

        {/* CTA buttons */}
        <div className="ps-actions">
          <button
            className="ps-btn-primary"
            onClick={() => navigate("/")}
          >
            🎓 &nbsp;Start Learning Now
          </button>
          <button
            className="ps-btn-secondary"
            onClick={() => navigate("/profile")}
          >
            View My Courses →
          </button>
        </div>

        {/* Auto-redirect countdown */}
        <div className="ps-countdown">
          Redirecting to home in
          <span className="ps-countdown-num">{count}</span>
          seconds
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

















