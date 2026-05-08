document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple animation for progress bars on load
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = targetWidth;
        }, 500);
    });

    // Interactive hover effects for council arrows (mock functionality)
    const arrowBtns = document.querySelectorAll('.arrow-btn');
    arrowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Scroll animation for timeline
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timeline && timelineProgress && timelineItems.length > 0) {
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress line height based on scroll
            const startOffset = windowHeight * 0.75; // Start drawing line when timeline top is 75% down screen
            let progress = (startOffset - rect.top) / rect.height;
            
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            
            timelineProgress.style.height = `${progress * 100}%`;
            
            // Highlight items that the progress line has reached
            timelineItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                // If the item is above the "progress front" line (which is startOffset on screen)
                if (itemRect.top < startOffset) {
                    item.classList.add('visible');
                } else {
                    item.classList.remove('visible'); // Optional: remove if you want it to revert when scrolling up
                }
            });
        });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // Neural Network Footer Animation
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 80;

        function resizeCanvas() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1
            });
        }

        let mouse = { x: -1000, y: -1000 };
        const footer = document.querySelector('.footer');
        
        footer.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        footer.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        function drawNeuralNetwork() {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particleCount; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(246, 88, 30, 0.8)';
                ctx.fill();
            }

            // Draw connections
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    let p1 = particles[i];
                    let p2 = particles[j];
                    let dx = p1.x - p2.x;
                    let dy = p1.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        let opacity = 1 - (dist / 120);
                        ctx.strokeStyle = `rgba(246, 88, 30, ${opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                let dxMouse = particles[i].x - mouse.x;
                let dyMouse = particles[i].y - mouse.y;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    let opacity = 1 - (distMouse / 180);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(drawNeuralNetwork);
        }

        drawNeuralNetwork();
    }

    // Social Network Connection Graph Animation
    const netCanvas = document.getElementById('network-lines-canvas');
    if (netCanvas) {
        const netCtx = netCanvas.getContext('2d');
        const nodes = document.querySelectorAll('.net-node');
        const hub = document.getElementById('net-hub');
        const graphContainer = document.getElementById('network-graph');
        
        let netWidth, netHeight;
        
        function resizeNetCanvas() {
            netWidth = graphContainer.offsetWidth;
            netHeight = graphContainer.offsetHeight;
            netCanvas.width = netWidth;
            netCanvas.height = netHeight;
        }

        window.addEventListener('resize', resizeNetCanvas);
        resizeNetCanvas();
        
        let time = 0;
        
        function drawConnections() {
            netCtx.clearRect(0, 0, netWidth, netHeight);
            
            const containerRect = graphContainer.getBoundingClientRect();
            const hubRect = hub.getBoundingClientRect();
            
            const hubX = (hubRect.left + hubRect.right) / 2 - containerRect.left;
            const hubY = (hubRect.top + hubRect.bottom) / 2 - containerRect.top;
            
            time += 0.02;
            
            nodes.forEach((node, index) => {
                const nodeRect = node.getBoundingClientRect();
                const nodeX = (nodeRect.left + nodeRect.right) / 2 - containerRect.left;
                const nodeY = (nodeRect.top + nodeRect.bottom) / 2 - containerRect.top;
                
                // Draw curved bezier line
                netCtx.beginPath();
                netCtx.moveTo(nodeX, nodeY);
                
                const isLeft = nodeX < hubX;
                const cpX = isLeft ? nodeX + (hubX - nodeX) / 2 : nodeX - (nodeX - hubX) / 2;
                
                netCtx.bezierCurveTo(cpX, nodeY, cpX, hubY, hubX, hubY);
                
                // Pulsing line opacity
                const pulse = Math.sin(time + index) * 0.2 + 0.3;
                netCtx.strokeStyle = `rgba(246, 88, 30, ${pulse})`;
                netCtx.lineWidth = 1.5;
                netCtx.stroke();
                
                // Animated data packet (dot traveling along the curve)
                // Simple quadratic approx for position
                const t = (Math.sin(time * 2 + index * Math.PI/3) + 1) / 2; // 0 to 1
                const invT = 1 - t;
                const packetX = invT * invT * nodeX + 2 * invT * t * cpX + t * t * hubX;
                const packetY = invT * invT * nodeY + 2 * invT * t * ((nodeY + hubY) / 2) + t * t * hubY;
                
                netCtx.beginPath();
                netCtx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
                netCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                netCtx.shadowBlur = 10;
                netCtx.shadowColor = 'rgba(246, 88, 30, 0.8)';
                netCtx.fill();
                netCtx.shadowBlur = 0; // reset
            });
            
            requestAnimationFrame(drawConnections);
        }
        
        drawConnections();
    }
});
