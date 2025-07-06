# Readme

A React Native wheel picker that allows endless scrolling through repeating content

## Installation

```sh
npm install repeating-wheel-picker
```

## Usage


```tsx
import RepeatingWheelPicker, {
  type RepeatingWheelPickerProps,
} from "repeating-wheel-picker";

// ...
const [, setSelected] = useState<string>();

return (
  <RepeatingWheelPicker<string>
    setSelected={setSelected}
    initialIndex={0}
    data={["first", "second", "third"]}
  />
);
```


## Contributing

Contributions are currently not intended.

## License

[MIT](LICENSE)

## [Changelog](CHANGELOG.md)

## [Impressum / Imprint](https://amabeth.github.io/#imprint)

---
