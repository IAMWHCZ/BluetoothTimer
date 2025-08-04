import { useState, useEffect, useCallback } from "react";
import {
  Bluetooth,
  Signal,
  Battery,
  Smartphone,
  Headphones,
  Keyboard,
  Laptop,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  deviceType: "audio" | "input" | "phone" | "computer" | "other";
  signalStrength: number;
  isConnected: boolean;
  isPaired: boolean;
  batteryLevel?: number;
  lastConnected?: Date;
}

export const DeviceTable = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const mockDevices: BluetoothDevice[] = [
    {
      id: "1",
      name: "AirPods Pro",
      address: "A4:83:E7:12:34:56",
      deviceType: "audio",
      signalStrength: -45,
      isConnected: true,
      isPaired: true,
      batteryLevel: 85,
      lastConnected: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      name: "iPhone 15",
      address: "B8:53:AC:78:90:12",
      deviceType: "phone",
      signalStrength: -62,
      isConnected: false,
      isPaired: true,
      batteryLevel: 72,
      lastConnected: new Date("2024-01-14T15:45:00"),
    },
    {
      id: "3",
      name: "Magic Keyboard",
      address: "C4:D2:F5:23:45:67",
      deviceType: "input",
      signalStrength: -38,
      isConnected: true,
      isPaired: true,
      batteryLevel: 95,
    },
    {
      id: "4",
      name: "Dell XPS 13",
      address: "D6:E8:92:34:56:78",
      deviceType: "computer",
      signalStrength: -55,
      isConnected: false,
      isPaired: false,
    },
    {
      id: "5",
      name: "Sony WH-1000XM4",
      address: "E2:F4:A1:67:89:01",
      deviceType: "audio",
      signalStrength: -71,
      isConnected: false,
      isPaired: true,
      batteryLevel: 45,
    },
  ];

  useEffect(() => {
    setDevices(mockDevices);
  }, []);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newDevice: BluetoothDevice = {
        id: Date.now().toString(),
        name: "New Device",
        address: "FF:EE:DD:CC:BB:AA",
        deviceType: "other",
        signalStrength: -58,
        isConnected: false,
        isPaired: false,
      };
      setDevices((prev) => [...prev, newDevice]);
    }, 3000);
  }, []);

  const connectDevice = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, isConnected: true, lastConnected: new Date() }
          : { ...device, isConnected: false }
      )
    );
  }, []);

  const disconnectDevice = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, isConnected: false } : device
      )
    );
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Headphones className="w-5 h-5" />;
      case "phone":
        return <Smartphone className="w-5 h-5" />;
      case "input":
        return <Keyboard className="w-5 h-5" />;
      case "computer":
        return <Laptop className="w-5 h-5" />;
      default:
        return <Bluetooth className="w-5 h-5" />;
    }
  };

  const getSignalColor = (strength: number) => {
    if (strength > -50) return "text-green-500";
    if (strength > -70) return "text-yellow-500";
    return "text-red-500";
  };

  const formatLastConnected = (date?: Date) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* 响应式头部工具栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Bluetooth Devices
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {devices.length} devices found
            </span>
          </div>
          <Button
            onClick={startScan}
            disabled={isScanning}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex items-center justify-center space-x-2"
          >
            <Bluetooth
              className={cn("w-4 h-4", isScanning && "animate-pulse")}
            />
            <span>{isScanning ? "Scanning..." : "Scan"}</span>
          </Button>
        </div>
      </div>

      {/* 响应式设备列表 */}
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {devices.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Bluetooth className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                No Bluetooth devices found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={cn(
                    "p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                    selectedDevice === device.id &&
                      "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {device.name}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {device.isConnected && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                Connected
                              </span>
                            )}
                            {device.isPaired && !device.isConnected && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                Paired
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {device.address}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Signal
                                className={cn(
                                  "w-3 h-3",
                                  getSignalColor(device.signalStrength)
                                )}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {device.signalStrength}dBm
                              </span>
                            </div>
                            {device.batteryLevel && (
                              <div className="flex items-center space-x-1">
                                <Battery className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {device.batteryLevel}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                        {formatLastConnected(device.lastConnected)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                          {formatLastConnected(device.lastConnected)}
                        </span>
                        {device.isPaired && (
                          <Button
                            size="sm"
                            variant={device.isConnected ? "outline" : "default"}
                            className="text-xs sm:text-sm px-3 py-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (device.isConnected) {
                                disconnectDevice(device.id);
                              } else {
                                connectDevice(device.id);
                              }
                            }}
                          >
                            {device.isConnected ? "Disconnect" : "Connect"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1 sm:p-2 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
