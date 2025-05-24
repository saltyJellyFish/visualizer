/*mazeBackground.jsx */
import React, { useRef, useEffect } from 'react';

const PARTICLE_DENSITY_FACTOR = 9000; // higher for fewer particles 
const MOUSE_ACTIVATION_RADIUS = 60;
const PARTICLE_ACTIVE_LIFESPAN_MS = 4000;
const CONNECTION_DISTANCE_LG = 110;
const CONNECTION_DISTANCE_SM = 70;
const RECONFIG_SPEED = 0.0025;
const RECONFIG_DRIFT_AMOUNT = 1000;
const RECONFIG_FAR_DRIFT_CHANCE = 0.9;
const RECONFIG_NEAR_DRIFT_CHANCE = 0.9;

class Particle {
    constructor(x, y, context, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = Math.random() * 3 + 3; 

        this.context = context;

        this.defaultColor = 'rgba(249, 20, 86, 0.35)'; //p
        this.lineColorDefault = 'rgba(249, 20, 86, 0.3)'; // p
        this.activeColor = 'rgba(61, 140, 200, 0.25)';   // b
        this.lineColorActive = 'rgba(61, 140, 200, 0.2)'; // b

        this.isActive = false;
        this.activationTime = 0;

        this.pulseFactor = 0.8 + Math.random() * 0.4;
        this.pulseSpeed = Math.random() * 0.006 + 0.002;
        this.pulseDirection = Math.random() < 0.5 ? 1 : -1;

        this.targetX = x + (Math.random() - 0.5) * RECONFIG_DRIFT_AMOUNT / 2;
        this.targetY = y + (Math.random() - 0.5) * RECONFIG_DRIFT_AMOUNT / 2;
    }

    draw() {
        if (this.pulseFactor > 1.15 || this.pulseFactor < 0.85) {
            this.pulseDirection *= -1;
        }
        this.pulseFactor += this.pulseSpeed * this.pulseDirection;
        const currentSize = this.size * this.pulseFactor;

        this.context.beginPath();
        this.context.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        this.context.fillStyle = this.isActive ? this.activeColor : this.defaultColor;
        this.context.fill();
    }

    update(mousePos) {
        if (this.isActive && (Date.now() - this.activationTime > PARTICLE_ACTIVE_LIFESPAN_MS)) {
            this.isActive = false;
        }

        if (mousePos.x !== undefined && mousePos.y !== undefined) {
            const dxMouse = mousePos.x - this.x;
            const dyMouse = mousePos.y - this.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse < MOUSE_ACTIVATION_RADIUS) {
                this.isActive = true;
                this.activationTime = Date.now();
            }
        }
        
        const distToTargetX = this.targetX - this.x;
        const distToTargetY = this.targetY - this.y;

        this.x += distToTargetX * RECONFIG_SPEED;
        this.y += distToTargetY * RECONFIG_SPEED;

        if (Math.abs(distToTargetX) < 1 && Math.abs(distToTargetY) < 1) {
            if (Math.random() < RECONFIG_FAR_DRIFT_CHANCE) {
                 this.targetX = Math.random() * this.canvasWidth;
                 this.targetY = Math.random() * this.canvasHeight;
            } else if (Math.random() < RECONFIG_NEAR_DRIFT_CHANCE) {
                this.targetX = this.x + (Math.random() - 0.5) * RECONFIG_DRIFT_AMOUNT;
                this.targetY = this.y + (Math.random() - 0.5) * RECONFIG_DRIFT_AMOUNT;
            }
            this.targetX = Math.max(this.size * 2, Math.min(this.targetX, this.canvasWidth - this.size * 2));
            this.targetY = Math.max(this.size * 2, Math.min(this.targetY, this.canvasHeight - this.size * 2));
        }

        if (this.x < this.size) this.x = this.size;
        if (this.x > this.canvasWidth - this.size) this.x = this.canvasWidth - this.size;
        if (this.y < this.size) this.y = this.size;
        if (this.y > this.canvasHeight - this.size) this.y = this.canvasHeight - this.size;
    }
}

const MazeBackground = () => {
    const canvasRef = useRef(null);
    const particlesArrayRef = useRef([]);
    const mousePositionRef = useRef({ x: undefined, y: undefined });
    const animationFrameIdRef = useRef(null);

    useEffect(() => {
        console.log("MazeBackground: useEffect triggered"); // DEBUG LOG
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("MazeBackground: Canvas element not found!"); 
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            console.error("MazeBackground: Canvas context not found!"); 
            return;
        }
        console.log("MazeBackground: Canvas and context obtained."); 

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log(`MazeBackground: Canvas resized to ${canvas.width}x${canvas.height}`); 
        };

        const initParticles = () => {
            particlesArrayRef.current = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / PARTICLE_DENSITY_FACTOR);
            console.log(`MazeBackground: Initializing ${numberOfParticles} particles.`); 
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particlesArrayRef.current.push(new Particle(x, y, context, canvas.width, canvas.height));
            }
        };

        const handleMouseMove = (event) => {
            mousePositionRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleResize = () => {
            setupCanvas();
            initParticles();
        };

        setupCanvas();
        initParticles();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        let frameCount = 0; // DEBUG
        const animate = () => {
            if (frameCount < 5) { // Log only for the first few frames
                 console.log("MazeBackground: animate() called, frame: " + frameCount);
            }
            frameCount++;

            context.clearRect(0, 0, canvas.width, canvas.height);

            const currentParticles = particlesArrayRef.current;
            const connectDistance = canvas.width > 768 ? CONNECTION_DISTANCE_LG : CONNECTION_DISTANCE_SM;

            currentParticles.forEach(p => p.update(mousePositionRef.current));
            
            for (let i = 0; i < currentParticles.length; i++) {
                for (let j = i + 1; j < currentParticles.length; j++) {
                    const p1 = currentParticles[i];
                    const p2 = currentParticles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        const isActiveConnection = p1.isActive || p2.isActive;
                        context.beginPath();
                        context.moveTo(p1.x, p1.y);
                        context.lineTo(p2.x, p2.y);
                        
                        const opacityBase = 1 - (distance / connectDistance); 
                        context.strokeStyle = isActiveConnection ? p1.lineColorActive : p1.lineColorDefault;
                        context.lineWidth = isActiveConnection ? 4.5 : 1.5; 
                        context.globalAlpha = isActiveConnection ? opacityBase * 1 : opacityBase * 0.9; 
                        context.stroke();
                    }
                }
            }
            context.globalAlpha = 1.0;

            currentParticles.forEach(p => p.draw());

            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            console.log("MazeBackground: Cleanup function called."); // DEBUG 
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} id="mazeBackgroundCanvas"/>;
};

export default MazeBackground;
