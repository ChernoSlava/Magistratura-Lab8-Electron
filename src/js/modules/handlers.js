import { UI } from './ui.js';
import { validateForm } from './validation.js';

const FILTER_COUNTRY = 'South Korea';

export function setupHandlers(context, elements) {
    const {
        btnSave, btnCancel, btnFilter, btnLoad, btnSeed,
        modalLoad, modalReset, statusMsg
    } = elements;

    // --- Закрытие модалок ---
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => btn.closest('dialog').close();
    });

    // --- Модалка ЗАГРУЗКИ ---
    document.getElementById('btn-load-default').onclick = async () => {
        let data = await window.api.loadData() || [];

        if (data.length === 0) {
            modalLoad.close();
            if (confirm('Системная база пуста. Хотите создать демонстрационные данные?')) {
                data = getDemoData();
                await window.api.saveData(data);
                statusMsg.textContent = 'Статус: Создана демо-база.';
            } else {
                statusMsg.textContent = 'Статус: Файл пуст.';
            }
        } else {
            statusMsg.textContent = 'Статус: Данные загружены из системной БД.';
            modalLoad.close();
        }

        context.allData = data;
        context.refresh();
    };

    document.getElementById('btn-load-custom').onclick = async () => {
        const customData = await window.api.openCustomFile();
        if (customData) {
            context.allData = customData;
            context.refresh();
            statusMsg.textContent = 'Статус: Загружено из внешнего файла.';
        }
        modalLoad.close();
    };

    // --- Модалка СБРОСА ---
    document.getElementById('btn-reset-clear').onclick = async () => {
        if (!confirm('Внимание! Это полностью очистит базу данных на диске. Продолжить?')) return;
        context.allData = [];
        await window.api.saveData([]);
        UI.clearForm(elements, () => validateForm(elements, context.allData));
        context.refresh();
        modalReset.close();
        statusMsg.textContent = 'Статус: Файл базы данных очищен.';
    };

    document.getElementById('btn-reset-demo').onclick = async () => {
        context.allData = getDemoData();
        await window.api.saveData(context.allData);
        context.refresh();
        modalReset.close();
        statusMsg.textContent = 'Статус: Записаны демонстрационные данные.';
    };

    document.getElementById('btn-ui-clear').onclick = () => {
        UI.render([], elements, {});
        statusMsg.textContent = 'Статус: Список на экране очищен (файл не затронут).';
        modalReset.close();
    };

    // --- Сохранение записи ---
    btnSave.onclick = async () => {
        const phoneObj = {
            imei:    elements.inImei.value.trim(),
            brand:   elements.inBrand.value.trim(),
            model:   elements.inModel.value.trim(),
            country: elements.inCountry.value.trim(),
            price:   Number(elements.inPrice.value)   // ✅ число, не строка
        };

        if (elements.isEditMode.value === 'true') {
            const idx = context.allData.findIndex(p => p.imei === phoneObj.imei);
            if (idx !== -1) context.allData[idx] = phoneObj;
        } else {
            context.allData.unshift(phoneObj);
        }

        await window.api.saveData(context.allData);
        UI.clearForm(elements, () => validateForm(elements, context.allData));
        context.refresh();
        statusMsg.textContent = 'Статус: Запись сохранена в файл.';
    };

    btnCancel.onclick = () => UI.clearForm(elements, () => validateForm(elements, context.allData));

    // --- Фильтр ---
    btnFilter.onclick = () => {
        context.isFilterActive = !context.isFilterActive;
        btnFilter.textContent = context.isFilterActive ? '🔄 Показать все' : `🟢 ${FILTER_COUNTRY}`;
        btnFilter.classList.toggle('active', context.isFilterActive);
        context.refresh();
    };

    btnLoad.onclick = () => modalLoad.showModal();
    btnSeed.onclick = () => modalReset.showModal();
}

function getDemoData() {
    return [
        { imei: '101', brand: 'Samsung', model: 'S24',    country: 'South Korea', price: 22000 },
        { imei: '102', brand: 'LG',      model: 'Velvet', country: 'South Korea', price: 12000 },
        { imei: '103', brand: 'Apple',   model: 'iPhone 15', country: 'USA',      price: 25000 }
    ];
}
