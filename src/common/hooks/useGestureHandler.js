import React, { useState } from "react";
import { useShakeListener } from "./useShakeListener";
import { Gesture } from "react-native-gesture-handler";

let interval = null;

export const useGestureHandler = () => {
  const [historyText, setHistoryText] = useState("");
  const [currentText, setCurrentText] = React.useState("22 + 44 + 33");
  const [number, setNumber] = React.useState(0);
  const [isError, setIsError] = React.useState(false);

  const handleShake = () => {
    const splitedCalculation = currentText.split(" ").filter(item => item !== "");
    splitedCalculation.pop();
    setCurrentText(splitedCalculation.join(" "));
  };
  useShakeListener(handleShake);
  const handleSwipeDirection = (direction) => {
    const splitedCalculation = currentText.split(" ").filter(item => item !== "");
    switch (direction) {
      case "down":
        setCurrentText(current => {
          if (!isNaN(Number(splitedCalculation[splitedCalculation.length - 1]))) {
            return current + " / ";
          } else {
            splitedCalculation[splitedCalculation.length - 1] = " / ";
            return splitedCalculation.join(" ");
          }
        });
        break;
      case "up":
        setCurrentText(current => {
          if (!isNaN(Number(splitedCalculation[splitedCalculation.length - 1]))) {
            return current + " * ";
          } else {
            splitedCalculation[splitedCalculation.length - 1] = " * ";
            return splitedCalculation.join(" ");
          }
        });
        break;
      case "right":
        setCurrentText(current => {
          if (!isNaN(Number(splitedCalculation[splitedCalculation.length - 1]))) {
            return current + " + ";
          } else {
            splitedCalculation[splitedCalculation.length - 1] = " + ";
            return splitedCalculation.join(" ");
          }
        });
        break;
      case "left":
        setCurrentText(current => {
          if (!isNaN(Number(splitedCalculation[splitedCalculation.length - 1]))) {
            return current + " - ";
          } else {
            splitedCalculation[splitedCalculation.length - 1] = " - ";
            return splitedCalculation.join(" ");
          }
        });
        break;
    }
  };
  const dragGesture = Gesture.Pan()
  .onEnd((e) => {
    const { velocityX, velocityY } = e;
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      if (velocityX > 0) {
        handleSwipeDirection("right");
      }
      if (velocityX < 0) {
        handleSwipeDirection("left");
      }
    } else {
      if (velocityY < 0) {
        handleSwipeDirection("up");
      }
      if (velocityY > 0) {
        handleSwipeDirection("down");
      }
    }
  });

  const multiSwipe = Gesture.Pan().minPointers(3).maxPointers(3)
  .onEnd(() => {
    setCurrentText("");
    setIsError(false);
    setHistoryText("");
  });
  const callInterval = (intervalTime) => {
    let updatesCount = 0;
    interval = setInterval(() => {
      setNumber(current => current + 1);
      if (updatesCount > 2) {
        intervalTime = 0.5 * intervalTime;
        clearInterval(interval);
        callInterval(intervalTime);
      } else {
        updatesCount++;
      }
    }, intervalTime);
  };

  const longPressGesture = Gesture.LongPress()
  .onStart((_event) => {
    callInterval(1000);
  }).onEnd((_event) => {
    clearInterval(interval);
    setCurrentText(currentTextValue => currentTextValue + number);
    setNumber(0);
  });
  const tapGesture = Gesture.Tap().numberOfTaps(2).onEnd((_event) => {
    try {
      const calculatedValue = eval(currentText);
      if (!isNaN(calculatedValue) && isFinite(calculatedValue)) {
        setHistoryText(currentHistoryText => (currentHistoryText + currentText + " \n " + calculatedValue));
        setCurrentText(String(calculatedValue));
      } else {
        setIsError(true);
      }
    }
    catch (e) {
      console.log(e);
      setIsError(true);
    }
  });
  const composed = Gesture.Race(dragGesture, longPressGesture, tapGesture, multiSwipe);
  return { composed, currentText, historyText, isError, number };
};
