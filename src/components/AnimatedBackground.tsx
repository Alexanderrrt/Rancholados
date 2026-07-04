"use client";

const emojis = ["🍓", "🥭", "🍦", "🍧", "🥥", "🫐", "🍌"];
const COUNT = 25;

function seededRandom() {
  let s = 42;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildItems() {
  const rand = seededRandom();
  const items = [];
  for (let i = 0; i < COUNT; i++) {
    const size = Math.round(16 + rand() * 16);
    const opacity = +(0.15 + rand() * 0.1).toFixed(2);
    const left = Math.round(rand() * 95);
    const top = 100 + Math.round(rand() * 20);
    const duration = Math.round(15 + rand() * 25);
    const delay = -Math.round(rand() * duration);
    const animIndex = i % 5;
    items.push({ emoji: emojis[i % emojis.length], size, opacity, left, top, duration, delay, animIndex });
  }
  return items;
}

const items = buildItems();

export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes ab-float-0 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30px, -25vh) rotate(90deg); } 50% { transform: translate(-20px, -50vh) rotate(180deg); } 75% { transform: translate(40px, -75vh) rotate(270deg); } 100% { transform: translate(0, -110vh) rotate(360deg); } }
        @keyframes ab-float-1 { 0% { transform: translate(0, 0) rotate(0deg); } 20% { transform: translate(-40px, -20vh) rotate(72deg); } 40% { transform: translate(25px, -40vh) rotate(144deg); } 60% { transform: translate(-15px, -60vh) rotate(216deg); } 80% { transform: translate(35px, -80vh) rotate(288deg); } 100% { transform: translate(0, -110vh) rotate(360deg); } }
        @keyframes ab-float-2 { 0% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(50px, -33vh) rotate(120deg); } 66% { transform: translate(-30px, -66vh) rotate(240deg); } 100% { transform: translate(10px, -110vh) rotate(360deg); } }
        @keyframes ab-float-3 { 0% { transform: translate(0, 0) rotate(0deg); } 30% { transform: translate(-25px, -30vh) rotate(108deg); } 60% { transform: translate(45px, -60vh) rotate(216deg); } 100% { transform: translate(-10px, -110vh) rotate(360deg); } }
        @keyframes ab-float-4 { 0% { transform: translate(0, 0) rotate(0deg); } 15% { transform: translate(35px, -15vh) rotate(54deg); } 45% { transform: translate(-45px, -45vh) rotate(162deg); } 70% { transform: translate(20px, -70vh) rotate(252deg); } 100% { transform: translate(-5px, -110vh) rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .ab-item { animation-play-state: paused !important; }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="ab-item"
            style={{
              position: "absolute",
              left: `${item.left}%`,
              top: `${item.top}%`,
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              animation: `ab-float-${item.animIndex} ${item.duration}s ${item.delay}s linear infinite`,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
