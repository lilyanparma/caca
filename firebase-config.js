// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

export { db, auth };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// المراجع الأساسية
const db = firebase.firestore();
const productsRef = db.collection("products");
const salesRef = db.collection("sales");
const inventoryRef = db.collection("inventory");

// دالة لإضافة منتج جديد
async function addProduct(productData) {
  try {
    const docRef = await productsRef.add(productData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
}

// دالة للبحث عن منتج بواسطة الباركود
async function getProductByBarcode(barcode) {
  try {
    const snapshot = await productsRef.where("barcode", "==", barcode).get();
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
    const docRef = await salesRef.add(saleData);
    
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
    const productRef = productsRef.doc(productId);
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(productRef);
      if (!doc.exists) throw "Document does not exist!";
      
      const newQuantity = doc.data().quantity + quantityChange;
      if (newQuantity < 0) throw "Insufficient inventory!";
      
      transaction.update(productRef, { quantity: newQuantity });
    });
  } catch (error) {
    console.error("Error updating inventory: ", error);
    throw error;
  }
}

// تصدير الدوال للاستخدام في ملفات أخرى
export {
  db,
  productsRef,
  salesRef,
  addProduct,
  getProductByBarcode,
  recordSale,
  updateInventory
};
