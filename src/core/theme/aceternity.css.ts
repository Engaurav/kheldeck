// Aceternity UI & AnimMaster Keyframe CSS Rules
// Injected into React Native Web DOM for modern animations

export const aceternityKeyframes = `
@keyframes aurora {
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  50% {
    background-position: 100% 50%, 0% 50%;
  }
  100% {
    background-position: 50% 50%, 50% 50%;
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}

@keyframes border-beam {
  0% {
    border-color: rgba(56, 189, 248, 0.4);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
  }
  50% {
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
  }
  100% {
    border-color: rgba(56, 189, 248, 0.4);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
  }
}

.bento-card-hover {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.bento-card-hover:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.25) !important;
  border-color: rgba(56, 189, 248, 0.5) !important;
}

.shimmer-btn {
  background: linear-gradient(110deg, #6366F1 0%, #38BDF8 50%, #6366F1 100%) !important;
  background-size: 200% 100% !important;
  animation: shimmer 3s infinite linear !important;
  transition: all 0.2s ease !important;
}

.shimmer-btn:hover {
  transform: scale(1.02) !important;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.5) !important;
}

.floating-dock-glow {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.25) !important;
}
`;
