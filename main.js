// تهيئة نظام الفواتير
const invoiceSystem = new InvoiceSystem();

// عند حدوث عملية بيع
function processSale(product, finalPrice, paymentMethod, discountInfo = null) {
    // ... أي معالجة تحتاجها قبل إنشاء الفاتورة
    
    // إنشاء وعرض الفاتورة
    const invoice = invoiceSystem.createInvoice(product, finalPrice, paymentMethod, discountInfo);
    invoiceSystem.showInvoice(invoice);
    
    // ... أي معالجة إضافية بعد إنشاء الفاتورة
}

// مثال استخدام:
const productExample = {
    name: "شوكولاتة داكنة 100جم",
    price: 25.99
};

processSale(productExample, 23.39, 'cash', {
    type: 'percent',
    value: 10,
    reason: 'خصم موسمي'
});
