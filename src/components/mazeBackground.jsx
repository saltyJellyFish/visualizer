// Enhanced MazeBackground with Focus Mode Toggle Button
import React, { useRef, useEffect, useState } from 'react';

const MazeBackground = () => {
  const canvasRef = useRef(null);
  const particlesArrayRef = useRef([]);
  const mousePositionRef = useRef({ x: undefined, y: undefined });
  const animationFrameIdRef = useRef(null);

  const [focusMode, setFocusMode] = useState(false);

  class Particle {
    constructor(x, y, context, canvasWidth, canvasHeight) {
      this.x = x;
      this.y = y;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.size = Math.random() * 3 + 3.1;
      this.context = context;

      this.defaultColor = 'rgba(249, 20, 86, 0.25)';
      this.lineColorDefault = 'rgba(249, 20, 86, 0.3)';
      this.activeColor = 'rgba(179, 218, 235, 0.65)';
      this.lineColorActive = 'rgba(143, 201, 162, 0.3)';

      this.isActive = false;
      this.activationTime = 0;

      this.pulseFactor = 0.8 + Math.random() * 0.4;
      this.pulseSpeed = Math.random() * 0.006 + 0.002;
      this.pulseDirection = Math.random() < 0.5 ? 1 : -1;

      this.targetX = x + (Math.random() - 0.5) * 500;
      this.targetY = y + (Math.random() - 0.5) * 500;
    }

    draw() {
      if (this.pulseFactor > 1.1 || this.pulseFactor < 0.95) this.pulseDirection *= -1;
      this.pulseFactor += this.pulseSpeed * this.pulseDirection * (focusMode ? 0.1 : 0.4);

      const currentSize = this.size * this.pulseFactor;
      this.context.beginPath();
      this.context.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
      this.context.fillStyle = this.isActive ? this.activeColor : this.defaultColor;
      this.context.globalAlpha = focusMode ? 0.2 : 0.7;
      this.context.fill();
    }

    update(mousePos) {
      if (this.isActive && (Date.now() - this.activationTime > 8000)) {
        this.isActive = false;
      }

      if (mousePos.x !== undefined && mousePos.y !== undefined) {
        const dxMouse = mousePos.x - this.x;
        const dyMouse = mousePos.y - this.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 60) {
          this.isActive = true;
          this.activationTime = Date.now();
        }
      }

      const distToTargetX = this.targetX - this.x;
      const distToTargetY = this.targetY - this.y;
      this.x += distToTargetX * 0.0025 * (focusMode ? 0.25 : 1);
      this.y += distToTargetY * 0.0025 * (focusMode ? 0.25 : 1);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numParticles = Math.floor((canvas.width * canvas.height) / 5000);
      particlesArrayRef.current = Array.from({ length: numParticles }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return new Particle(x, y, context, canvas.width, canvas.height);
      });
    };

    const handleMouseMove = e => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesArrayRef.current;
      const connectDist = canvas.width > 768 ? 105 : 70;

      particles.forEach(p => p.update(mousePositionRef.current));

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const opacityBase = 1 - dist / connectDist;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.strokeStyle = p2.isActive ? p1.lineColorActive : p1.lineColorDefault;
            context.lineWidth = p1.isActive ? 3.5 : 1.5;
            context.globalAlpha = p1.isActive ? opacityBase * 1 : opacityBase * 0.9; 
            context.stroke();
          }
        }
      }

      context.globalAlpha = 1.0;
      particles.forEach(p => p.draw());
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [focusMode]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <button
        onClick={() => setFocusMode(m => !m)}
        className={`absolute top-6 right-6 z-10 transition-all duration-300 border-2 ${focusMode ? 'bg-red-500 bg-opacity-65 w-6 h-6 top-9 right-9 border-transparent' : 'bg-transparent w-12 h-12 border-seaGreen border-opacity-40'} border-8 rounded-full backdrop-opacity-90 shadow-md`}
        title="Toggle Focus Mode"
      />
    </>
  );
};
export default MazeBackground;
