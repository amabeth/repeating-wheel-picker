import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { type LayoutChangeEvent, Text, type TextStyle, View, type ViewStyle, VirtualizedList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Provides a wheel picker with repeating data that can be infinitely scrolled.
 *
 * @param properties configuration of the wheel picker
 */
export function RepeatingWheelPicker<T>(
  properties: RepeatingWheelPickerProps<T>
) {
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
            props.itemDisplayCount,
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
          props.itemDisplayCount,
          props.itemHeight,
          itemMultiplier,
          indexDiffTopToCentered,
          props.containerVerticalPadding
        )}
        snapToAlignment="center"
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
  itemDisplayCount: number,
  itemHeight: number,
  itemMultiplier: number,
  indexDiffTopToCentered: number,
  verticalPadding: number
) {
  let offsets = [];

  for (let i = 0; i < dataLength * itemMultiplier; i++) {
    offsets[i] = itemOffset(
      i,
      itemDisplayCount,
      itemHeight,
      indexDiffTopToCentered,
      verticalPadding
    );
  }

  return offsets;
}

function itemOffset(
  index: number,
  itemDisplayCount: number,
  itemHeight: number,
  indexDiffTopToCentered: number,
  verticalPadding: number
) {
  const modifierForEvenCount = itemDisplayCount % 2 === 0 ?
    itemHeight / 2 :
    0;

  return (index + indexDiffTopToCentered) * itemHeight - verticalPadding + modifierForEvenCount;
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

  validateProps(props);

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

function validateProps<T>(props: RepeatingWheelPickerProps<T>) {
  if (props.initialIndex < 0 || props.initialIndex >= props.data.length) {
    throw InvalidPropertiesError(
      "initialIndex",
      String(props.initialIndex),
      "has to be in range [0, data.length)"
    );
  }

  if (props.data.length < 2) {
    throw InvalidPropertiesError(
      "data.length",
      String(props.data.length),
      "has to be larger than 1"
    );
  }

  if (props.itemDisplayCount !== undefined && props.itemDisplayCount < 1) {
    throw InvalidPropertiesError(
      "itemDisplayCount",
      String(props.itemDisplayCount),
      "has to be larger than 0"
    );
  }

  if (props.itemHeight !== undefined && props.itemHeight > 0) {
    throw InvalidPropertiesError(
      "itemHeight",
      String(props.itemHeight),
      "has to be larger than 0"
    );
  }
}

function InvalidPropertiesError(
  propertyName: string,
  propertyValue: string,
  violatedConstraint: string
) {
  return Error(
    `Value "${propertyValue}" is invalid for property "${propertyName}": ${violatedConstraint}`
  ) as InvalidPropertiesError;
}

interface InvalidPropertiesError extends Error {
  name: "InvalidPropertiesError";
}

type RepeatingWheelPickerPropsWithDefaults<T> = RepeatingWheelPickerProps<T> &
  Required<Omit<RepeatingWheelPickerProps<T>, "containerRef">>;

/**
 *
 */
export type RepeatingWheelPickerProps<T> = {
  /**
   * Function to set currently selected element and use it in your application.
   *
   * @example
   * ```ts
   * const [selected, setSelected] = useState(0);
   *
   * return (
   *   <RepeatingWheelPicker
   *     setSelected={setSelected}
   *     //...
   *   />
   * );
   * ```
   *
   * @param t currently selected element
   */
  setSelected: (t: T) => void;
  /**
   * Function to retrieve the text to display for an element as a label.
   *
   * @defaultValue
   * ```ts
   * (t: T) => `${t}`
   * ```
   *
   * @param t element to retrieve label for
   */
  getLabel?: (t: T) => string;
  /**
   * Index to initially center.
   */
  initialIndex: number;
  /**
   * Data to display.
   */
  data: T[];

  /**
   * Function called when the layout of the container changes.
   *
   * _Example usage for monitoring the container's height:_
   * ```ts
   * const [pickerHeight, setPickerHeight] = useState<number>(0);
   *
   * const onLayout = useCallback((event: LayoutChangeEvent) => {
   *   const { height } = event.nativeEvent.layout;
   *   setPickerHeight(height);
   * }, []);
   *
   * return (
   *   <View style={{flexDirection: "row"}}>
   *     <View style={{height: height}}>
   *       <Text>Picker label</Text>
   *     </View>
   *     <RepeatingWheelPicker
   *       //...
   *       containerOnLayout={onLayout}
   *     />
   *   </View>
   * );
   * ```
   *
   * @defaultValue () => {}
   *
   * @param event layout change event that triggered `onLayout`
   */
  containerOnLayout?: (event: LayoutChangeEvent) => void;
  /**
   * Enables / disables scrolling of the wheel picker.
   *
   * @defaultValue true
   */
  enabled?: boolean;

  /**
   * Number of items to display.
   *
   * @defaultValue 3
   */
  itemDisplayCount?: number;
  /**
   * Height per displayed item.
   *
   * @defaultValue 35
   */
  itemHeight?: number;

  /**
   * Vertical padding for the container of the wheel picker.
   *
   * @defaultValue 15
   */
  containerVerticalPadding?: number;
  /**
   * Horizontal padding for the container of the wheel picker.
   *
   * @defaultValue 15
   */
  containerHorizontalPadding?: number;

  /**
   * Styling for the container of the wheel picker.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "black"
   *   }
   * ```
   */
  containerStyle?: ViewStyle;
  /**
   * Styling for the container of each element.
   *
   * @defaultValue
   * ```ts
   *   {
   *     backgroundColor: "transparent",
   *     justifyContent: "center"
   *   }
   * ```
   */
  itemContainerStyle?: ViewStyle;
  /**
   * Styling for the text of the elements.
   *
   * @defaultValue
   * ```ts
   *   {
   *     fontSize: "18",
   *     color: "white"
   *   }
   * ```
   */
  itemTextStyle?: TextStyle;
};
