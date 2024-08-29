document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon button');
    const cartPopup = document.getElementById('cart-popup');
    const closeBtn = document.querySelector('.close-btn');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const emptyCartButton = document.getElementById('empty-cart');
    const darkModeSwitch = document.querySelector('.dark-mode .switch');
    const circle = document.querySelector('.dark-mode .circle');
    const body = document.body;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        if (!cartPopup || !cartItems || !totalPriceElement) return;

        cartItems.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is currently empty.</p>';
            totalPriceElement.textContent = '0.00';
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'cart-item';

                const img = document.createElement('img');
                img.src = item.img;
                img.alt = item.name;
                li.appendChild(img);

                const text = document.createElement('span');
                text.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                li.appendChild(text);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => {
                    removeFromCart(index);
                });
                li.appendChild(removeButton);
                cartItems.appendChild(li);
                totalPrice += item.price;
            });
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    }

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showAlert('Product Added to Cart');
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function showAlert(message) {
        let alert = document.querySelector('.alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.className = 'alert';
            document.body.appendChild(alert);
        }
        alert.classList.add('show');
        alert.textContent = message;
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300); 
        }, 3000);
    }

    function toggleDarkMode() {
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
        circle.classList.toggle('on', isDarkMode);
    }

    function initializeDarkMode() {
        const isDarkMode = localStorage.getItem('dark-mode') === 'true';
        if (isDarkMode) {
            body.classList.add('dark-mode');
            circle.classList.add('on');
        }
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cartPopup) {
                cartPopup.classList.remove('hidden');
                updateCart();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (cartPopup) {
                cartPopup.classList.add('hidden');
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === cartPopup) {
            if (cartPopup) {
                cartPopup.classList.add('hidden');
            }
        }
    });

    if (emptyCartButton) {
        emptyCartButton.addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                img: button.dataset.image
            };
            addToCart(product);
        });
    });

    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('click', toggleDarkMode);
    }

    initializeDarkMode();
});
