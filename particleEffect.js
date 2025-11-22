// particleEffect.js

let particles = [];
let animationState = 'stopped'; // 'stopped', 'chaos', 'gathering'
let animationFrameId;
let canvas, ctx;
let resolveGatheringPromise = null;
let particleCreationInterval = null; // Timeout/Interval 핸들러를 위해 유지

const defaultTextFragments = [
    "안 괜찮은데", "별로라고 말할까", "불편하네", "나는 그렇게 생각 안하는데",
    "이상하게 생각하겠지", "그게 아닐텐데", "조금 비겁하네", "지금 내 감정은", "솔직히 말하면",
    "듣기 싫다", "지겨워", "뻥 치시네", "안 그런 거 같은데", "약간 억지스러운데", "시끄럽네",
    "이 말 해도 되나", "음...", "딱히 동의 못 하겠어", "진부해", "괜히 분위기 깨는 건 아닐까",
    "아 스트레스 받아", "또 저 얘기하네", "같은 얘기", "말을 너무 쉽게 하네", "거짓말", "말이 달라졌네",
    "이해가 안 돼", "유난 떠네", "핑계", "호들갑이 심해"
];

class Particle {
    constructor(x, y, text) {
        this.x = x; this.y = y; this.text = text;
        
        // ▼▼▼ [수정] 스크립트 본문(#script-body)과 동일한 크기 비율 적용 ▼▼▼
        // CSS의 clamp(1.4rem, 1.6vw, 2.4rem)를 JS로 구현
        // 최소 22px, 반응형 1.6vw, 최대 38px
        const vw = window.innerWidth;
        const calculatedSize = vw * 0.016; // 1.6vw (스크립트와 동일)
        
        this.fontSize = Math.max(22, Math.min(calculatedSize, 38));

        const fontWeight = '500'; 
        if (ctx) {
            // [수정] 위에서 설정한 fontSize 변수 사용
            ctx.font = `${fontWeight} ${this.fontSize}px 'Pretendard', sans-serif`;
            this.textWidth = ctx.measureText(this.text).width;
        } else {
            this.textWidth = this.text.length * (this.fontSize / 2);
        }
        
        this.halfWidth = this.textWidth / 2;
        this.halfHeight = this.fontSize / 2;

        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        
        this.alpha = 1;
        this.blur = 0;
        this.lifetime = Math.random() * 300 + 1080; 
    }

    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        if (this.blur > 0.1) {
            ctx.filter = `blur(${this.blur}px)`;
        }
        
        if (animationState === 'gathering') {
            ctx.fillStyle = "rgba(180, 180, 180, 1)"; 
        } else {
            ctx.fillStyle = "rgba(210, 210, 210, 1)";
        }

        // [수정] this.fontSize 변수 사용
        ctx.font = `500 ${this.fontSize}px 'Pretendard', sans-serif`;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    update(collisionBox, isProtected = false) {
        if (animationState === 'chaos') {
            
            if (!isProtected) {
                this.lifetime--;

                const fadeStartTime = 600; 
                if (this.lifetime < fadeStartTime) {
                    const currentLifetime = Math.max(0, this.lifetime);
                    this.alpha = 0.25 + (0.75 * (currentLifetime / fadeStartTime));
                }

                this.blur += 0.001;
                this.blur = Math.min(this.blur, 0.1);
            } else {
                this.alpha = 1;
                this.blur = 0;
            }

            this.x += this.vx;
            this.y += this.vy;

            // 충돌 로직
            if ((this.x - this.halfWidth) < 0) { this.x = this.halfWidth; this.vx *= -1; }
            if ((this.x + this.halfWidth) > canvas.width) { this.x = canvas.width - this.halfWidth; this.vx *= -1; }
            if ((this.y - this.halfHeight) < 0) { this.y = this.halfHeight; this.vy *= -1; }
            if ((this.y + this.halfHeight) > canvas.height) { this.y = canvas.height - this.halfHeight; this.vy *= -1; }

            if (collisionBox) {
                const pLeft = this.x - this.halfWidth, pRight = this.x + this.halfWidth;
                const pTop = this.y - this.halfHeight, pBottom = this.y + this.halfHeight;

                if (pRight > collisionBox.left && pLeft < collisionBox.right && pBottom > collisionBox.top && pTop < collisionBox.bottom) {
                    const overlapX = Math.min(pRight - collisionBox.left, collisionBox.right - pLeft);
                    const overlapY = Math.min(pBottom - collisionBox.top, collisionBox.bottom - pTop);

                    if (overlapX < overlapY) {
                        this.vx *= -1;
                        this.x += (this.x < collisionBox.left) ? -(overlapX + 1) : (overlapX + 1);
                    } else {
                        this.vy *= -1;
                        this.y += (this.y < collisionBox.top) ? -(overlapY + 1) : (overlapY + 1);
                    }
                }
            }
        } else if (animationState === 'gathering') {
            const targetX = canvas.width / 2, targetY = canvas.height / 2;
            const dx = targetX - this.x, dy = targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) { this.x += dx * 0.02; this.y += dy * 0.02; }
            
            if (dist < 250) { 
                this.blur += 0.03;
                this.alpha -= 0.003; 
            }
            if (this.alpha < 0) this.alpha = 0;
        }
    }
}

function animate() {
    if (!ctx || !canvas || animationState === 'stopped') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let collisionBox = null;
    const scriptWrapper = document.querySelector('#script-view .script-content-wrapper');
    if (scriptWrapper && !document.getElementById('script-view').classList.contains('hidden')) {
        collisionBox = scriptWrapper.getBoundingClientRect();
    }

    particles = particles.filter(p => p.alpha > 0);

    if (animationState === 'chaos') {
        const MIN_FRESH_PARTICLES = 12;
        const newestParticles = new Set(particles.slice(-MIN_FRESH_PARTICLES));

        particles.forEach(p => {
            p.update(collisionBox, newestParticles.has(p));
        });
    } else {
         particles.forEach(p => {
            p.update(collisionBox);
        });
    }
    
    particles.forEach(p => {
        p.draw();
    });

    if (animationState === 'gathering' && particles.length === 0) {
        stopChaosAnimation(true);
        if (resolveGatheringPromise) {
            resolveGatheringPromise();
            resolveGatheringPromise = null;
        }
    } else {
        animationFrameId = requestAnimationFrame(animate);
    }
}

function startChaosAnimation(textFragments) {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (animationState !== 'stopped' || !ctx) return;

    animationState = 'chaos';
    particles = [];
    
    let fragments = [...(textFragments || defaultTextFragments)];
    let fragmentIndex = 0;

    const initialDelay = 7000;
    let startTime;

    function createParticlesRecursively() {
        if (animationState !== 'chaos') return;

        const elapsedTime = Date.now() - startTime;
        const totalDuration = 25000;
        if (elapsedTime >= totalDuration) return;

        const progress = elapsedTime / totalDuration;
        const PARTICLE_LIMIT = 30;
        let nextInterval;

        if (particles.length > PARTICLE_LIMIT) {
            nextInterval = 1500;
        } else {
            if (progress < 0.2) { 
                nextInterval = Math.random() * 700 + 900;
            } 
            else if (progress < 0.8) { 
                nextInterval = Math.random() * 200 + 300;
            } 
            else { 
                nextInterval = Math.random() * 400 + 500;
            }
        }
        
        if (fragmentIndex >= fragments.length) {
            fragmentIndex = 0;
        }
        const frag = fragments[fragmentIndex];
        fragmentIndex++;

        if (frag && frag.trim() !== '') {
            const scriptWrapper = document.querySelector('#script-view .script-content-wrapper');
            if (!scriptWrapper) return;
            const collisionBox = scriptWrapper.getBoundingClientRect();
            let x, y;

            do {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
            } while (x > collisionBox.left && x < collisionBox.right && y > collisionBox.top && y < collisionBox.bottom);
            
            particles.push(new Particle(x, y, frag));
        }
        
        particleCreationInterval = setTimeout(createParticlesRecursively, nextInterval);
    }

    setTimeout(() => {
        if (animationState !== 'chaos') return;

        canvas.classList.remove('hidden');
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animate();
        startTime = Date.now();
        createParticlesRecursively();

    }, initialDelay);

    window.addEventListener('resize', () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
}

function startGatheringAnimation() {
    return new Promise(resolve => {
        if (animationState === 'chaos') {
            animationState = 'gathering';
            
            if (particleCreationInterval) clearTimeout(particleCreationInterval);
            if (!animationFrameId) animate();

            let hasResolved = false;

            // 안전장치: 4초 후에도 애니메이션이 끝나지 않으면 강제로 다음 단계 진행
            const failsafeTimeout = setTimeout(() => {
                if (!hasResolved) {
                    console.warn("Gathering animation failsafe triggered. Proceeding to voice recognition.");
                    hasResolved = true;
                    resolve();
                }
            }, 4000);

            // 이상적인 경우: 모든 파티클이 사라지면 안전장치를 해제하고 다음 단계 진행
            resolveGatheringPromise = () => {
                if (!hasResolved) {
                    clearTimeout(failsafeTimeout);
                    hasResolved = true;
                    resolve();
                }
            };

        } else {
            resolve();
        }
    });
}

function stopChaosAnimation(forceClear = false) {
    animationState = 'stopped';
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (particleCreationInterval) clearTimeout(particleCreationInterval);
    animationFrameId = null;

    if (forceClear && canvas) {
        particles = [];
        if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add('hidden');
    }
}