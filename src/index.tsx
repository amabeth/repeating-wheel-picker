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
  // set defaults for all unprovided optional properties
  const props = useMemo(() => withDefaults(properties), [properties]);
  // to always have enough data to scroll through, define how often the input data should be multiplied
  const dataMultiplier = useMemo(
    () => Math.max(Math.round(90 / props.data.length), 3),
    [props.data.length]
  );
  // difference between centered index and top most visible index
  const indexDiffTopToCentered = useMemo(
    () => Math.floor(props.itemDisplayCount / 2),
    [props.itemDisplayCount]
  );

  // top most visible item on first render
  const initialTop = useMemo(
    () =>
      props.initialIndex +
      props.data.length * Math.floor(dataMultiplier / 2) -
      indexDiffTopToCentered
  , [props.initialIndex, props.data.length, dataMultiplier, indexDiffTopToCentered]);

  // current selected item (centered one)
  const [current, setCurrent] = useState(initialTop + indexDiffTopToCentered); // first one shown
  const listRef = useRef<VirtualizedList<T>>(null);

  // call "setSelected" when the current top item or the data changed
  useEffect(() => {
    const selectedElement =
      props.data[current % props.data.length]; // centered element

    if (selectedElement !== undefined) {
      props.setSelected(selectedElement);
    }
  }, [current, props.data]);

  useEffect(() => {
    console.log("current ", current, " - ", props.data[current%props.data.length]);
  }, [current]);

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
        getItemCount={() => props.data.length * dataMultiplier}

        initialScrollIndex={initialTop}
        initialNumToRender={props.data.length * dataMultiplier}
        windowSize={props.data.length * dataMultiplier}

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
          dataMultiplier,
          indexDiffTopToCentered,
          props.containerVerticalPadding
        )}
        snapToAlignment="center"

        onMomentumScrollEnd={(event) =>
          onMomentumScrollEnd(
            event.nativeEvent.contentOffset.y,
            setCurrent,
            props.data.length,
            props.itemHeight,
            dataMultiplier,
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
  dataMultiplier: number,
  indexDiffTopToCentered: number,
  verticalPadding: number
) {
  let offsets = [];

  // calculate offset for all items
  for (let i = 0; i < dataLength * dataMultiplier; i++) {
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
  // if `itemDisplayCount` is an even number, centering an item will lead to one
  // half item at the top and bottom, therefore add a half item height to the offset
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
  dataMultiplier: number,
  ref: RefObject<VirtualizedList<T> | null>
) {
  // get index of top most completely visible item
  const currentIndex = Math.ceil(offset / itemHeight);

  // get current section within whole extended data (data * dataMultiplier)
  // section 0 = [0, data.length)
  // section 1 = [data.length, data.length * 2)
  // ...
  const currentSection = Math.floor(offset / (dataLength * itemHeight));
  // target section is always the middle one, so user can scroll seemingly infinitely
  const targetSection = Math.floor(dataMultiplier / 2);

  // get corresponding index of current top index in target section
  const targetTopIndex =
    currentIndex + (targetSection - currentSection) * dataLength;
  setCurrent(targetTopIndex);

  if (currentSection === targetSection) {
    // if target section is current section, stay in this section
    return;
  }

  // if target section is different from current section, scroll to target
  const targetOffset = offset + (targetTopIndex - currentIndex) * itemHeight;
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
