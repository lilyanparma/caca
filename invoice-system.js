// invoice-system.js
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

class InvoiceSystem {
    constructor() {
        this.invoices = [];
        this.pharmacyName = "صيدلية النخبة";
    }

    async createInvoice(invoiceData) {
        try {
            // 1. حفظ الفاتورة في Firestore
            const docRef = await addDoc(collection(db, "invoices"), {
                ...invoiceData,
                createdAt: new Date().toISOString()
            });
            
            // 2. تحديث مخزون المنتجات
            await this.updateProductStock(invoiceData.items);
            
            console.log("تم إنشاء الفاتورة بنجاح بمعرف:", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    }

    async updateProductStock(items) {
        try {
            const batchUpdates = items.map(async (item) => {
                const productRef = doc(db, "products", item.productId);
                await updateDoc(productRef, {
                    quantity: item.newQuantity
                });
            });
            
            await Promise.all(batchUpdates);
        } catch (error) {
            console.error("Error updating product stock: ", error);
            throw error;
        }
    }

    async getInvoices() {
        try {
            const querySnapshot = await getDocs(collection(db, "invoices"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting invoices: ", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting products: ", error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const productDoc = await getDoc(doc(db, "products", productId));
            return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } : null;
        } catch (error) {
            console.error("Error getting product: ", error);
            throw error;
        }
    }
}

export default InvoiceSystem;
