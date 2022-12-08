# 🎄 Advent of Code 2022 - day 8 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/8)

## Notes

The initial solution for this day's puzzle is poorly implemented. The implementation for `isVisible` and `scenicScore` has much overlap.
Consider refactoring to avoid repeating the same logic across both solutions.
Additionally consider leveraging an itertools package to iterate across the pairs of indices.