use enigo::{Direction, Enigo, Key, Keyboard, Settings};
#[cfg(target_os = "linux")]
use std::ptr;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    // let mut enigo = Enigo::new(&Settings::default()).unwrap();
    // enigo.key(Key::Unicode('a'), Click);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send_key(key: String) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| format!("Enigo error: {}", e))?;

    if key.len() == 1 {
        let ch = key.chars().next().unwrap();
        
        // Check if uppercase letter
        if ch.is_uppercase() && ch.is_alphabetic() {
            // Send Shift + lowercase letter
            enigo.key(Key::Shift, Direction::Press)
                .map_err(|e| format!("Shift press error: {}", e))?;
            enigo.key(Key::Unicode(ch.to_lowercase().next().unwrap()), Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?;
            enigo.key(Key::Shift, Direction::Release)
                .map_err(|e| format!("Shift release error: {}", e))?;
        } else {
            // Send character as-is (lowercase or non-letter)
            enigo.key(Key::Unicode(ch), Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?;
        }
    } else {
        // Special keys
        match key.as_str() {
            "Enter" => enigo.key(Key::Return, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            "Space" => enigo.key(Key::Space, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            "Backspace" => enigo.key(Key::Backspace, Direction::Click)
                .map_err(|e| format!("Key error: {}", e))?,
            _ => return Err("Unknown key".to_string()),
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg_attr(not(target_os = "linux"), allow(unused_variables))]
            let window = app.get_webview_window("main").unwrap();
            #[cfg(target_os = "windows")]
            {
            }
            #[cfg(target_os = "linux")]
            {
                use x11::xlib;
                use raw_window_handle::{HasRawWindowHandle, RawWindowHandle, WindowHandle};
                // raw X11 pointers here
                unsafe {
                    let handle = window.raw_window_handle();
                    if let Ok(RawWindowHandle::Xlib(h)) = handle {
                        let display = xlib::XOpenDisplay(ptr::null());
                        if !display.is_null() {
                            let hints = xlib::XAllocWMHints();
                            if !hints.is_null() {
                                (*hints).flags = xlib::InputHint;
                                (*hints).input = 0; // Set input hint to False
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
        .invoke_handler(tauri::generate_handler![greet, send_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
