// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, query, where, addDoc, runTransaction } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRtJBPOjpfXXfsaDo98E_NTT7KWzz8gj4",
  authDomain: "pharmacy-system-9def6.firebaseapp.com",
  databaseURL: "https://pharmacy-system-9def6-default-rtdb.firebaseio.com",
  projectId: "pharmacy-system-9def6",
  storageBucket: "pharmacy-system-9def6.firebasestorage.app",
  messagingSenderId: "630855008414",
  appId: "1:630855008414:web:b464bcb81c8a2091d0fb8f",
  measurementId: "G-LC5NDKP6QZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// تعريف المراجع الأساسية
const productsRef = collection(db, "products");
const salesRef = collection(db, "sales");

// دالة لإضافة منتج جديد
async function addProduct(productData) {
  try {
    const docRef = await addDoc(productsRef, productData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
}

// دالة للبحث عن منتج بواسطة الباركود
async function getProductByBarcode(barcode) {
  try {
    const q = query(productsRef, where("barcode", "==", barcode));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const product = snapshot.docs[0].data();
    product.id = snapshot.docs[0].id;
    return product;
  } catch (error) {
    console.error("Error getting product: ", error);
    throw error;
  }
}

// دالة لتسجيل عملية بيع
async function recordSale(saleData) {
  try {
    const docRef = await addDoc(salesRef, saleData);
    
    // تحديث المخزون
    await updateInventory(saleData.productId, -saleData.quantity);
    
    return docRef.id;
  } catch (error) {
    console.error("Error recording sale: ", error);
    throw error;
  }
}

// دالة لتحديث المخزون
async function updateInventory(productId, quantityChange) {
  try {
    const productRef = doc(db, "products", productId);
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) throw "المنتج غير موجود!";
      
      const newQuantity = productDoc.data().quantity + quantityChange;
      if (newQuantity < 0) throw "لا يوجد مخزون كافي!";
      
      transaction.update(productRef, { quantity: newQuantity });
    });
  } catch (error) {
    console.error("Error updating inventory: ", error);
    throw error;
  }
}

// تصدير الدوال والمراجع
export {
  db,
  auth,
  productsRef,
  salesRef,
  addProduct,
  getProductByBarcode,
  recordSale,
  updateInventory
};
