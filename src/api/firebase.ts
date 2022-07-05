const firebaseConfig = {
    apiKey: "AIzaSyAI_r1Rs11kIsWJFiCVA4aGt58ffsZrclY",
    authDomain: "mindfolk-raffle-afb92.firebaseapp.com",
    projectId: "mindfolk-raffle-afb92",
    storageBucket: "mindfolk-raffle-afb92.appspot.com",
    messagingSenderId: "106626330620",
    appId: "1:106626330620:web:c3343f7736902e58774c79",
    measurementId: "G-NHD9LYKTVJ"
};
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const db = getFirestore();

export const collectionsInstance = collection(database, "collections");
export const rafflesInstance = collection(database, "raffles");