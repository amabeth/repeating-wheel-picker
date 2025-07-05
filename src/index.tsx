import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
  VirtualizedList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RepeatingWheelPicker<T>(
  properties: RepeatingWheelPickerProps<T>
) {
  // TODO check input for invalid combinations

  const props = useMemo(() => withDefaults(properties), [properties]);
  const itemMultiplier = useMemo(
    () => Math.max(Math.round(90 / props.data.length), 3),
    [props.data.length]
  );
  const indexDiffTopToCentered = useMemo(
    () => Math.floor(props.itemDisplayCount / 2),
    [props.itemDisplayCount]
  );

  const [initialTop] = useState(
    () =>
      props.initialIndex +
      props.data.length * Math.floor(itemMultiplier / 2) -
      indexDiffTopToCentered
  );

  const [currentTop, setCurrentTop] = useState(initialTop); // first one shown
  const listRef = useRef<VirtualizedList<T>>(null);

  useEffect(() => {
    const selectedElement =
      props.data[(currentTop + indexDiffTopToCentered) % props.data.length]; // centered element

    if (selectedElement !== undefined) {
      props.setSelected(selectedElement);
    }
  }, [currentTop, props.data]);

  return (
    <View
      onLayout={props.containerOnLayout}
      style={{
        ...props.containerStyle,
        height:
          props.itemHeight * props.itemDisplayCount +
          props.containerVerticalPadding * 2,
      }}
    >
      <VirtualizedList<T>
        ref={listRef}
        scrollEnabled={props.enabled}
        getItemCount={() => props.data.length * itemMultiplier}
        initialScrollIndex={initialTop}
        initialNumToRender={props.data.length * itemMultiplier}
        windowSize={props.data.length * itemMultiplier}
        renderItem={({ item, index }) => (
          <Item item={item} props={props} key={index} />
        )}
        getItem={(_, index) =>
          props.data[
            Math.abs(index - indexDiffTopToCentered) % props.data.length
          ]!
        }
        getItemLayout={(_, index) => ({
          length: props.itemHeight,
          offset: itemOffset(
            index,
            props.itemHeight,
            indexDiffTopToCentered,
            props.containerVerticalPadding
          ),
          index: index,
        })}
        keyExtractor={(_, index) => `${index}`}
        // disableIntervalMomentum={true}
        decelerationRate="fast"
        snapToOffsets={offsets(
          props.data.length,
          props.itemHeight,
          itemMultiplier,
          indexDiffTopToCentered,
          props.containerVerticalPadding
        )}
        snapToAlignment="start"
        onMomentumScrollEnd={(event) =>
          onMomentumScrollEnd(
            event.nativeEvent.contentOffset.y,
            setCurrentTop,
            props.data.length,
            props.itemHeight,
            itemMultiplier,
            listRef
          )
        }
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          width: "100%",
        }}
      />

      <View
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      >
        <FrontGradient containerStyle={props.containerStyle} />
      </View>
    </View>
  );
}

function Item<T>({
  item,
  props,
}: {
  item: T;
  props: RepeatingWheelPickerPropsWithDefaults<T>;
}) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "transparent",
        ...props.itemContainerStyle,
        paddingVertical: 0,
        height: props.itemHeight,
      }}
    >
      <Text style={{ textAlign: "center", ...props.itemTextStyle }}>
        {props.getLabel(item)}
      </Text>
    </View>
  );
}

function FrontGradient({ containerStyle }: { containerStyle: ViewStyle }) {
  const containerColor = containerStyle.backgroundColor!.toString();

  return (
    <LinearGradient
      colors={[containerColor, "transparent", containerColor]}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
}

function offsets(
  dataLength: number,
  itemHeight: number,
  itemMultiplier: number,
  indexDiffTopToCentered: number,
  verticalPadding: number
) {
  let offsets = [];

  for (let i = 0; i < dataLength * itemMultiplier; i++) {
    offsets[i] = itemOffset(
      i,
      itemHeight,
      indexDiffTopToCentered,
      verticalPadding
    );
  }

  return offsets;
}

function itemOffset(
  index: number,
  itemHeight: number,
  indexDiffTopToCentered: number,
  verticalPadding: number
) {
  return (index + indexDiffTopToCentered) * itemHeight - verticalPadding;
}

function onMomentumScrollEnd<T>(
  offset: number,
  setCurrent: (n: number) => void,
  dataLength: number,
  itemHeight: number,
  itemMultiplier: number,
  ref: RefObject<VirtualizedList<T> | null>
) {
  const currentIndex = Math.round(offset / itemHeight);

  const currentSection = Math.floor(offset / (dataLength * itemHeight)); // zero-based
  const targetSection = Math.floor(itemMultiplier / 2);

  const targetIndex =
    currentIndex + (targetSection - currentSection) * dataLength;
  setCurrent(targetIndex - 1);

  if (currentSection === targetSection) {
    return;
  }

  const targetOffset = offset + (targetIndex - currentIndex) * itemHeight;
  ref.current?.scrollToOffset({ animated: false, offset: targetOffset });
}

// props

function withDefaults<T>(
  props: RepeatingWheelPickerProps<T>
): RepeatingWheelPickerPropsWithDefaults<T> {
  const defaultBackgroundColor = "black";
  const defaultTextColor = "white";

  return {
    ...props,

    // optional
    containerOnLayout: props.containerOnLayout ?? (() => {}),
    enabled: props.enabled ?? true,

    getLabel: props.getLabel ?? ((t: T) => `${t}`),

    itemDisplayCount: props.itemDisplayCount ?? 3,
    itemHeight: props.itemHeight ?? 35,
    containerVerticalPadding: props.containerVerticalPadding ?? 15,
    containerHorizontalPadding: props.containerHorizontalPadding ?? 15,

    containerStyle: {
      ...props.containerStyle,
      backgroundColor:
        props.containerStyle?.backgroundColor ?? defaultBackgroundColor,
    },
    itemContainerStyle: {
      ...props.itemContainerStyle,
      backgroundColor:
        props.itemContainerStyle?.backgroundColor ?? "transparent",
      justifyContent: props.itemContainerStyle?.justifyContent ?? "center",
    },
    itemTextStyle: {
      ...props.itemTextStyle,
      fontSize: props.itemTextStyle?.fontSize ?? 18,
      color: props.itemTextStyle?.color ?? defaultTextColor,
    },
  };
}

type RepeatingWheelPickerPropsWithDefaults<T> = RepeatingWheelPickerProps<T> &
  Required<Omit<RepeatingWheelPickerProps<T>, "containerRef">>;

export type RepeatingWheelPickerProps<T> = {
  setSelected: (t: T) => void;
  getLabel?: (t: T) => string;
  initialIndex: number;
  data: T[];

  containerOnLayout?: (event: LayoutChangeEvent) => void;
  enabled?: boolean;

  itemDisplayCount?: number;
  itemHeight?: number;

  containerVerticalPadding?: number;
  containerHorizontalPadding?: number;

  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
};
