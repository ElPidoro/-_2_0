'use strict';
/**
 * Місія 05 — учнівський файл. Це НЕ готове рішення.
 * Місія 04 (фільтри) вже працює у js/app.js.
 * TODO-A: зв'язок картки страви з формою (частково підготовлений).
 * TODO-Б: самостійна перевірка кількості; без готового розв'язку.
 * TODO-В: валідація, підсумок і стани форми.
 */
const orderForm = document.getElementById('orderForm');
const studentNameInput = document.getElementById('studentName');
const studentClassSelect = document.getElementById('studentClass');
const selectedDishInput = document.getElementById('selectedDish');
const quantityInput = document.getElementById('quantity');
const commentInput = document.getElementById('comment');
const orderPrice = document.getElementById('orderPrice');
const orderSummary = document.getElementById('orderSummary');
let selectedDish = null;
function isValidQuantity(value) {
    const trimmed = String(value ?? '').trim();
    if (trimmed === '')
        return false;
    const num = Number(trimmed);
    return Number.isInteger(num) && num >= 1 && num <= 5;
}
function updateOrderPrice() {
    if (!selectedDish) {
        orderPrice.textContent = 'Вартість: оберіть страву';
        return;
    }
    const total = calculateTotal();
    orderPrice.textContent = total === null
        ? `Ціна за порцію: ${selectedDish.price} грн`
        : `Ціна за порцію: ${selectedDish.price} грн · Разом: ${total} грн`;
}
function selectDish(dish) {
    selectedDish = dish;
    selectedDishInput.value = dish.name;
    setFieldError('selectedDish', '');
    updateOrderPrice();
    orderSummary.hidden = true;
    document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(({ studentName: 'nameError', studentClass: 'classError', selectedDish: 'dishError', quantity: 'quantityError' })[fieldId]);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
}
function validateOrder() {
    const nameValid = studentNameInput.value.trim().length >= 2;
    setFieldError('studentName', nameValid ? '' : 'Введіть ім’я учня (мінімум 2 символи).');
    const classValid = studentClassSelect.value !== '';
    setFieldError('studentClass', classValid ? '' : 'Оберіть клас зі списку.');
    const dishValid = Boolean(selectedDish && selectedDishInput.value.trim() !== '');
    setFieldError('selectedDish', dishValid ? '' : 'Оберіть страву в меню.');
    const quantityValid = isValidQuantity(quantityInput.value);
    setFieldError('quantity', quantityValid ? '' : 'Вкажіть цілу кількість порцій від 1 до 5.');
    return nameValid && classValid && dishValid && quantityValid;
}
function calculateTotal() {
    if (!selectedDish || !isValidQuantity(quantityInput.value))
        return null;
    return selectedDish.price * Number(quantityInput.value.trim());
}
function resetConfirmation() {
    orderSummary.hidden = true;
    orderSummary.replaceChildren();
    updateOrderPrice();
}
orderForm.addEventListener('input', resetConfirmation);
orderForm.addEventListener('change', resetConfirmation);
orderForm.addEventListener('submit', event => {
    event.preventDefault();
    orderSummary.hidden = true;
    if (!validateOrder())
        return;
    const total = calculateTotal();
    if (total === null)
        return;
    const title = document.createElement('strong');
    title.textContent = 'Дані перевірено. Навчальне замовлення сформовано. Замовлення не надіслано.';
    const details = document.createElement('p');
    const qty = Number(quantityInput.value.trim());
    const comment = commentInput.value.trim();
    details.textContent = `Учень: ${studentNameInput.value.trim()} (${studentClassSelect.value}) · Страва: ${selectedDish.name} × ${qty} · Сума: ${total} грн${comment ? ` · Коментар: ${comment}` : ''}`;
    orderSummary.replaceChildren(title, details);
    orderSummary.hidden = false;
});
window.CanteenOrder = { selectDish, isValidQuantity };
