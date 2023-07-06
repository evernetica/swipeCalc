import { useEffect } from "react";
import { accelerometer, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { Platform } from "react-native";

export const useShakeListener = (callback) => {
  useEffect(() => {
    const SHAKE_THRESHOLD = Platform.OS === "ios" ? 3 : 20;
    const MIN_TIME_BETWEEN_SHAKES_MILLISECS = 1000;
    setUpdateIntervalForType(SensorTypes.accelerometer, 200);
    let lastShakeTime = 0;

    const listener = accelerometer
    .pipe(map(({ x, y, z }) => Math.sqrt(Math.pow(x, 2) +
        Math.pow(y, 2) +
        Math.pow(z, 2)) /* - SensorManager.GRAVITY_EARTH */),
      filter(acceleration => acceleration > SHAKE_THRESHOLD))
    .subscribe(acceleration => {
      const curTime = new Date().getTime();
      if (curTime - lastShakeTime > MIN_TIME_BETWEEN_SHAKES_MILLISECS) {
        lastShakeTime = curTime;
        callback(true);
      }
    });

    return () => {
      listener.unsubscribe();
    };
  }, [callback]);
};
