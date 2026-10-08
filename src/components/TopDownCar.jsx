'use client'

import React from 'react'

/**
 * TopDownCar renders a high-octane 2D top-down racing machine inspired by Nitro Type.
 * Features:
 * - Dynamic aerodynamic chassis with cockpit glass, headlight projectors, spoiler & alloy wheels
 * - Distinct liveries: Muscle twin stripes, Hypercar aero accents, #1 Roundel GT, Exotic racer, Stealth carbon
 * - Dual rear/side rocket thrusters with active nitro exhaust flames that dynamically scale with WPM
 * - Electric lightning arcs at high speed (70+ WPM)
 * - Projected headlight light cones casting onto the track
 * - Engine vibration / rumble animation driven by speed
 */
export default function TopDownCar({
  car = {},
  wpm = 0,
  isTyping = false,
  isFinished = false,
  isYou = false,
  scale = 1,
}) {
  const carId = car.id || 'cyber-neon'
  const primaryColor = car.color || '#00f2fe'
  const accentColor = car.accentColor || '#4facfe'
  const glowColor = car.glow || 'rgba(0, 242, 254, 0.7)'

  // Determine Nitro Intensity based on WPM
  // 0: idle, 1-35: cruise, 36-69: fast, 70+: SUPER NITRO
  const isSuperNitro = wpm >= 70 || (isFinished && wpm > 45)
  const isFastNitro = wpm >= 38
  const isCruise = wpm > 10 || isTyping
  const hasFlames = isCruise || isFinished

  // Calculate flame length scale based on WPM (clamped between 0.6 and 1.8)
  const flameScale = Math.min(1.8, Math.max(0.5, wpm / 55))

  return (
    <div
      className={`top-down-car-container ${isSuperNitro ? 'super-nitro' : ''} ${
        isFastNitro ? 'fast-nitro' : ''
      } ${isTyping ? 'car-typing' : ''}`}
      style={{
        transform: `scale(${scale})`,
        '--car-primary': primaryColor,
        '--car-accent': accentColor,
        '--car-glow': glowColor,
      }}
    >
      {/* 1. PROJECTED HEADLIGHT BEAMS (Forward onto the asphalt) */}
      <div className="car-headlight-beams">
        <div className="light-cone cone-top"></div>
        <div className="light-cone cone-bottom"></div>
      </div>

      {/* 2. DUAL EXHAUST NITRO JETS (Firing backwards from the rear thrusters) */}
      {hasFlames && (
        <div
          className="car-exhaust-flames"
          style={{
            transform: `scaleX(${flameScale})`,
          }}
        >
          {/* Top Jet Flame */}
          <div className="flame-plume plume-top">
            <div className="flame-core"></div>
            <div className="flame-outer"></div>
            <div className="flame-sparks"></div>
          </div>

          {/* Bottom Jet Flame */}
          <div className="flame-plume plume-bottom">
            <div className="flame-core"></div>
            <div className="flame-outer"></div>
            <div className="flame-sparks"></div>
          </div>

          {/* Electric Lightning Arcs at 70+ WPM (Super Nitro) */}
          {isSuperNitro && (
            <div className="electric-lightning-wrapper">
              <svg className="lightning-svg" viewBox="0 0 80 40">
                <path
                  className="lightning-bolt bolt-1"
                  d="M10,20 L25,12 L35,26 L55,16 L70,22"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="2"
                />
                <path
                  className="lightning-bolt bolt-2"
                  d="M8,22 L20,30 L38,18 L50,32 L68,18"
                  fill="none"
                  stroke="#ffe600"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 3. TIRE SKID PARTICLES / SMOKE */}
      {isFastNitro && (
        <div className="tire-smoke-emitter">
          <span className="smoke-puff puff-1"></span>
          <span className="smoke-puff puff-2"></span>
        </div>
      )}

      {/* 4. THE RACING VEHICLE SVG CHASSIS (Facing Right) */}
      <div className="car-svg-chassis">
        <svg
          viewBox="0 0 120 54"
          width="110"
          height="50"
          className="car-vector-graphics"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glossy Windshield Reflection Gradient */}
            <linearGradient id={`windshieldGrad-${carId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Car Body Metallic Gradient */}
            <linearGradient id={`bodyGrad-${carId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="25%" stopColor={primaryColor} />
              <stop offset="75%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>

            {/* Rocket Pod Metallic Cylinder Gradient */}
            <linearGradient id="rocketCanister" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Tire Tread Pattern */}
            <pattern id="tirePattern" width="3" height="4" patternUnits="userSpaceOnUse">
              <rect width="3" height="2" fill="#18181b" />
              <rect y="2" width="3" height="2" fill="#27272a" />
            </pattern>
          </defs>

          {/* VEHICLE SHADOW */}
          <ellipse cx="60" cy="27" rx="55" ry="24" fill="rgba(0,0,0,0.55)" filter="blur(3px)" />

          {/* DUAL ROCKET / NITRO BOOSTERS (Mounted on rear flank - left edge) */}
          {/* Top Rocket Pod */}
          <g className="rocket-pod top-pod">
            <rect x="8" y="5" width="34" height="8" rx="3.5" fill="url(#rocketCanister)" stroke="#1e293b" strokeWidth="0.8" />
            <rect x="5" y="6" width="4" height="6" rx="1.5" fill="#f59e0b" />
            <line x1="16" y1="5" x2="16" y2="13" stroke="#0f172a" strokeWidth="1" />
            <line x1="26" y1="5" x2="26" y2="13" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* Bottom Rocket Pod */}
          <g className="rocket-pod bottom-pod">
            <rect x="8" y="41" width="34" height="8" rx="3.5" fill="url(#rocketCanister)" stroke="#1e293b" strokeWidth="0.8" />
            <rect x="5" y="42" width="4" height="6" rx="1.5" fill="#f59e0b" />
            <line x1="16" y1="41" x2="16" y2="49" stroke="#0f172a" strokeWidth="1" />
            <line x1="26" y1="41" x2="26" y2="49" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* 4 HIGH PERFORMANCE WHEELS / TIRES */}
          {/* Front-Top Wheel */}
          <rect x="82" y="4" width="18" height="6" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="0.6" />
          <circle cx="91" cy="7" r="1.8" fill="#e2e8f0" />

          {/* Front-Bottom Wheel */}
          <rect x="82" y="44" width="18" height="6" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="0.6" />
          <circle cx="91" cy="47" r="1.8" fill="#e2e8f0" />

          {/* Rear-Top Wheel */}
          <rect x="24" y="4" width="19" height="7" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="0.6" />
          <circle cx="33.5" cy="7.5" r="2" fill="#e2e8f0" />

          {/* Rear-Bottom Wheel */}
          <rect x="24" y="43" width="19" height="7" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="0.6" />
          <circle cx="33.5" cy="46.5" r="2" fill="#e2e8f0" />

          {/* MAIN CHASSIS BODY */}
          {/* Aerodynamic Contour */}
          <path
            d="M 18,17 
               C 16,13 24,10 40,10 
               L 80,10 
               C 96,10 110,14 116,23 
               C 118,25 118,29 116,31 
               C 110,40 96,44 80,44 
               L 40,44 
               C 24,44 16,41 18,37 
               Z"
            fill={`url(#bodyGrad-${carId})`}
            stroke="#09090b"
            strokeWidth="1.2"
          />

          {/* CAR LIVERY / RACING STRIPES / DECALS BY MODEL */}
          {carId === 'amber-blaze' ? (
            /* Muscle Twin Black Racing Stripes */
            <g className="muscle-stripes">
              <rect x="22" y="21" width="88" height="3" fill="#18181b" />
              <rect x="22" y="30" width="88" height="3" fill="#18181b" />
            </g>
          ) : carId === 'violet-phantom' ? (
            /* Purple GT with #1 Roundel */
            <g className="gt-livery">
              <rect x="22" y="25" width="88" height="4" fill="#ffffff" opacity="0.9" />
              <circle cx="56" cy="27" r="7.5" fill="#ffffff" />
              <text x="56" y="30.5" fontSize="8" fontWeight="900" textAnchor="middle" fill="#0f172a">
                1
              </text>
            </g>
          ) : carId === 'cyber-neon' ? (
            /* Cyber Twin Cyan/Pink Electric Streaks */
            <g className="cyber-stripes">
              <path d="M 28,19 L 100,19" stroke="#f43f5e" strokeWidth="2.5" />
              <path d="M 28,35 L 100,35" stroke="#f43f5e" strokeWidth="2.5" />
              <path d="M 36,27 L 94,27" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6,3" />
            </g>
          ) : carId === 'solar-flare' ? (
            /* Flame Aero Stripes */
            <g className="solar-stripes">
              <polygon points="26,27 106,23 106,31" fill="#facc15" opacity="0.85" />
            </g>
          ) : (
            /* Dual Sport Racing Stripes */
            <g className="default-stripes">
              <rect x="22" y="24" width="86" height="2" fill="#ffffff" opacity="0.8" />
              <rect x="22" y="28" width="86" height="2" fill="#ffffff" opacity="0.8" />
            </g>
          )}

          {/* REAR WINDOW / LOUVERS */}
          <polygon
            points="34,17 46,18 46,36 34,37"
            fill="#09090b"
            opacity="0.85"
            rx="1"
          />

          {/* ROOF CABIN */}
          <rect x="46" y="16" width="22" height="22" rx="3" fill="rgba(0,0,0,0.2)" stroke="#09090b" strokeWidth="0.8" />

          {/* FRONT CURVED WINDSHIELD */}
          <path
            d="M 68,17 
               C 74,18 78,21 82,27 
               C 78,33 74,36 68,37 
               Z"
            fill={`url(#windshieldGrad-${carId})`}
            stroke="#09090b"
            strokeWidth="0.9"
          />

          {/* HOOD HEAT EXTRACTORS / SCOOPS */}
          <rect x="90" y="21" width="10" height="2.2" rx="1" fill="#09090b" opacity="0.75" />
          <rect x="90" y="30.8" width="10" height="2.2" rx="1" fill="#09090b" opacity="0.75" />

          {/* HEADLIGHT PROJECTORS */}
          <ellipse cx="108" cy="17" rx="3.5" ry="2.2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
          <ellipse cx="108" cy="37" rx="3.5" ry="2.2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
          <circle cx="109" cy="17" r="1.2" fill="#ffffff" />
          <circle cx="109" cy="37" r="1.2" fill="#ffffff" />

          {/* REAR GT SPOILER WING */}
          <rect x="14" y="11" width="5" height="32" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
          {/* Spoiler Mount Struts */}
          <line x1="19" y1="18" x2="25" y2="18" stroke="#18181b" strokeWidth="1.5" />
          <line x1="19" y1="36" x2="25" y2="36" stroke="#18181b" strokeWidth="1.5" />

          {/* SIDE MIRRORS */}
          <ellipse cx="71" cy="13" rx="2.5" ry="1.5" fill="#09090b" />
          <ellipse cx="71" cy="41" rx="2.5" ry="1.5" fill="#09090b" />
        </svg>
      </div>

      {/* 5. DYNAMIC SPEED OVERHEAD BADGE */}
      {wpm > 0 && (
        <div className="car-speed-floating-tag" style={{ color: primaryColor }}>
          <span className="speed-num">{wpm}</span>
          <span className="speed-unit">WPM</span>
        </div>
      )}
    </div>
  )
}
