importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Helper to get parameters passed during SW registration url
const params = {};
if (self.location && self.location.search) {
  const searchParams = new URLSearchParams(self.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
}

// Re-construct the config
const firebaseConfig = {
  apiKey: params.apiKey || '',
  authDomain: params.authDomain || '',
  projectId: params.projectId || '',
  storageBucket: params.storageBucket || '',
  messagingSenderId: params.messagingSenderId || '',
  appId: params.appId || '',
};

if (firebaseConfig.messagingSenderId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'SS Fitness Alert';
    const notificationOptions = {
      body: payload.notification?.body || 'New update available.',
      icon: payload.notification?.icon || '/wp-content/uploads/sites/57/2025/05/Progym-Fav-Icon.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn('[firebase-messaging-sw.js] Firebase config messagingSenderId not found in SW query params.');
}
