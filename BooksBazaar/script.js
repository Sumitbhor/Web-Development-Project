// Simple cart management using localStorage
(function () {
    const STORAGE_KEY = "books_bazaar_cart";

    function getCart() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse cart from storage", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function addItemFromButton(button) {
        const title = button.getAttribute("data-title");
        const author = button.getAttribute("data-author");
        const price = parseFloat(button.getAttribute("data-price")) || 0;
        const image = button.getAttribute("data-image") || "";

        const cart = getCart();

        const existingIndex = cart.findIndex(
            (item) => item.title === title && item.author === author
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                title,
                author,
                price,
                image,
                quantity: 1,
            });
        }

        saveCart(cart);
        alert(`"${title}" added to cart.`);
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const countElements = document.querySelectorAll(".cart-count");
        countElements.forEach((el) => {
            el.textContent = count > 0 ? count : "0";
        });
    }

    function renderCart() {
        const tableBody = document.getElementById("cart-items");
        const totalElement = document.getElementById("cart-total");

        if (!tableBody || !totalElement) {
            // Not on the cart page
            return;
        }

        const cart = getCart();
        tableBody.innerHTML = "";

        if (cart.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.className = "text-center py-4";
            cell.textContent = "Your cart is empty.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            totalElement.textContent = "₹0";
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const row = document.createElement("tr");

            const imgCell = document.createElement("td");
            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title;
                img.style.width = "60px";
                img.style.height = "80px";
                img.style.objectFit = "cover";
                img.className = "rounded";
                imgCell.appendChild(img);
            }

            const titleCell = document.createElement("td");
            titleCell.innerHTML = `<strong>${item.title}</strong><br><small class="text-muted">${item.author}</small>`;

            const priceCell = document.createElement("td");
            priceCell.textContent = `₹${item.price.toFixed(2)}`;

            const quantityCell = document.createElement("td");
            const qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.min = "1";
            qtyInput.value = item.quantity || 1;
            qtyInput.className = "form-control form-control-sm w-50";
            qtyInput.addEventListener("change", function () {
                const newQty = parseInt(qtyInput.value, 10) || 1;
                const updatedCart = getCart();
                if (updatedCart[index]) {
                    updatedCart[index].quantity = newQty;
                    saveCart(updatedCart);
                    renderCart();
                    updateCartCount();
                }
            });
            quantityCell.appendChild(qtyInput);

            const lineTotal = item.price * (item.quantity || 1);
            total += lineTotal;
            const totalCell = document.createElement("td");
            totalCell.textContent = `₹${lineTotal.toFixed(2)}`;

            const actionCell = document.createElement("td");
            const removeBtn = document.createElement("button");
            removeBtn.className = "btn btn-sm btn-outline-danger";
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", function () {
                const updatedCart = getCart();
                updatedCart.splice(index, 1);
                saveCart(updatedCart);
                renderCart();
                updateCartCount();
            });
            actionCell.appendChild(removeBtn);

            row.appendChild(imgCell);
            row.appendChild(titleCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(totalCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

        totalElement.textContent = `₹${total.toFixed(2)}`;
    }

    function clearCart() {
        saveCart([]);
        renderCart();
        updateCartCount();
    }

    document.addEventListener("DOMContentLoaded", function () {
        // Attach listeners to all add-to-cart buttons
        const buttons = document.querySelectorAll(".add-to-cart");
        buttons.forEach((btn) => {
            btn.addEventListener("click", function () {
                addItemFromButton(btn);
            });
        });

        // Setup cart page if present
        const clearBtn = document.getElementById("clear-cart");
        if (clearBtn) {
            clearBtn.addEventListener("click", function () {
                if (confirm("Are you sure you want to clear the cart?")) {
                    clearCart();
                }
            });
        }

        renderCart();
        updateCartCount();
    });
})();

