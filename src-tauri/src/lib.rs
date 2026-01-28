use enigo::{Direction, Enigo, Key, Keyboard, Settings};
#[cfg(target_os = "linux")]
use std::ptr;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn send_key(key: String) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| format!("Enigo error: {}", e))?;

    if key.len() == 1 {
        let ch = key.chars().next().unwrap();

        // Check if uppercase letter
        if ch.is_uppercase() && ch.is_alphabetic() {
            // Send Shift + lowercase letter
            enigo
                .key(Key::Shift, Direction::Press)
                .map_err(|e| format!("Shift press error: {}", e))?;
            enigo
                .key(
                    Key::Unicode(ch.to_lowercase().next().unwrap()),
                    Direction::Click,
                )
                .map_err(|e| format!("Key error: {}", e))?;
            enigo
                .key(Key::Shift, Direction::Release)
                .map_err(|e| format!("Shift release error: {}", e))?;
        } else {
            // Send character as-is (lowercase or non-letter)
            enigo
                .key(Key::Unicode(ch), Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?;
        }
    } else {
        // Special keys
        match key.as_str() {
            "Enter" => enigo
                .key(Key::Return, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            "Space" => enigo
                .key(Key::Space, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            "Backspace" => enigo
                .key(Key::Backspace, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            _ => return Err("Unknown key".to_string()),
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "windows")]
            {
                #![allow(deprecated)]
                use raw_window_handle::{HasRawWindowHandle, RawWindowHandle};
                use windows::Win32::Foundation::HWND;
                use windows::Win32::UI::WindowsAndMessaging::{GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_NOACTIVATE,};

                unsafe {
                    if let Ok(RawWindowHandle::Win32(handle)) = window.raw_window_handle() {
                        let hwnd = HWND(handle.hwnd.get() as *mut core::ffi::c_void);

                        // Get current extended window style
                        let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;

                        // Add WS_EX_NOACTIVATE flag
                        let new_style = ex_style | WS_EX_NOACTIVATE.0;
                        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style as isize);

                        // Position window as topmost without activating
                        /*
                        SetWindowPos(
                            hwnd,
                            Some(HWND_TOPMOST),
                            0, 0, 0, 0,
                            SWP_NOACTIVATE
                        ); */
                    }
                }
            }

            #[cfg(target_os = "linux")]
            {
                use raw_window_handle::{HasRawWindowHandle, RawWindowHandle};
                use x11::xlib;

                unsafe {
                    let handle = window.raw_window_handle();
                    if let Ok(RawWindowHandle::Xlib(h)) = handle {
                        let display = xlib::XOpenDisplay(ptr::null());
                        if !display.is_null() {
                            let hints = xlib::XAllocWMHints();
                            if !hints.is_null() {
                                (*hints).flags = xlib::InputHint;
                                (*hints).input = 0;
                                xlib::XSetWMHints(display, h.window, hints);
                                xlib::XFree(hints as *mut _);
                            }
                            xlib::XCloseDisplay(display);
                        }
                    }
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
