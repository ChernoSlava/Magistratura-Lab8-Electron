import { UI } from './modules/ui.js';
import { validateForm } from './modules/validation.js';
import { setupHandlers } from './modules/handlers.js';

const elements = {
    statusMsg:        document.getElementById('status-msg'),
    phoneListElement: document.getElementById('phone-list'),
    inImei:           document.getElementById('in-imei'),
    inBrand:          document.getElementById('in-brand'),
    inModel:          document.getElementById('in-model'),
    inColor:          document.getElementById('in-color'),
    inCountry:        document.getElementById('in-country'),
    inPrice:          document.getElementById('in-price'),
    isEditMode:       document.getElementById('edit-mode'),
    btnSave:          document.getElementById('btn-save'),
    btnCancel:        document.getElementById('btn-cancel'),
    btnFilter:        document.getElementById('btn-filter'),
    btnLoad:          document.getElementById('btn-load'),
    btnSeed:          document.getElementById('btn-seed'),
    modalLoad:        document.getElementById('modal-load'),
    modalReset:       document.getElementById('modal-reset'),
    imeiError:        document.getElementById('imei-error'),
    searchInput:      document.getElementById('search-input'),
    statTotal:        document.getElementById('stat-total'),
    statAvg:          document.getElementById('stat-avg'),
    statTop:          document.getElementById('stat-top'),
};

const context = {
    allData: [],
    isFilterActive: false,
    searchQuery: '',

    refresh() {
        let data = this.allData;

        if (this.isFilterActive)
            data = data.filter(p => p.country.toLowerCase() === 'south korea');

        if (this.searchQuery)
            data = data.filter(p =>
                [p.brand, p.model, p.country, p.color, p.imei]
                    .some(v => v?.toLowerCase().includes(this.searchQuery))
            );

        UI.render(data, elements, {
            onEdit:   imei => startEdit(imei),
            onRemove: imei => removeItem(imei)
        });

        updateStats(this.allData);
    }
};

// ── Статистика ──────────────────────────────────────────────────────
function updateStats(data) {
    elements.statTotal.textContent = data.length;

    if (data.length === 0) {
        elements.statAvg.textContent = '0';
        elements.statTop.textContent = '—';
        return;
    }

    const avg = Math.round(data.reduce((s, p) => s + Number(p.price), 0) / data.length);
    elements.statAvg.textContent = avg.toLocaleString('ru-MD');

    // Топ бренд по количеству
    const brandCount = data.reduce((acc, p) => {
        acc[p.brand] = (acc[p.brand] || 0) + 1;
        return acc;
    }, {});
    const top = Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0];
    elements.statTop.textContent = top ? top[0] : '—';
}

// ── Редактирование ──────────────────────────────────────────────────
function startEdit(imei) {
    const phone = context.allData.find(p => p.imei === imei);
    if (!phone) return;

    elements.isEditMode.value         = 'true';
    elements.inImei.value             = phone.imei;
    elements.inImei.disabled          = true;
    elements.inBrand.value            = phone.brand;
    elements.inModel.value            = phone.model;
    elements.inColor.value            = phone.color || '';
    elements.inCountry.value          = phone.country;
    elements.inPrice.value            = phone.price;
    elements.btnSave.textContent      = '✅ Обновить данные';
    elements.btnCancel.style.display  = 'inline-block';

    validateForm(elements, context.allData);
    elements.inBrand.focus();
}

// ── Удаление ────────────────────────────────────────────────────────
async function removeItem(imei) {
    if (!confirm('Удалить запись?')) return;
    context.allData = context.allData.filter(p => p.imei !== imei);
    await window.api.saveData(context.allData);
    context.refresh();
}

// ── Тёмная тема ─────────────────────────────────────────────────────
const btnTheme = document.getElementById('btn-theme');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    btnTheme.textContent = '☀️';
}
btnTheme.onclick = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    btnTheme.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// ── Поиск ────────────────────────────────────────────────────────────
elements.searchInput.oninput = () => {
    context.searchQuery = elements.searchInput.value.trim().toLowerCase();
    context.refresh();
};

// ── Валидация при вводе ──────────────────────────────────────────────
[elements.inImei, elements.inBrand, elements.inModel, elements.inColor,
 elements.inCountry, elements.inPrice].forEach(input => {
    input.oninput = () => validateForm(elements, context.allData);
});

// ── Инициализация ────────────────────────────────────────────────────
setupHandlers(context, elements);

(async () => {
    context.allData = await window.api.loadData() || [];
    context.refresh();
})();
