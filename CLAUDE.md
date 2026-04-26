# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla HTML/CSS/JS project — no build system, no dependencies, no package manager. Everything runs directly in the browser by opening `tictactoe.html`.

## Architecture

The entire app lives in `tictactoe.html` as a single self-contained file:

- **State**: `board` (9-element array), `current` (active player), `over` (game ended), `vsAI` (mode toggle), `scores` (running totals)
- **AI**: Unbeatable minimax algorithm in `minimax()` / `bestMove()` — O plays optimally, X is the human
- **Win detection**: `checkWinner()` checks all 8 winning lines defined in `WINS`
- **Modes**: vs CPU (default) or vs Human, toggled by the mode button; switching resets scores

## Git & GitHub

All changes must be committed with clean messages and pushed to `origin` (github.com/Jaymiletta/C-Coding) after every meaningful change.
