import React from "react";
import {
  StatusBar
} from "react-native";
import { Text } from "./src/common/components/SimpleComponents/Text";
import { StyledSafeArea } from "./src/common/components/SimpleComponents/StyledSafeArea";
import {
  StyledGestureHandlerRootView
} from "./src/common/components/SimpleComponents/StyledGestureWrapper";
import { Block } from "./src/common/components/SimpleComponents/Block";
import {
  StyledGestureDetector
} from "./src/common/components/SimpleComponents/StyledGestureDetector";
import { useGestureHandler } from "./src/common/hooks/useGestureHandler";


function App(): JSX.Element {
  const { composed, historyText, currentText, isError, number } = useGestureHandler();
  return (
    <StyledSafeArea>
      <StatusBar />
      <StyledGestureHandlerRootView>
        <StyledGestureDetector gesture={composed}>
          <Block width={"100%"} flex={1} bg={"black"}>
            {
              historyText && (
                <Block
                  alignItems={"flex-end"}
                >
                  <Text>History</Text>
                  <Text>{historyText}</Text>
                </Block>)
            }
            <Block
              mt={"10px"}
              minHeight={"100px"}
              paddingVertical={"10px"}
              paddingHorizontal={"10px"}
              borderColor={"orange"}
              bW={"2px"}
              bR={"10px"}
            >
              <Text
                multiline
                color={"white"}
                fontSize={"20px"}
              >
                {currentText}
              </Text>
            </Block>
            {
              isError ? (
                  <Text>
                    Calculation error
                  </Text>
                )
                : null
            }
            <Block
              flex={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text>{number}</Text>
              <Block
                bR={"100px"}
                width={"100px"}
                height={"100px"}
                bg={"rgba(255,165,0,0.5)"}
              />
            </Block>
          </Block>
        </StyledGestureDetector>
      </StyledGestureHandlerRootView>
    </StyledSafeArea>
  );
}

export default App;
