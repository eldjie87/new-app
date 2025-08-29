export function HomePage(navigate) {
    const page = document.createElement('div');
    page.innerHTML = `
        <h3>Your balance: <span>NT$</span> <span class="saldo-amount">0</span></h3>
        <button class="edit-saldo">Recharge</button>
        <form class="saldo-form" hidden>
            <input type="number" placeholder="New saldo" required />
            <button type="submit">Update</button>
            <button type="button" class="cancel-saldo">Cancel</button>
        </form>
        <form class="homepage-form">
            <input type="text" placeholder="item name" required />
            <input type="number" placeholder="item price" required />
            <span>Date: <input type="date" placeholder="item date" required /></span>
            <button type="submit">Add</button>
        </form>
        
        <div class="btn-container">
            <button class="save-to-file">Save to File</button>
            <form class="save-form" hidden>
                <input type="text" placeholder="File name" required />
                <button type="submit">Save</button>
                <button class="cancel-save">Cancel</button>
            </form>
            <button class="show-file">Show File</button>
            <button class="show-items">Show Items</button>
        </div>
        <span class="total"></span>
        <ul class="item-list"></ul>
        <ul class="file-list"></ul>
        `;

    function formatDate(date) {
        if (!date) return '-';
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    //add item
    const form = page.querySelector('.homepage-form');
    const itemNameInput = form.querySelector('input[type="text"]');
    const itemPriceInput = form.querySelector('input[type="number"]');
    const itemDateInput = form.querySelector('input[type="date"]');
    const itemList = page.querySelector('.item-list');
    const fileList = page.querySelector('.file-list');
    const totalSpan = page.querySelector('.total');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!itemNameInput.value || !itemPriceInput.value || !itemDateInput.value) {
            alert('Please fill in all fields');
            return;
        }
        try {
            await fetch('/api/add-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: itemNameInput.value, price: itemPriceInput.value, date: itemDateInput.value })
            });
            alert('item added successfully');
            itemNameInput.value = '';
            itemPriceInput.value = '';
            itemDateInput.value = '';
            await renderItems();
            fileList.innerHTML = '';
            totalSpan.style.display = 'block';
        } catch (error) {
            console.error("Error adding item:", error);
        }
    });



    //items
    async function renderItems() {
        const response = await fetch('/api/get-items');
        const items = await response.json();
        itemList.innerHTML = items.map(item => `
            <li>
                <div class="item-row">
                    <span>${item.item}</span>
                    <span>${formatDate(item.date)}</span>
                    <span class="item-price">NT$ ${item.price}</span>
                </div>
                <button class="delete-item" data-id="${item.id}">Delete</button>
            </li>
        `).join('');

        function updateTotal() {
            let total = 0;
            itemList.querySelectorAll('li').forEach(li => {
                const priceText = li.querySelector('.item-price').textContent.replace(/[^0-9.-]+/g, "");
                total += parseFloat(priceText) || 0;
            });
            totalSpan.textContent = `Total: NT$ ${total}`;
        }
        updateTotal();
    }
    renderItems();

    // Di luar renderItems, setelah itemList didefinisikan
    itemList.addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete-item')) {
            const id = e.target.dataset.id;
            const prompt = confirm(`Are you sure you want to delete this item?`);
            if (!prompt) return;
            try {
                await fetch(`/api/delete-item/${encodeURIComponent(id)}`, {
                    method: 'DELETE'
                });
                await renderItems(); // Ini akan auto fetch item terbaru
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    });

    const rechargeButton = page.querySelector('.edit-saldo');
    const saldoForm = page.querySelector('.saldo-form');
    const cancelSaldoButton = page.querySelector('.cancel-saldo');

    rechargeButton.addEventListener('click', () => {
        saldoForm.hidden = !saldoForm.hidden;
        saldoForm.style.display = saldoForm.hidden ? 'none' : 'flex';
        rechargeButton.style.display = 'none';
    });

    //saldo
    const saldoAmountInput = saldoForm.querySelector('input[type="number"]');

    saldoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = Number(saldoAmountInput.value);
        if (isNaN(value) || value <= 0) {
            alert('Masukkan saldo yang valid!');
            return;
        }
        try {
            await fetch('/api/add-saldo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ saldo: value })
            });
            alert('Saldo updated successfully');
            rechargeButton.style.display = 'block';
            saldoForm.hidden = true;
            saldoAmountInput.value = '';
        } catch (error) {
            console.error("Error updating saldo:", error);
        }
    });
    // Recharge cancel button
    cancelSaldoButton.addEventListener('click', () => {
        saldoForm.hidden = true;
        rechargeButton.style.display = 'block';
    });

    //get saldo
    async function getSaldo() {
        const response = await fetch('/api/get-saldo');
        const data = await response.json();
        const saldoAmount = page.querySelector('.saldo-amount');
        saldoAmount.textContent = data.saldo || 0;
    }
    setInterval(getSaldo, 1000);

    //save btn
    const saveButton = page.querySelector('.save-to-file');
    const saveForm = page.querySelector('.save-form');
    const showItemsButton = page.querySelector('.show-items');
    const showFileButton = page.querySelector('.show-file');
    saveButton.addEventListener('click', async () => {
        await renderItems();
        // totalSpan.style.display = 'none';
        fileList.innerHTML = '';
        saveForm.hidden = !saveForm.hidden;
        saveButton.style.display = 'block' ? 'none' : 'block';
        showItemsButton.style.display = 'block' ? 'none' : 'block';
        showFileButton.style.display = 'block' ? 'none' : 'block';
    });

    //cancel
    const cancelSaveButton = page.querySelector('.cancel-save');
    cancelSaveButton.addEventListener('click', () => {
        saveForm.hidden = true;
        saveButton.style.display = 'block';
        showItemsButton.style.display = 'block';
        showFileButton.style.display = 'block';
    });

    saveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const filename = saveForm.querySelector('input[type="text"]').value.trim();
        if (!filename) {
            alert('File name harus diisi!');
            return;
        }
        const itemsRes = await fetch('/api/get-items');
        const items = await itemsRes.json();
        const res = await fetch('/api/save-to-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, filename })
        });
        showFileButton.style.display = 'block';
        showItemsButton.style.display = 'block';
        const result = await res.json();
        if (res.ok) {
            alert(result.message || 'File saved!');
            saveForm.hidden = true;
            saveButton.style.display = 'block';
            saveForm.querySelector('input[type="text"]').value = '';
        } else {
            alert(result.error || 'Failed to save file!');
        }
    });

    //show file
    showFileButton.addEventListener('click', async () => {
        totalSpan.style.display = 'none';
        const res = await fetch(`/api/show-file`);
        const result = await res.json();
        fileList.innerHTML = result.map(file => `
            <li>${file}<button class="delete-file" data-filename="${file}">Delete</button></li>`).join('');
        itemList.innerHTML = '';

        //delete file
        const deleteButtons = fileList.querySelectorAll('.delete-file');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const prompt = confirm("Are you sure you want to delete this file?");
                if (!prompt) return;
                const filename = button.dataset.filename;
                const res = await fetch(`/api/delete-file/${filename}`, {
                    method: 'DELETE'
                });
                const result = await res.json();
                if (res.ok) {
                    alert(result.message || 'File deleted!');
                    fileList.innerHTML = '';
                } else {
                    alert(result.error || 'Failed to delete file!');
                }
            });
        });

    });

    //show items
    const showItems = page.querySelector('.show-items');
    showItems.addEventListener('click', async () => {
        renderItems();
        fileList.innerHTML = '';
        totalSpan.style.display = 'block';
    });

    return page;
}
