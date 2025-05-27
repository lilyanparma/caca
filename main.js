// تهيئة نظام الفواتير
const invoiceSystem = new InvoiceSystem();

// عند حدوث عملية بيع
function processSale(product, finalPrice, paymentMethod, discountInfo = null) {
    // ... أي معالجة تحتاجها قبل إنشاء الفاتورة
    
    // إنشاء وعرض الفاتورة
    const invoice = invoiceSystem.createInvoice(product, finalPrice, paymentMethod, discountInfo);
    invoiceSystem.showInvoice(invoice);
    
