<!--markdownlint-disable md033 -->
# React Native Countdown Timer

<div align="center">
<img src="https://raw.githubusercontent.com/ZakaHaceCosas/rn-countdown-timer/refs/heads/master/img/demo1.gif" alt="Demo 1" width="200">
<img src="https://raw.githubusercontent.com/ZakaHaceCosas/rn-countdown-timer/refs/heads/master/img/demo2.gif" alt="Demo 2" width="200">
<img src="https://raw.githubusercontent.com/ZakaHaceCosas/rn-countdown-timer/refs/heads/master/img/demo3.gif" alt="Demo 3" width="200">
</div>

[![npm](https://img.shields.io/npm/v/rn-countdown-timer?style=for-the-badge)](https://www.npmjs.com/package/rn-countdown-timer)
[![npm](https://img.shields.io/npm/dw/rn-countdown-timer?style=for-the-badge)](https://www.npmtrends.com/rn-countdown-timer)

React Native countdown timer component in a circle shape with color and progress animation.

## Features

:zap: Performance optimized with single `requestAnimationFrame` loop to animate color and progress  
:rainbow: Transition between colors during the countdown  
:european_castle: Fully customizable content in the center of the circle  
:rocket: Support iOS and Android

## Install

```bash
pnpm install rn-countdown-timer
```

This component has a peer dependency on `react-native-svg` to draw the countdown circle, so `react-native-svg` (version `>=15.8.0`) has to be installed and linked into your project.

## Usage

### Component

Check the [Expo Snack](https://snack.expo.io/@dimitrov/countdown-circle-timer?platform=ios) demo to get started.

```jsx
import { Text } from 'react-native'
import { CountdownCircleTimer } from 'rn-countdown-timer'

const UrgeWithPleasureComponent = () => (
  <CountdownCircleTimer
    isPlaying
    duration={7}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
  >
    {({ remainingTime }) => <Text>{remainingTime}</Text>}
  </CountdownCircleTimer>
)
```

### Hook

The package exports a hook `useCountdown`, which accepts the same props as the component and returns all props needed to render your own circle.

```jsx
import { useCountdown } from 'rn-countdown-timer'

const {
  path,
  pathLength,
  stroke,
  strokeDashoffset,
  remainingTime,
  elapsedTime,
  size,
  strokeWidth,
} = useCountdown({ isPlaying: true, duration: 7, colors: '#abc' })
```

## Props

| Prop | Type | Default | Description |
| - | - | - | - |
| `duration` | `number` | _required_ | Countdown duration in seconds |
| `colors` | `string` \| `string[]` | _required_  | Either a single valid color in any format or URL to a gradient, or an array of colors in the HEX format. At least 2 colors should be provided, if using an array. |
| `colorsTime` | `number[]` | - | Indicates the time when a color should switch to the next color. The first number is the countdown duration and the last one is 0 or goal. Works only when `colors` is an array of HEX colors |
| `isPlaying` | `boolean` | `false` | Play or pause animation |
| `initialRemainingTime` | `number` | - | Set the initial remaining time if it is different than the duration |
| `updateInterval` | `number` | `0` | Update interval in seconds. Determines how often the timer updates. When set to 0 the value will update on each key frame |
| `size` | `number` | `180` | Width and height of the SVG element |
| `strokeWidth` | `number` | `12` | Path stroke width |
| `trailStrokeWidth` | `number` | `strokeWidth` | Trail stroke width |
| `strokeLinecap` | `"round"` \| `"square"` \| `"butt"` | `"round"` | Path stroke line cap |
| `rotation` | `"clockwise"` \| `"counterclockwise"` | `"clockwise"`   | Progress path rotation direction |
| `isGrowing` | `boolean` | `false`       | Indicated if the progress path should be growing instead of shrinking |
| `trailColor` | `string` | `#d9d9d9`     | Circle trail color - takes any valid color format |
| `isSmoothColorTransition` | `boolean` | `true`        | Indicates if the colors should smoothly transition to the next color |
| `children` | `(props: { remainingTime: number, elapsedTime: number, color: string }) => ReactNode` | - | Render function to customize the time/content in the center of the circle |
| `onComplete` | `(totalElapsedTime: number) => void \| { shouldRepeat: boolean, delay?: number, newInitialRemainingTime?: number }` | - | On animation complete event handler |
| `onUpdate` | `(remainingTime: number) => void` | - | On remaining time update event handler |
| `key` | `any` | - | Optional. You can pass a value to the `key` prop, and whenever it changes, the timer will restart. |

## Recipes

### Changing `duration` prop

Once the component is mounted the `duration` prop can be changed the the timer will respect the new duration. In case the new duration is bigger than the previous one then the timer will continue to the new duration. In case the new duration is smaller then the previous one then the timer will ne over. If you want to restart the timer when the duration changes then pass a new `key` prop to `CountdownCircleTimer` component and the timer will start over with the new values provided.

### Restart timer at any given time

Pass a `key` prop to `CountdownCircleTimer` and change the `key` when the timer should be restarted. Check [this demo](https://codesandbox.io/s/tender-bogdan-qd35m) to find out one possible implementation.

### Repeat timer when countdown is completed

Return an object from `onComplete` handler, which indicates if the animation should be repeated. Example:

```jsx
const UrgeWithPleasureComponent = () => (
  <CountdownCircleTimer
    isPlaying
    duration={10}
    colors="#A30000"
    onComplete={() => {
      // do your stuff here
      return { shouldRepeat: true, delay: 1.5 } // repeat animation in 1.5 seconds
    }}
  />
)
```

### Set the initial remaining time different then the duration provided

Pass the remaining time to `initialRemainingTime` prop. Example:

```jsx
const UrgeWithPleasureComponent = () => (
  <CountdownCircleTimer
    isPlaying
    duration={60}
    initialRemainingTime={15}
    colors="#A30000"
  />
)
```

In the example above, the countdown will start at 15 seconds (one quarter before it's done) and it will animate for 15 seconds until reaches 0.

### Time formatting functions

`children` prop of `CountdownCircleTimer` component will receive as a prop `remainingTime` in seconds. Below are a few functions that can be used to get different time formatting:

- Format `mm:ss` (minutes and seconds)

```js
const children = ({ remainingTime }) => {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return `${minutes}:${seconds}`
}
```

- Format `hh:mm:ss` (hours, minutes and seconds)

```js
const children = ({ remainingTime }) => {
  const hours = Math.floor(remainingTime / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  return `${hours}:${minutes}:${seconds}`
}
```

### Add `a11y` support

- Wrapper the timer in an `View` element and add the following attributes `accessible={true} accessibilityLabel={your-aria-abel}`
- Add the following `Text` element to your `children` function that will make the screen reader read the remaining time while the timer is running.

```jsx
const children = ({ remainingTime }) => (
  <Text
    accessibilityRole="timer"
    accessibilityLiveRegion="assertive"
    importantForAccessibility="yes"
  >
    {remainingTime} seconds
  </Text>
)
```

### Add gradient

Since the gradient definition and the usage of it has to be placed under the same SVG element we should use the `useCountdown` hook and build the countdown component ourself. Check [this demo](https://snack.expo.dev/@dimitrov/react-native-countdown-circle-timer-gradient?platform=ios) to see how it works.

```jsx
const {
    ...
  } = useCountdown({ isPlaying: true, duration, colors: 'url(#your-unique-id)' })

  <Svg width={size} height={size}>
    <Defs>
      <LinearGradient id="your-unique-id" x1="1" y1="0" x2="0" y2="0">
        <Stop offset="5%" stopColor="gold"/>
        <Stop offset="95%" stopColor="red"/>
      </LinearGradient>
    </Defs>
    <Path
      d={path}
      fill="none"
      stroke="#d9d9d9"
      strokeWidth={strokeWidth}
    />
    <Path
      d={path}
      fill="none"
      stroke={stroke}
      strokeLinecap="butt"
      strokeWidth={strokeWidth}
      strokeDasharray={pathLength}
      strokeDashoffset={strokeDashoffset}
    />
  </Svg>
```
