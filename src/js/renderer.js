import { UI } from './modules/ui.js';
import { validateForm } from './modules/validation.js';
import { setupHandlers } from './modules/handlers.js';

const elements = {
    statusMsg:       document.getElementById('status-msg'),
    phoneListElement: document.getElementById('phone-list'),
    inImei:          document.getElementById('in-imei'),
    inBrand:         document.getElementById('in-brand'),
    inModel:         document.getElementById('in-model'),
    inCountry:       document.getElementById('in-country'),
    inPrice:         document.getElementById('in-price'),
    isEditMode:      document.getElementById('edit-mode'),
    btnSave:         document.getElementById('btn-save'),
    btnCancel:       document.getElementById('btn-cancel'),
    btnFilter:       document.getElementById('btn-filter'),
    btnLoad:         document.getElementById('btn-load'),
    btnSeed:         document.getElementById('btn-seed'),
    modalLoad:       document.getElementById('modal-load'),
    modalReset:      document.getElementById('modal-reset'),
    imeiError:       document.getElementById('imei-error')
};

const context = {
    allData: [],
    isFilterActive: false,
    refresh() {
        const dataToRender = this.isFilterActive
            ? this.allData.filter(p => p.country.toLowerCase() === 'south korea')
            : this.allData;

        UI.render(dataToRender, elements, {
            onEdit:   (imei) => startEdit(imei),
            onRemove: (imei) => removeItem(imei)
        });
    }
};

function startEdit(imei) {
    const phone = context.allData.find(p => p.imei === imei);
    if (!phone) return;

    elements.isEditMode.value  = 'true';
    elements.inImei.value      = phone.imei;
    elements.inImei.disabled   = true;
    elements.inBrand.value     = phone.brand;
    elements.inModel.value     = phone.model;
    elements.inCountry.value   = phone.country;
    elements.inPrice.value     = phone.price;
    elements.btnSave.textContent = '✅ Обновить данные';
    elements.btnCancel.style.display = 'inline-block';

    validateForm(elements, context.allData);
}

async function removeItem(imei) {
    if (!confirm('Удалить запись?')) return;
    context.allData = context.allData.filter(p => p.imei !== imei);
    await window.api.saveData(context.allData);
    context.refresh();
}

// Инициализация — модуль выполняется после парсинга DOM, обёртка не нужна
setupHandlers(context, elements);

[elements.inImei, elements.inBrand, elements.inModel, elements.inCountry, elements.inPrice].forEach(input => {
    input.oninput = () => validateForm(elements, context.allData);
});

// Загружаем данные при старте
(async () => {
    context.allData = await window.api.loadData() || [];
    context.refresh();
})();
