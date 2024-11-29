document.addEventListener('DOMContentLoaded', function() {
    console.log('Content loaded');
    const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Show the login overlay on page load
    openLoginOverlay();
    startMatrixEffect();
    decodeTextEffect(() => {
        autofillForm();
    });
    setupLoginForm();

    // Function to navigate to a specific slide
    window.goToSlide = function(slideIndex) {
        swiper.slideTo(slideIndex);
    };
});

function openLoginOverlay() {
    document.getElementById('loginOverlay').style.display = 'flex';
}

function closeLoginOverlay() {
    document.getElementById('loginOverlay').style.display = 'none';
    startIdleAnimation();
}

function startIdleAnimation() {
    const phoneImage = document.querySelector('.swiper-slide:nth-of-type(1) img');
    phoneImage.classList.add('idle'); // Add the idle class to start the animation
}

function startMatrixEffect() {
    const canvas = document.querySelector('.matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px Chokokutai`;

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    };
    setInterval(draw, 45);
}

function decodeTextEffect(callback) {
    const element = document.getElementById('decodeText');
    const text = element.innerText;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iteration = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
        element.innerText = text.split('').map((char, index) => {
            if (index < iteration / (maxIterations / text.length)) {
                return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
        }).join('');

        iteration += 1;

        if (iteration >= maxIterations * text.length) {
            clearInterval(interval);
            element.innerText = text;
            if (callback) callback();
        }
    }, 20);
}

function typeText(element, text, callback) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.value += text[index];
            index++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 100);
}

function autofillForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    usernameInput.classList.add('autofill');
    passwordInput.classList.add('autofill');
    typeText(usernameInput, 'defaultUser', () => {
        typeText(passwordInput, 'defaultPassword');
    });
}

function typeTextCLI(element, text, callback) {
    let index = 0;
    element.innerText = ''; // Clear the text initially
    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerText += text[index];
            index++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 100); // Adjust the typing speed here
}

function startCLITypingEffect() {
    const h1Element = document.getElementById('cliTypingEffect');
    const text = 'PROGRAMADOR FULL STACK';
    typeTextCLI(h1Element, text);
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const overlayContent = document.getElementById('loginOverlay');
        overlayContent.classList.add('slide-out-top');
        overlayContent.addEventListener('animationend', () => {
            closeLoginOverlay();
            startIdleAnimation(); // Ensure the idle animation starts after closing the overlay
        }, { once: true });
    });
}