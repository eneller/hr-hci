# Tauri + Angular

On Windows, Tauri requires the the msvc toolchain:
```
rustup default stable-msvc
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) + [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).

## Keyboard Emulation
Keyboard emulation on most systems requires workarounds for two issues:
- keeping the window with the keyboard on top while another (the input target) is in focus
- not receiving focus when clicked
- sending input

## Logging and Statistics
For logging, either use [TextTestExe](https://depts.washington.edu/acelab/proj/texttest/) (local program) or [TextTestPP](https://drustz.com/TextTestPP/) (online).
The theoretical framework is inspired by https://www.yorku.ca/mack/bit95.html
