gsap.registerPlugin(ScrollTrigger);

const bgMusic = document.getElementById('bg-music');

let failedAttempts = 0;

// Haptic feedback helper
function triggerVibrate(pattern = 50) {
    if (navigator.vibrate) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.log("Vibration error:", e);
        }
    }
}

function switchStep(fromId, toId) {
    const fromEl = document.getElementById(`step-${fromId}`);
    const toEl = document.getElementById(`step-${toId}`);
    
    if (fromEl) {
        fromEl.classList.remove('active');
        setTimeout(() => {
            fromEl.classList.add('hidden');
        }, 500);
    }
    
    if (toEl) {
        setTimeout(() => {
            toEl.classList.remove('hidden');
            // Trigger reflow
            void toEl.offsetWidth;
            toEl.classList.add('active');
            
            // Step specific initializations
            if (toId === 3) initStep3();
            if (toId === 4) initStep4();
            if (toId === 5) initStep5();
            if (toId === 6) initStep6();
        }, 500);
    }
}

// Step 1 - Envelope Click & Popping Heart Animation
let envelopeClicked = false;
document.getElementById('envelope-btn').addEventListener('click', () => {
    if (envelopeClicked) return;
    envelopeClicked = true;

    triggerVibrate([40, 60, 40]);
    bgMusic.play().catch(e => console.log(e));

    const poppingHeart = document.getElementById('popping-heart');

    // Set initial position for popping heart properly
    gsap.set(poppingHeart, { xPercent: -50, yPercent: -50, scale: 0 });

    // Timeline for Envelope opening & Heart popping animation
    const tl = gsap.timeline({
        onComplete: () => {
            switchStep(1, 2);
            // Clear props so background/elements clean up properly without artifacts
            gsap.set(['.envelope-heading', '.envelope-subtext', '.envelope-icon', poppingHeart, '#envelope-btn'], { clearProps: "all" });
        }
    });

    // 1. Fade out heading and subtext
    tl.to('.envelope-heading, .envelope-subtext', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.in"
    })
    // 2. Shrink envelope icon slightly while heart emerges
    .to('.envelope-icon', {
        scale: 0.8,
        rotate: -10,
        duration: 0.3,
        ease: "back.out(1.7)"
    }, "<")
    // 3. Red heart pops out from inside the envelope
    .to(poppingHeart, {
        scale: 1.4,
        opacity: 1,
        y: -45,
        duration: 0.6,
        ease: "back.out(2)"
    })
    // 4. Heart beats elegantly
    .to(poppingHeart, {
        scale: 1.7,
        duration: 0.22,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut"
    })
    // 5. Envelope fades away completely
    .to('.envelope-icon', {
        opacity: 0,
        scale: 0,
        duration: 0.3
    }, "<")
    // 6. Heart scales up massively to cover screen before completing step transition
    .to(poppingHeart, {
        scale: 35,
        opacity: 1,
        duration: 0.75,
        ease: "power2.in"
    });
});

// Initialize Flatpickr
const datePicker = flatpickr("#magic-date", {
    dateFormat: "Y-m-d",
    disableMobile: true
});

// Step 2 - Memory Lock Unlock
document.getElementById('unlock-btn').addEventListener('click', () => {
    const selectedDate = document.getElementById('magic-date').value;
    
    if (selectedDate === '2026-03-07') {
        triggerVibrate([50, 50, 100]);
        gsap.to('#password-card', { y: -50, opacity: 0, duration: 0.5, onComplete: () => {
            switchStep(2, 3);
        }});
    } else {
        failedAttempts++;
        triggerVibrate([100, 50, 100]); // Error vibration pattern
        gsap.fromTo('#password-card', { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5, onComplete: () => {
            gsap.set('#password-card', { x: 0 });
        }});
        if (failedAttempts >= 3) {
            const hint = document.getElementById('password-hint');
            hint.classList.remove('hidden');
            hint.style.display = 'block';
            gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            datePicker.setDate('2026-03-07');
        }
    }
});

// Step 3
function initStep3() {
    gsap.utils.toArray('.gallery-item').forEach((item) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top 75%",
            end: "bottom 25%",
            onEnter: () => gsap.to(item, { scale: 1.05, duration: 0.4, ease: "power2.out" }),
            onLeave: () => gsap.to(item, { scale: 1, duration: 0.4, ease: "power2.out" }),
            onEnterBack: () => gsap.to(item, { scale: 1.05, duration: 0.4, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(item, { scale: 1, duration: 0.4, ease: "power2.out" })
        });
    });
}

document.getElementById('memory-continue-btn').addEventListener('click', () => {
    triggerVibrate(60);
    switchStep(3, 4);
    window.scrollTo(0, 0);
});

// Step 4
function initStep4() {
    const firefliesContainer = document.getElementById('fireflies-container');
    firefliesContainer.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const f = document.createElement('div');
        f.classList.add('firefly');
        f.style.left = `${Math.random() * 100}%`;
        f.style.top = `${Math.random() * 100}%`;
        f.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        f.style.animationDelay = `${Math.random() * 2}s`;
        firefliesContainer.appendChild(f);
    }

    const tl = gsap.timeline();
    tl.to('#r-text-1', { opacity: 1, y: -10, duration: 2, ease: "power2.out" })
      .to('#r-text-2', { opacity: 1, y: -10, duration: 2, ease: "power2.out" }, "+=1.5")
      .to('#r-text-3', { opacity: 1, y: -10, duration: 2.5, ease: "power2.out" }, "+=1.5")
      .to('#realization-btn', { opacity: 1, pointerEvents: 'auto', duration: 1 }, "+=1");
}

document.getElementById('realization-btn').addEventListener('click', () => {
    triggerVibrate(60);
    switchStep(4, 5);
});

// Step 5
function initStep5() {
    gsap.to('.cinematic-bg', { scale: 1.2, duration: 10, ease: "none" });
    gsap.from('.grand-title', { scale: 0.5, opacity: 0, duration: 2, ease: "elastic.out(1, 0.3)" });
    
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff4d85', '#ffe5ed', '#d4af37', '#ffffff']
    });

    setTimeout(() => {
        gsap.to('#reveal-btn', { opacity: 1, pointerEvents: 'auto', duration: 1 });
    }, 2500);
}

document.getElementById('reveal-btn').addEventListener('click', () => {
    triggerVibrate([70, 40, 70]);
    switchStep(5, 6);
});

// Step 6
async function initStep6() {
    const tw = document.getElementById('typewriter');
    tw.innerHTML = "";
    tw.classList.add('typewriter-cursor');

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const text1 = "I still regret replying to your message on March 7... 🤦‍♂️";
    const text2 = "<br><br>Sorry, typing mistake! 😅";
    const finalMsg = "Meri bechainiyon ko chain mil jaaye, tera chehra jab nazar aaye... ✨<br><br>To me, this is the exact definition of you. Amidst all the chaos in my life, you are my ultimate peace. 🤍<br><br>March 7, 2026... that was truly a beautiful day when you sent me that very first message. We misunderstood each other so much in the beginning, didn't we? There was even a phase when we stopped talking entirely. 🥀<br><br>But then came May 11... the day our story began anew. I never could have dreamed in a million years that we would come this far. 🦋<br><br>Today, you are the most special and unique chapter of my life—the one person I can trust blindly, with my eyes closed. I might not have ever seen your sweet smile in person yet, but on the canvas of my imagination, your smiling face is the most breathtaking sight in the world. 🌸<br><br>I genuinely feel so lucky and incredibly proud to call myself your close friend. I just want this beautiful, crazy bond of ours to stay exactly like this, forever and always. ♾️💫";

    // Tokenizer to handle HTML tags and individual characters/emojis separately
    function tokenizeHTML(htmlString) {
        let tokens = [];
        let regex = /(<[^>]+>)|([^<]+)/g;
        let match;
        while ((match = regex.exec(htmlString)) !== null) {
            if (match[1]) {
                tokens.push(match[1]); // Push the entire HTML tag
            } else if (match[2]) {
                // Split text into characters, properly handling unicode surrogate pairs (emojis)
                tokens.push(...Array.from(match[2]));
            }
        }
        return tokens;
    }

    let displayedTokens = [];

    async function typeText(text, speed) {
        let tokens = tokenizeHTML(text);
        for (let token of tokens) {
            displayedTokens.push(token);
            tw.innerHTML = displayedTokens.join('');
            if (!token.startsWith('<')) { // Don't delay for HTML tags
                await sleep(speed);
            }
        }
    }

    async function deleteText(speed) {
        while (displayedTokens.length > 0) {
            let removed = displayedTokens.pop();
            tw.innerHTML = displayedTokens.join('');
            if (!removed.startsWith('<')) { // Don't delay when deleting HTML tags
                await sleep(speed);
            }
        }
    }

    await sleep(500); // Initial delay before starting

    // 1. Type first text
    await typeText(text1, 50);
    
    // 2. Pause for 1 second
    await sleep(1000);
    
    // 3. Type mistake text
    await typeText(text2, 50);
    
    // 4. Pause for 800ms
    await sleep(800);
    
    // 5. FAST DELETE
    await deleteText(10);
    
    // 6. Pause for 500ms
    await sleep(500);
    
    // 7. Type FINAL MESSAGE
    await typeText(finalMsg, 50);

    // 8. FADE IN Action buttons only AFTER completion
    tw.classList.remove('typewriter-cursor');
    gsap.to('#msg-continue-btn', { opacity: 1, pointerEvents: 'auto', duration: 1, delay: 0.5 });
}

document.getElementById('msg-continue-btn').addEventListener('click', () => {
    triggerVibrate([50, 50, 50]);
    switchStep(6, 7);
});

// Step 7
document.querySelectorAll('.expr-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        triggerVibrate(70);
        switchStep(7, 8);
    });
});

// Step 8
document.querySelectorAll('.party-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        triggerVibrate(70);
        switchStep(8, 9);
    });
});

// Step 9
document.getElementById('promise-next-btn').addEventListener('click', function() {
    triggerVibrate(70);
    switchStep(9, 10);
});

// Step 10 (WhatsApp)
document.getElementById("send-whatsapp-btn").addEventListener("click", function() {
    let secretMessage = document.getElementById("secret-msg").value;
    
    // Hidden backend text
    let promiseText = "I promise to let our friendship stay exactly as beautiful and pure as it is right now, forever. ❤️\n\nHere is my secret message for you:\n";
    
    // Combine texts
    let finalMessage = promiseText + secretMessage;
    
    // Encode for URL
    let encodedText = encodeURIComponent(finalMessage);
    
    // Open WhatsApp with the specific number
    window.open('https://wa.me/918927256859?text=' + encodedText, '_blank');
});
