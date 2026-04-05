export function validateForm(elements, allData) {
    const { inImei, isEditMode, btnSave, imeiError, inBrand, inModel, inCountry, inPrice } = elements;

    const imeiValue  = inImei.value.trim();
    const priceValue = Number(inPrice.value);
    const isEdit     = isEditMode.value === 'true';

    // Проверка дубликата IMEI (только при добавлении)
    const isDuplicate  = !isEdit && allData.some(p => p.imei === imeiValue);

    // Минимум 5 символов — только при добавлении
    const imeiTooShort = !isEdit && imeiValue.length > 0 && imeiValue.length < 5;

    // Цена должна быть > 0
    const priceInvalid = inPrice.value !== '' && priceValue <= 0;

    // ── IMEI wrapper ──
    const imeiHasError = (isDuplicate || imeiTooShort) && imeiValue.length > 0;
    imeiError.textContent = isDuplicate ? 'Этот IMEI уже существует' : 'Минимум 5 символов';
    imeiError.style.visibility = imeiHasError ? 'visible' : 'hidden';
    inImei.closest('.input-wrapper').classList.toggle('has-error', imeiHasError);

    // ── Price wrapper ──
    inPrice.closest('.input-wrapper').classList.toggle('has-error', priceInvalid && inPrice.value !== '');

    // ── Проверка изменений при редактировании ──
    let hasChanges = true;
    if (isEdit) {
        const original = allData.find(p => p.imei === imeiValue);
        if (original) {
            hasChanges = (
                inBrand.value.trim()   !== original.brand   ||
                inModel.value.trim()   !== original.model   ||
                inCountry.value.trim() !== original.country ||
                priceValue             !== Number(original.price)
            );
        }
    }

    // ── Все поля заполнены ──
    const allFilled = [inImei, inBrand, inModel, inCountry, inPrice]
        .every(el => el.value.trim() !== '');

    const imeiOk  = !isDuplicate && !imeiTooShort;
    const priceOk = !priceInvalid;

    btnSave.disabled = !(allFilled && imeiOk && priceOk && (!isEdit || hasChanges));
}
