// main.js

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الفواتير
    const invoiceSystem = new InvoiceSystem();
    
    // تعريف العناصر الرئيسية
    const elements = {
        sellBtn: document.getElementById('sellBtn'),
        finalPriceValue: document.getElementById('finalPriceValue'),
        percentDiscountBtn: document.getElementById('percentDiscountBtn'),
        discountPercent: document.getElementById('discountPercent'),
        discountAmount: document.getElementById('discountAmount'),
        reasonInput: document.getElementById('reasonInput'),
        productName: document.getElementById('productName'),
        productImage: document.getElementById('productImage')
    };
    
    // بيانات المنتجات الوهمية
    const mockProducts = {
        "123456789012": {
            name: "شوكولاتة داكنة 100جم",
            price: 25.99,
            quantity: 15,
            image: "https://fakeimg.pl/150x150/?text=شوكولاتة&font=tajawal"
        },
        "987654321098": {
            name: "مشروب غازي 330مل",
            price: 10.50,
            quantity: 30,
            image: "https://fakeimg.pl/150x150/?text=مشروب&font=tajawal"
        },
        "456789123456": {
            name: "أرز بسمتي 5 كجم",
            price: 45.75,
            quantity: 8,
            image: "https://fakeimg.pl/150x150/?text=أرز&font=tajawal"
        }
    };
    
    // متغيرات النظام
    let currentProduct = null;
    let paymentMethod = 'cash';
    
    // دالة عرض التنبيهات
    function showToast(message, type = 'info', duration = 3000) {
        console.log(`[${type}] ${message}`);
        // يمكنك تنفيذ واجهة تنبيهات أفضل هنا
    }
    
    // دالة إعادة تعيين النظام
    function resetSystem() {
        currentProduct = null;
        // أضف أي إعادة تعيين أخرى تحتاجها هنا
    }
    
    // حدث زر البيع
    elements.sellBtn.addEventListener('click', function() {
        if (!currentProduct) {
            showToast('لم يتم اختيار منتج', 'error');
            return;
        }
        
        const finalPrice = parseFloat(elements.finalPriceValue.textContent);
        const discountApplied = finalPrice < currentProduct.price;
        let discountInfo = null;
        
        if (discountApplied) {
            const discountType = elements.percentDiscountBtn.classList.contains('active') ? 'percent' : 'fixed';
            const reason = elements.reasonInput.value.trim() || 'لا يوجد سبب مذكور';
            
            discountInfo = {
                type: discountType,
                value: discountType === 'percent' ? elements.discountPercent.value : elements.discountAmount.value,
                reason: reason
            };
        }
        
        // إنشاء وعرض الفاتورة
        const invoice = invoiceSystem.createInvoice(
            currentProduct,
            finalPrice,
            paymentMethod,
            discountInfo
        );
        
        invoiceSystem.showInvoice(invoice);
        
        // إعادة تعيين النظام
        resetSystem();
        
        showToast('تمت عملية البيع بنجاح', 'success');
    });
    
    // دالة لعرض منتج (لأغراض الاختبار)
    function displayTestProduct() {
        currentProduct = mockProducts["123456789012"];
        elements.productName.textContent = currentProduct.name;
        elements.productImage.src = currentProduct.image;
        elements.finalPriceValue.textContent = currentProduct.price.toFixed(2);
    }
    
    // اختبار العرض (يمكن حذفها لاحقاً)
    displayTestProduct();
});
