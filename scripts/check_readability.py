#!/usr/bin/env python3
"""
Compute Flesch Reading Ease scores for Markdown files.

Usage:
  python scripts/check_readability.py [--min N] [--max N] [--no-range] <path> [<path> ...]

Defaults: min=45, max=70
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from typing import Iterable, List

SENTENCE_RE = re.compile(r"[.!?]+")
WORD_RE = re.compile(r"[A-Za-z][A-Za-z']*")
VOWELS = set("aeiouy")


def strip_markdown(text: str) -> str:
    # Remove fenced code blocks
    text = re.sub(r"```[\s\S]*?```", " ", text)
    # Remove inline code
    text = re.sub(r"`[^`]+`", " ", text)
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Replace links with link text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Replace images with alt text
    text = re.sub(r"!\[([^\]]*)\]\([^\)]+\)", r"\1", text)
    return text


def iter_paths(paths: List[str]) -> Iterable[str]:
    seen = set()
    for raw in paths:
        if os.path.isdir(raw):
            for root, _dirs, files in os.walk(raw):
                for name in files:
                    if name.lower().endswith(".md"):
                        path = os.path.join(root, name)
                        if path not in seen:
                            seen.add(path)
                            yield path
            continue
        if any(ch in raw for ch in "*?["):
            for path in glob.glob(raw):
                if os.path.isdir(path):
                    for nested in iter_paths([path]):
                        if nested not in seen:
                            seen.add(nested)
                            yield nested
                elif path.lower().endswith(".md") and path not in seen:
                    seen.add(path)
                    yield path
            continue
        if raw.lower().endswith(".md") and raw not in seen:
            seen.add(raw)
            yield raw


def count_syllables(word: str) -> int:
    word = word.lower().strip("'\"")
    if not word:
        return 0
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in VOWELS
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e") and count > 1:
        count -= 1
    return max(count, 1)


def flesch_reading_ease(text: str) -> float:
    words = WORD_RE.findall(text)
    sentences = SENTENCE_RE.findall(text)
    word_count = len(words)
    sentence_count = max(len(sentences), 1)
    syllable_count = sum(count_syllables(w) for w in words)
    if word_count == 0:
        return 0.0
    return 206.835 - 1.015 * (word_count / sentence_count) - 84.6 * (syllable_count / word_count)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+", help="Files, directories, or globs to scan")
    parser.add_argument("--min", type=float, default=45.0)
    parser.add_argument("--max", type=float, default=70.0)
    parser.add_argument("--no-range", action="store_true", help="Do not enforce a range")
    args = parser.parse_args()

    files = list(iter_paths(args.paths))
    if not files:
        print("No markdown files found.")
        return 1

    failures = 0
    for path in sorted(files):
        with open(path, "r", encoding="utf8") as handle:
            raw = handle.read()
        clean = strip_markdown(raw)
        score = flesch_reading_ease(clean)
        status = "OK"
        if not args.no_range and (score < args.min or score > args.max):
            status = "OUT_OF_RANGE"
            failures += 1
        print(f"{status}\t{score:0.1f}\t{path}")

    if failures and not args.no_range:
        print(f"{failures} file(s) outside range {args.min}-{args.max}.")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
