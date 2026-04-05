import { MobilePhone } from '../../models/MobilePhone.js';

export const UI = {
    render(data, elements, callbacks) {
        const { phoneListElement, statusMsg } = elements;
        phoneListElement.innerHTML = '';

        statusMsg.textContent = `Найдено записей: ${data.length}`;

        data.forEach(item => {
            const phone = MobilePhone.fromJSON(item);
            const li = document.createElement('li');

            li.innerHTML = `
                <div class="item-info">
                    <span class="item-main">${phone.brand} ${phone.model}</span>
                    <span class="item-sub">${phone.imei} · ${phone.country} · ${phone.price.toLocaleString('ru-MD')} MDL</span>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" data-imei="${phone.imei}" title="Редактировать">✏️</button>
                    <button class="btn-delete" data-imei="${phone.imei}" title="Удалить">🗑️</button>
                </div>
            `;

            li.querySelector('.btn-edit').onclick = () => callbacks.onEdit?.(phone.imei);
            li.querySelector('.btn-delete').onclick = () => callbacks.onRemove?.(phone.imei);

            phoneListElement.appendChild(li);
        });
    },

    clearForm(elements, validateCallback) {
        const { inImei, inBrand, inModel, inCountry, inPrice, isEditMode, btnSave, btnCancel } = elements;

        inImei.value = '';
        inImei.disabled = false;
        inBrand.value = '';
        inModel.value = '';
        inCountry.value = '';
        inPrice.value = '';
        isEditMode.value = 'false';
        btnSave.textContent = '💾 Сохранить запись';
        btnCancel.style.display = 'none';

        if (validateCallback) validateCallback();
    }
};