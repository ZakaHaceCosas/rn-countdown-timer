import '@testing-library/jest-dom'
import React from 'react'
import { Text } from 'react-native'
import { render, renderHook } from '@testing-library/react-native'

import { CountdownCircleTimer, useCountdown } from '.'
import type { Props } from '.'

const fixture: Props = {
  duration: 0.2,
  colors: '#abc',
}

describe('CountdownCircleTimer', () => {
  it('renders with single color', () => {
    const tree = render(
      <CountdownCircleTimer {...fixture}>
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with different trail stroke width', () => {
    const tree = render(
      <CountdownCircleTimer {...fixture} trailStrokeWidth={16} strokeWidth={14}>
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with isGrowing prop when it is set', () => {
    const tree = render(
      <CountdownCircleTimer {...fixture} isGrowing>
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('starts the timer from value provided in initialRemainingTime', () => {
    const { getByText } = render(
      <CountdownCircleTimer
        duration={10}
        colors="#abc"
        initialRemainingTime={3.7}
      >
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    )

    expect(getByText('4')).toBeTruthy()
  })

  it('does not render the animating path when the elapsed time is equal the duration', () => {
    const tree = render(
      <CountdownCircleTimer
        duration={0}
        colors="#abc"
        initialRemainingTime={3.7}
      >
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CountdownCircleTimer>
    )

    expect(tree).toMatchSnapshot()
  })
})

describe('useCountdown', () => {
  it('returns default values form useCountdown', () => {
    const { result } = renderHook(() =>
      useCountdown({ duration: 12, colors: '#f1f2f3' })
    )

    expect(result.current).toEqual({
      elapsedTime: 0,
      path: 'm 90,6 a 84,84 0 1,0 0,168 a 84,84 0 1,0 0,-168',
      pathLength: 527.7875658030853,
      remainingTime: 12,
      rotation: 'clockwise',
      size: 180,
      stroke: '#f1f2f3',
      strokeDashoffset: 0,
      strokeWidth: 12,
    })
  })
})
