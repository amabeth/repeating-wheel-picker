import { type RefObject, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  VirtualizedList,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ITEM_COUNT_MULTIPLIER = 3;
const ITEM_DISPLAY_COUNT = 3;

const DIST_TOP_TO_CENTERED = Math.floor(ITEM_DISPLAY_COUNT / 2);

export default function RepeatingWheelPicker<T>(
  properties: RepeatingWheelPickerProps<T>
) {
  const [props] = useState(() => withDefaults(properties));
  const [initialIndex] = useState(
    props.initialIndex +
      props.data.length * Math.floor(ITEM_COUNT_MULTIPLIER / 2) -
      DIST_TOP_TO_CENTERED
  );

  const [current, setCurrent] = useState(initialIndex); // current is first one shown
  const listRef = useRef<VirtualizedList<T>>(null);

  useEffect(() => {
    const selected =
      props.data[(current + DIST_TOP_TO_CENTERED) % props.data.length];

    if (selected !== undefined) {
      props.setSelected(selected);
    }
  }, [current, props]);

  return (
    <View
      style={{
        ...props.containerStyle,
        height:
          props.itemHeight * ITEM_DISPLAY_COUNT +
          props.containerVerticalPadding * 2,
      }}
    >
      <VirtualizedList<T>
        ref={listRef}
        // focusHook={useFocusEffect}

        getItemCount={() => props.data.length * ITEM_COUNT_MULTIPLIER}
        initialScrollIndex={initialIndex}
        initialNumToRender={props.data.length * ITEM_COUNT_MULTIPLIER}
        windowSize={props.data.length * ITEM_COUNT_MULTIPLIER}
        renderItem={({ item, index }) => (
          <Item item={item} props={props} key={index} />
        )}
        getItem={(_, index) => props.data[index % props.data.length]!}
        getItemLayout={(_, index) => ({
          length: props.itemHeight,
          offset: props.itemHeight * index,
          index: index,
        })}
        keyExtractor={(_, index) => `${index}`}
        // disableIntervalMomentum={true}
        decelerationRate="fast"
        snapToOffsets={getOffsets(props)}
        snapToAlignment="center"
        onMomentumScrollEnd={(event) =>
          onMomentumScrollEnd(
            event.nativeEvent.contentOffset.y,
            setCurrent,
            props,
            listRef
          )
        }
        showsVerticalScrollIndicator={false}
        style={{
          paddingVertical: props.containerVerticalPadding,
          paddingHorizontal: props.containerHorizontalPadding,
          flex: 1,
          width: "100%",
        }}
      />

      <View
        style={{
          ...props.containerStyle,
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
        ...containerStyle,
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
}

function getOffsets<T>(props: RepeatingWheelPickerPropsWithDefaults<T>) {
  let offsets = [];

  for (let i = 0; i < props.data.length * ITEM_COUNT_MULTIPLIER; i++) {
    offsets[i] = i * props.itemHeight;
  }

  return offsets;
}

function onMomentumScrollEnd<T>(
  offset: number,
  setCurrent: (n: number) => void,
  props: RepeatingWheelPickerPropsWithDefaults<T>,
  ref: RefObject<VirtualizedList<T> | null>
) {
  const dataLength = props.data.length;

  const currentIndex = Math.round(offset / props.itemHeight);

  const currentSection = Math.floor(offset / (dataLength * props.itemHeight)); // zero-based
  const targetSection = Math.floor(ITEM_COUNT_MULTIPLIER / 2);

  const targetIndex =
    currentIndex + (targetSection - currentSection) * dataLength;
  setCurrent(targetIndex);

  if (currentSection === targetSection) {
    return;
  }

  const targetOffset = offset + (targetIndex - currentIndex) * props.itemHeight;
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
    enabled: props.enabled ?? true,

    getLabel: props.getLabel ?? ((t: T) => `${t}`),

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
    },
    itemTextStyle: {
      ...props.itemTextStyle,
      fontSize: props.itemTextStyle?.fontSize ?? 18,
      color: props.itemTextStyle?.color ?? defaultTextColor,
    },
  };
}

type RepeatingWheelPickerPropsWithDefaults<T> = Required<
  RepeatingWheelPickerProps<T>
>;

export type RepeatingWheelPickerProps<T> = {
  setSelected: (t: T) => void;
  getLabel?: (t: T) => string;
  initialIndex: number;
  data: T[];

  enabled?: boolean;

  itemHeight?: number;
  containerVerticalPadding?: number;
  containerHorizontalPadding?: number;

  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
};
