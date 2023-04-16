export interface PushNotificationSubscription {
  endpoint: string;
  address: string;
  expirationTime?: Date;
  keys: Keys;
}

interface Keys {
  p256dh: string;
  auth: string;
}

