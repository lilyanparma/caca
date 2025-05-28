class InvoiceSystem {
    constructor() {
        this.invoiceCounter = 1;
        this.pharmacyName = "صيدلية النخبة";
    }

    createInvoice(product, finalPrice, paymentMethod, discountInfo = null) {
        const now = new Date();
        const invoiceId = 'INV-' + now.getFullYear() + 
                         (now.getMonth()+1).toString().padStart(2, '0') + 
                         now.getDate().toString().padStart(2, '0') + '-' + 
                         this.invoiceCounter.toString().padStart(4, '0');
        
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
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            numberingSystem: 'arab'
        };
        
        const dateStr = date.toLocaleDateString('ar-SA', options);
        const paymentMethodText = this.getPaymentMethodText(invoice.paymentMethod);

        container.innerHTML = `
            <div class="invoice-content" dir="rtl">
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
                            <span>${paymentMethodText}</span>
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

        container.style.display = 'flex';
        
        container.querySelector('#printInvoice').addEventListener('click', () => {
            window.print();
        });
        
        container.querySelector('#closeInvoice').addEventListener('click', () => {
            container.style.display = 'none';
        });
    }

    getPaymentMethodText(method) {
        return {
            'cash': 'نقداً',
            'card': 'بطاقة بنكية',
            'transfer': 'تحويل بنكي'
        }[method] || 'نقداً';
    }

    async saveToDatabase(invoice, database) {
        try {
            const invoiceRef = database.ref('invoices').push();
            await invoiceRef.set(invoice);
            console.log('تم حفظ الفاتورة بنجاح');
        } catch (error) {
            console.error('خطأ في حفظ الفاتورة:', error);
            throw error;
        }
    }
}

const invoiceSystem = new InvoiceSystem();
