---
title: Getting Started
tags: [project, cmake, qmake, kits]
---

# Getting Started

> Create your first Qt project and understand what Qt Creator builds for you.

## Create a project

1. <kbd>Ctrl</kbd>+<kbd>N</kbd> → **New Project**.
2. Choose a template:
   - **Qt Widgets Application**: windows, buttons, forms.
   - **Qt Console Application**: text only, great for first C++ exercises.
3. Name it (no spaces or accents in the path), pick a folder.
4. Build system: **CMake** (recommended) or **qmake** (`.pro`).
5. Tick a **Kit** (e.g. *Desktop Qt 6.x MinGW 64-bit*), then **Finish**.

> [!WARNING]
> **Common mistake:** a path like `C:\Users\Zoë Novák\Škola\` can break builds. Use something like `C:\dev\qt\hello`.

## CMake vs. .pro

| | CMake (`CMakeLists.txt`) | qmake (`.pro`) |
|---|---|---|
| Status | Default in Qt 6 | Still supported |
| Add a file | List it in `qt_add_executable` / `add_executable` | Add to `SOURCES` / `HEADERS` |
| Reload | Re-runs CMake on save | Automatic |

```cmake
cmake_minimum_required(VERSION 3.16)
project(hello LANGUAGES CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_executable(hello main.cpp mainwindow.cpp mainwindow.h mainwindow.ui)
target_link_libraries(hello PRIVATE Qt6::Widgets)
```

```ini
QT += core gui widgets
CONFIG += c++17
SOURCES += main.cpp mainwindow.cpp
HEADERS += mainwindow.h
FORMS   += mainwindow.ui
```

## Kits & shadow builds

- A **Kit** = compiler + Qt version + debugger. Change it in **Projects** (<kbd>Ctrl</kbd>+<kbd>5</kbd>).
- A **shadow build** puts generated files in a separate `build-…` folder, so your source folder stays clean.
- Configurations: **Debug** (breakpoints work) and **Release** (fast, no debugging).

> [!TIP]
> Submit only the source folder. Never zip the `build-*` folder.

> [!NOTE]
> No kits shown? Open **Edit → Preferences → Kits** and check that a Qt version and compiler are detected.

Next: [Shortcuts & Workflow](../02-shortcuts-workflow/README.md)
