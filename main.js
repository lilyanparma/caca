// main.js
import { db } from './firebase-config.js';
import InvoiceSystem from './invoice-system.js';
import { collection, getDocs, query, where } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', async () => {
    // تهيئة النظام
    const invoiceSystem = new InvoiceSystem();
    
    // عناصر واجهة المستخدم
    const elements = {
        barcodeInput: document.getElementById('barcodeInput'),
        productName: document.getElementById('productName'),
        productImage: document.getElementById('productImage'),
        productPrice: document.getElementById('productPrice'),
        productQuantity: document.getElementById('productQuantity'),
        sellBtn: document.getElementById('sellBtn'),
        invoicesList: document.getElementById('invoicesList')
    };
    
    // متغيرات النظام
    let currentCart = [];
    let currentCustomer = null;

    // دالة البحث عن منتج بالباركود
    async function searchProduct(barcode) {
        try {
            const q = query(collection(db, "products"), where("barcode", "==", barcode));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                showToast("المنتج غير موجود", "error");
                return null;
            }
            
            return {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            };
        } catch (error) {
            console.error("Error searching product: ", error);
            showToast("حدث خطأ في البحث عن المنتج", "error");
            return null;
        }
    }

    // دالة عرض المنتج
    function displayProduct(product) {
        elements.productName.textContent = product.name;
        elements.productPrice.textContent = product.price.toFixed(2) + ' ر.س';
        elements.productQuantity.textContent = `المخزون: ${product.quantity}`;
        elements.productImage.src = product.image || 'images/default-product.png';
        elements.productImage.onerror = () => {
            elements.productImage.src = 'images/default-product.png';
        };
    }

    // دالة إضافة منتج للسلة
    function addToCart(product, quantity = 1) {
        const existingItem = currentCart.find(item => item.productId === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentCart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                originalQuantity: product.quantity
            });
        }
        
        updateCartDisplay();
    }

    // دالة تحديث عرض السلة
    function updateCartDisplay() {
        // هنا يمكنك تحديث واجهة السلة حسب احتياجاتك
        console.log("السلة الحالية:", currentCart);
    }

    // دالة إتمام عملية البيع
    async function completeSale(paymentMethod) {
        if (currentCart.length === 0) {
            showToast("السلة فارغة", "error");
            return;
        }
        
        try {
            // تحضير بيانات الفاتورة
            const invoiceData = {
                customer: currentCustomer || { name: "عميل نقدي" },
                items: currentCart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    newQuantity: item.originalQuantity - item.quantity
                })),
                subtotal: currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                paymentMethod: paymentMethod,
                status: "completed"
            };
            
            // إنشاء الفاتورة
            const invoiceId = await invoiceSystem.createInvoice(invoiceData);
            
            showToast(`تم إتمام البيع بنجاح - رقم الفاتورة: ${invoiceId}`, "success");
            
            // إعادة تعيين النظام
            currentCart = [];
            updateCartDisplay();
            
        } catch (error) {
            console.error("Error completing sale: ", error);
            showToast("حدث خطأ أثناء إتمام البيع", "error");
        }
    }

    // أحداث واجهة المستخدم
    elements.barcodeInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const barcode = elements.barcodeInput.value.trim();
            if (!barcode) return;
            
            const product = await searchProduct(barcode);
            if (product) {
                displayProduct(product);
                addToCart(product, 1);
                elements.barcodeInput.value = '';
            }
        }
    });

    elements.sellBtn.addEventListener('click', () => {
        completeSale('cash'); // يمكنك تغيير طريقة الدفع حسب الاختيار
    });

    // تحميل المنتجات عند بدء التشغيل
    async function loadInitialData() {
        try {
            const products = await invoiceSystem.getProducts();
            console.log("المنتجات المحملة:", products);
        } catch (error) {
            console.error("Error loading initial data: ", error);
        }
    }

    loadInitialData();
});

// دالة عرض التنبيهات
function showToast(message, type = 'info') {
    console.log(`[${type}] ${message}`);
    // يمكنك استبدال هذا بتنفيذ واجهة تنبيهات أفضل
}
