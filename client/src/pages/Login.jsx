import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

const COLORS = {
  void: "#08060A",
  deep: "#0E0B12",
  surface: "#141019",
  card: "rgba(26, 21, 32, 0.45)",
  rim: "rgba(255, 255, 255, 0.08)",
  rimActive: "rgba(255, 107, 44, 0.4)",
  brand: "#FF6B2C",
  brandGlow: "rgba(255, 107, 44, 0.15)",
  white: "#FFFFFF",
  cream: "#FFF3E0",
  muted: "#8A7FA0",
  faint: "#4A4258",
  error: "#EF4444",
  success: "#2DD87A",
};

const GLOW_ORBS = [
  { id: 1, color: "rgba(255, 107, 44, 0.12)", size: 450, x: "15%", y: "15%", duration: 25 },
  { id: 2, color: "rgba(180, 127, 255, 0.08)", size: 380, x: "80%", y: "75%", duration: 20 },
  { id: 3, color: "rgba(255, 209, 102, 0.06)", size: 300, x: "50%", y: "45%", duration: 30 },
];

const FLOATING_FOOD = [
  { id: 1, emoji: "🍔", size: 44, x: "8%", y: "18%", duration: 15, delay: 0 },
  { id: 2, emoji: "🍕", size: 36, x: "88%", y: "12%", duration: 18, delay: 1 },
  { id: 3, emoji: "🍛", size: 42, x: "78%", y: "78%", duration: 16, delay: 2 },
  { id: 4, emoji: "🥗", size: 34, x: "12%", y: "82%", duration: 20, delay: 0.5 },
  { id: 5, emoji: "🍰", size: 38, x: "92%", y: "48%", duration: 14, delay: 3 },
  { id: 6, emoji: "🍣", size: 36, x: "6%", y: "52%", duration: 22, delay: 1.5 },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // 3D Card Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), { stiffness: 150, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = (e.clientX - rect.left - width / 2) / (width / 2);
    const yVal = (e.clientY - rect.top - height / 2) / (height / 2);
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const validate = () => {
    const tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Invalid email format";
    }
    
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      }, 1500);
    } else {
      setShake(true);
      // Reset shake after animation completes
      setTimeout(() => setShake(false), 500);
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div style={{
      background: COLORS.void,
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    }}>
      
      {/* Background Glow Orbs */}
      {GLOW_ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            top: orb.y,
            left: orb.x,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            borderRadius: "50%",
            filter: "blur(100px)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Floating 3D Emojis */}
      {FLOATING_FOOD.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: 0 }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: item.y,
            left: item.x,
            fontSize: item.size,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
            filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4))",
            opacity: 0.65,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Main Glass Card container */}
      <div style={{
        perspective: 1200,
        zIndex: 2,
        width: "100%",
        maxWidth: 440,
      }}>
        <motion.div
          animate={shake ? "shake" : ""}
          variants={shakeAnimation}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            background: COLORS.card,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${COLORS.rim}`,
            borderRadius: 24,
            padding: "40px 32px",
            boxShadow: `
              0 30px 60px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 50px rgba(255, 107, 44, 0.03)
            `,
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Inner elements with Depth */}
          
          {/* Logo & Header */}
          <div style={{
            textAlign: "center",
            marginBottom: 32,
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}>
            <Link to="/" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              marginBottom: 16,
              transform: "translateZ(10px)",
            }}>
              <div style={{
                width: 36, height: 36,
                background: COLORS.brand,
                borderRadius: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 8px 16px ${COLORS.brand}33`
              }}>🍽️</div>
              <span style={{
                color: COLORS.white, fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em",
                fontFamily: "'Syne', sans-serif"
              }}>
                FoodLens<span style={{ color: COLORS.brand }}>AI</span>
              </span>
            </Link>

            <h1 style={{
              color: COLORS.cream,
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}>Welcome Back</h1>
            <p style={{
              color: COLORS.muted,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.5,
            }}>AI food discovery is just a login away.</p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  transform: "translateZ(30px)",
                }}
              >
                <div style={{
                  width: 64, height: 64,
                  borderRadius: "50%",
                  background: `${COLORS.success}20`,
                  border: `2px solid ${COLORS.success}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 20px",
                }}>✓</div>
                <h3 style={{ color: COLORS.cream, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Success!</h3>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>Redirecting to FoodLensAI...</p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                style={{
                  transform: "translateZ(40px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Email Field */}
                <div style={{ marginBottom: 20, transformStyle: "preserve-3d" }}>
                  <label htmlFor="login-email" style={{
                    display: "block",
                    color: COLORS.cream,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 8,
                    opacity: 0.85,
                  }}>Email Address</label>
                  <div style={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}>
                    <span style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: focusedField === "email" ? COLORS.brand : COLORS.muted,
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        padding: "13px 16px 13px 44px",
                        background: focusedField === "email" ? "rgba(14, 11, 18, 0.8)" : "rgba(14, 11, 18, 0.4)",
                        border: `1.5px solid ${errors.email ? COLORS.error : (focusedField === "email" ? COLORS.brand : COLORS.rim)}`,
                        borderRadius: 14,
                        color: COLORS.white,
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "inherit",
                        boxShadow: focusedField === "email" ? `0 0 15px ${COLORS.brand}18` : "none",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "login-email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      id="login-email-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: COLORS.error, fontSize: 12, marginTop: 6, fontWeight: 500 }}
                    >{errors.email}</motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: 20, transformStyle: "preserve-3d" }}>
                  <label htmlFor="login-password" style={{
                    display: "block",
                    color: COLORS.cream,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 8,
                    opacity: 0.85,
                  }}>Password</label>
                  <div style={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}>
                    <span style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: focusedField === "password" ? COLORS.brand : COLORS.muted,
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "13px 44px 13px 44px",
                        background: focusedField === "password" ? "rgba(14, 11, 18, 0.8)" : "rgba(14, 11, 18, 0.4)",
                        border: `1.5px solid ${errors.password ? COLORS.error : (focusedField === "password" ? COLORS.brand : COLORS.rim)}`,
                        borderRadius: 14,
                        color: COLORS.white,
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "inherit",
                        boxShadow: focusedField === "password" ? `0 0 15px ${COLORS.brand}18` : "none",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: COLORS.muted,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      id="login-password-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: COLORS.error, fontSize: 12, marginTop: 6, fontWeight: 500 }}
                    >{errors.password}</motion.p>
                  )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 26,
                  fontSize: 13,
                }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: COLORS.muted,
                    cursor: "pointer",
                    userSelect: "none",
                  }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        accentColor: COLORS.brand,
                        cursor: "pointer",
                        width: 15,
                        height: 15,
                        borderRadius: 4,
                      }}
                    />
                    Remember Me
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset workflow placeholder clicked!"); }} style={{
                    color: COLORS.brand,
                    textDecoration: "none",
                    fontWeight: 600,
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.8}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >Forgot Password?</a>
                </div>

                {/* Login Button with Depth */}
                <div style={{
                  transform: "translateZ(60px)",
                  marginBottom: 28,
                }}>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 28px ${COLORS.brand}40` }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: COLORS.brand,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: `0 8px 20px ${COLORS.brand}22`,
                      transition: "background-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: 18, height: 18,
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: COLORS.white,
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }} />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <span>Login to Account</span>
                    )}
                  </motion.button>
                </div>

                {/* Divider */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}>
                  <div style={{ flex: 1, height: 1, background: COLORS.rim }} />
                  <span style={{ color: COLORS.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>or continue with</span>
                  <div style={{ flex: 1, height: 1, background: COLORS.rim }} />
                </div>

                {/* Social Login Buttons */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginBottom: 28,
                }}>
                  {[
                    {
                      name: "Google",
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                      )
                    },
                    {
                      name: "Apple",
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.029-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.067 1.007 1.452 2.2 3.076 3.774 3.017 1.52-.058 2.09-.979 3.93-.979 1.829 0 2.348.979 3.93.948 1.614-.029 2.637-1.47 3.621-2.9 1.144-1.664 1.614-3.266 1.644-3.355-.03-.015-3.149-1.2-3.18-4.757-.03-2.969 2.445-4.394 2.565-4.469-1.393-2.04-3.53-2.28-4.29-2.34-1.921-.164-3.083.887-3.96.887zm1.6-4.887c.857-1.037 1.436-2.009 1.282-3.009-.857.037-1.897.575-2.513 1.294-.523.593-.98 1.583-.827 2.562.96.074 1.93-.45 2.458-.847z"/>
                        </svg>
                      )
                    },
                    {
                      name: "GitHub",
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                      )
                    }
                  ].map((p) => (
                    <motion.button
                      key={p.name}
                      type="button"
                      whileHover={{ scale: 1.04, background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.2)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => alert(`Login with ${p.name} placeholder clicked!`)}
                      style={{
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${COLORS.rim}`,
                        borderRadius: 12,
                        color: COLORS.white,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      aria-label={`Log in with ${p.name}`}
                    >
                      {p.icon}
                    </motion.button>
                  ))}
                </div>

                {/* Card Footer Link */}
                <div style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: COLORS.muted,
                  fontWeight: 500,
                }}>
                  Don't have an account?{" "}
                  <Link to="/signup" style={{
                    color: COLORS.brand,
                    textDecoration: "none",
                    fontWeight: 700,
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.8}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >Sign Up</Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Embedded Spin Keyframes style */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
