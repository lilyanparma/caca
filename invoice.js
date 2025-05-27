// invoice.js

class InvoiceSystem {
    constructor() {
        this.invoiceCounter = 1;
        this.pharmacyName = "صيدلية النخبة";
    }

    createInvoice(product, finalPrice, paymentMethod, discountInfo = null) {
        const now = new Date();
        const invoiceId = 'INV-' + now.getFullYear() + (now.getMonth()+1).toString().padStart(2, '0') + 
                          now.getDate().toString().padStart(2, '0') + '-' + this.invoiceCounter.toString().padStart(4, '0');
        
        const invoice = {
            id: invoiceId,
            date: now.toISOString(),
            pharmacy: this.pharmacyName,
            product: product.name,
            originalPrice: product.price,
            finalPrice: finalPrice,
            paymentMethod: paymentMethod,
            discount: discountInfo
        };
        
        this.invoiceCounter++;
        return invoice;
    }

    displayInvoice(invoice, container) {
        const date = new Date(invoice.date);
        const dateStr = date.toLocaleDateString('ar-SA') + ' ' + 
                        date.toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'});
        
        container.innerHTML = `
            <div class="invoice-content">
                <div class="invoice-header">
                    <h2><i class="fas fa-receipt"></i> فاتورة بيع</h2>
                </div>
                <div class="invoice-body">
                    <div class="invoice-pharmacy">${invoice.pharmacy}</div>
                    <div class="invoice-details">
                        <div class="invoice-row">
                            <span>رقم الفاتورة:</span>
                            <span>${invoice.id}</span>
                        </div>
                        <div class="invoice-row">
                            <span>التاريخ والوقت:</span>
                            <span>${dateStr}</span>
                        </div>
                        <div class="invoice-row">
                            <span>المنتج:</span>
                            <span>${invoice.product}</span>
                        </div>
                        <div class="invoice-row">
                            <span>السعر الأصلي:</span>
                            <span>${invoice.originalPrice.toFixed(2)} ر.س</span>
                        </div>
                        ${invoice.discount ? `
                        <div class="invoice-row">
                            <span>الخصم:</span>
                            <span>${(invoice.originalPrice - invoice.finalPrice).toFixed(2)} ر.س 
                            ${invoice.discount.type === 'percent' ? `(${invoice.discount.value}%)` : ''}</span>
                        </div>
                        <div class="invoice-row">
                            <span>سبب الخصم:</span>
                            <span>${invoice.discount.reason || 'لا يوجد'}</span>
                        </div>
                        ` : ''}
                        <div class="invoice-row total">
                            <span>المجموع:</span>
                            <span>${invoice.finalPrice.toFixed(2)} ر.س</span>
                        </div>
                        <div class="invoice-row">
                            <span>طريقة الدفع:</span>
                            <span>${this.getPaymentMethodText(invoice.paymentMethod)}</span>
                        </div>
                    </div>
                    <div class="invoice-actions">
                        <button id="printInvoice" class="btn btn-primary">
                            <i class="fas fa-print"></i> طباعة
                        </button>
                        <button id="closeInvoice" class="btn btn-success">
                            <i class="fas fa-times"></i> إغلاق
                        </button>
                    </div>
                </div>
                <div class="invoice-footer">
                    شكراً لثقتكم بنا - للاستفسار: 0551234567
                </div>
            </div>
        `;

        // إضافة أحداث الأزرار
        container.querySelector('#printInvoice').addEventListener('click', () => window.print());
        container.querySelector('#closeInvoice').addEventListener('click', () => {
            container.style.display = 'none';
        });
    }

    getPaymentMethodText(method) {
        const methods = {
            'cash': 'نقداً',
            'card': 'بطاقة بنكية',
            'transfer': 'تحويل بنكي'
        };
        return methods[method] || 'نقداً';
    }

    saveToDatabase(invoice, database) {
        const invoiceRef = database.ref('invoices').push();
        return invoiceRef.set(invoice);
    }
}

// إنشاء نسخة وحيدة من النظام
const invoiceSystem = new InvoiceSystem();
