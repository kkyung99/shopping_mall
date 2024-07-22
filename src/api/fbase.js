// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(app);
export const db = getDatabase(app);

export async function addProduct(product, image) {
  const id = uuid();
  const time = new Date().getTime();
  return set(ref(db, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(","),
    time,
  });
}

// 상품 가져오기
export async function getProduct() {
  return get(ref(db, "products")).then((snapshot) => {
    if (snapshot.exists()) {
      const products = Object.values(snapshot.val());
      products.sort((a, b) => b.time - a.time);
      return products;
    }
    return [];
  });
}

export async function removeProduct(id) {
  return await remove(ref(db, `products/${id}`));
}

// 장바구니 가져오기
export async function getCart(userId) {
  return get(ref(db, `carts/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {};
    const products = [];
    for (const productId in items) {
      for (const option in items[productId]) {
        products.push(items[productId][option]);
      }
    }
    return products;
  });
}

// 장바구니 추가하기 + 이미 있으면 선택한 quantity 만큼 더해주기
export async function addCart(userId, product) {
  const snapshot = await get(ref(db, `carts/${userId}`));
  const cartData = snapshot.val() || {};

  let existsData;
  for (const productId in cartData) {
    for (const productOption in cartData[productId]) {
      const item = cartData[productId][productOption];
      if (item.id === product.id && item.option === product.option) {
        existsData = item;
        break;
      }
    }
    if (existsData) break;
  }
  if (existsData) {
    await set(
      ref(db, `carts/${userId}/${existsData.id}/${existsData.option}`),
      {
        ...existsData,
        quantity: existsData.quantity + product.quantity,
      }
    );
  } else {
    await set(
      ref(db, `carts/${userId}/${product.id}/${product.option}`),
      product
    );
  }
}

// 장바구니 quantity update
export async function updateCart(userId, product) {
  return set(
    ref(db, `carts/${userId}/${product.id}/${product.option}`),
    product
  );
}

export async function removeCart(userId, productId, productOption) {
  return await remove(ref(db, `carts/${userId}/${productId}/${productOption}`));
}

export async function removeCartAll(userId) {
  return await remove(ref(db, `carts/${userId}/`));
}

// 주문 내역 가져오기
export async function getOrders(userId) {
  return get(ref(db, `orders/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {};
    let orders = Object.values(items);
    orders.sort((a, b) => b.time - a.time);
    return orders;
  });
}

export async function addOrder(userId, orderData, products) {
  const time = new Date().getTime();

  const order = {
    time,
    orderData,
    orderProducts: {}, // 빈 객체로 초기화
  };

  // 각 상품을 자신의 ID로 저장
  products.forEach((product) => {
    const productId = product.id; // 상품의 ID를 가져옴
    order.orderProducts[productId] = { ...product }; // products 객체에 상품 추가
  });

  return await set(ref(db, `orders/${userId}/${orderData.orderId}`), order);
}
