export class MobilePhone {
    constructor(imei, brand, model, country, price, color) {
        this.imei = imei || "";
        this.brand = brand || "";
        this.model = model || "";
        this.country = country || "Unknown";
        this.price = Number(price) || 0;
        this.color = color || "N/A";
    }

    // Форматированный вывод для интерфейса
    getInfo() {
        return `${this.brand} ${this.model} (${this.country}) — ${this.price} MDL`;
    }

    // Метод для создания объекта из обычного JSON
    static fromJSON(obj) {
        return new MobilePhone(
            obj.imei, 
            obj.brand, 
            obj.model, 
            obj.country, 
            obj.price, 
            obj.color
        );
    }
}

// Оставляем для совместимости, если используешь CommonJS в main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePhone;
}
