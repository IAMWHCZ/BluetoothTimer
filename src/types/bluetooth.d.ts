export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  deviceType: "audio" | "input" | "phone" | "computer" | "other";
  signalStrength: number; // -100 to 0 dBm
  isConnected: boolean;
  isPaired: boolean;
  batteryLevel?: number; // 0-100%
  lastConnected?: Date;
}

export interface ScanStatus {
  isScanning: boolean;
  devicesFound: number;
}
