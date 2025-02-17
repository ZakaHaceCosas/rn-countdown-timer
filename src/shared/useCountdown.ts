import { useEffect, useRef, useState } from 'react'
import { useElapsedTime } from '../hook'
import { getPathProps, getStartAt } from './utils'
import type { Props, ColorFormat } from './types'

const linearEase = (
  time: number,
  start: number,
  goal: number,
  duration: number,
  isGrowing: boolean
) => {
  if (duration === 0) {
    return start
  }

  const currentTime = (isGrowing ? duration - time : time) / duration
  return start + goal * currentTime
}

const getRGB = (color: string) =>
  color
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16)) ?? []

const getStroke = (props: Props, remainingTime: number): ColorFormat => {
  const { colors, colorsTime, isSmoothColorTransition = true } = props
  if (typeof colors === 'string') {
    return colors
  }

  const index =
    colorsTime?.findIndex(
      (time, i) => time >= remainingTime && remainingTime >= colorsTime[i + 1]
    ) ?? -1

  if (!colorsTime || index === -1) {
    return colors[0]
  }

  if (!isSmoothColorTransition) {
    return colors[index]
  }

  const currentTime = colorsTime[index] - remainingTime
  const currentDuration = colorsTime[index] - colorsTime[index + 1]
  const startColorRGB = getRGB(colors[index])
  const endColorRGB = getRGB(colors[index + 1])
  const isGrowing = !!props.isGrowing

  return `rgb(${startColorRGB
    .map(
      (color, index) =>
        linearEase(
          currentTime,
          color,
          endColorRGB[index] - color,
          currentDuration,
          isGrowing
        ) | 0
    )
    .join(',')})`
}

export const useCountdown = (props: Props) => {
  const {
    key,
    duration,
    initialRemainingTime,
    updateInterval,
    size = 180,
    strokeWidth = 12,
    trailStrokeWidth,
    isPlaying = false,
    isGrowing = false,
    rotation = 'clockwise',
    onComplete,
    onUpdate,
  } = props

  const remainingTimeRef = useRef<number>()
  const [elapsedTime, setElapsedTime] = useState(0)
  const maxStrokeWidth = Math.max(strokeWidth, trailStrokeWidth ?? 0)
  const { path, pathLength } = getPathProps(size, maxStrokeWidth, rotation)

  useEffect(() => {
    setElapsedTime(0)
  }, [key])

  const { elapsedTime: newElapsedTime } = useElapsedTime({
    isPlaying,
    duration,
    startAt: getStartAt(duration, initialRemainingTime),
    updateInterval,
    onUpdate:
      typeof onUpdate === 'function'
        ? (elapsedTime: number) => {
            const remainingTime = Math.ceil(duration - elapsedTime)
            if (remainingTime !== remainingTimeRef.current) {
              remainingTimeRef.current = remainingTime
              onUpdate(remainingTime)
            }
          }
        : undefined,
    onComplete:
      typeof onComplete === 'function'
        ? (totalElapsedTime: number) => {
            const { shouldRepeat, delay, newInitialRemainingTime } =
              onComplete(totalElapsedTime) ?? {}
            if (shouldRepeat) {
              return {
                shouldRepeat,
                delay,
                newStartAt: getStartAt(duration, newInitialRemainingTime),
              }
            }
          }
        : undefined,
  })

  const remainingTimeRow = duration - newElapsedTime

  return {
    elapsedTime: newElapsedTime,
    path,
    pathLength,
    remainingTime: Math.ceil(remainingTimeRow),
    rotation,
    size,
    stroke: getStroke(props, remainingTimeRow),
    strokeDashoffset: linearEase(
      newElapsedTime,
      0,
      pathLength,
      duration,
      isGrowing
    ),
    strokeWidth,
  }
}
