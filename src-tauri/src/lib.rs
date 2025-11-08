use enigo::{Direction::Click, Enigo, Key, Keyboard, Settings};
use raw_window_handle::{HasRawWindowHandle, RawWindowHandle, WindowHandle};
use std::ptr;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.key(Key::Unicode('a'), Click);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            #[cfg(target_os = "linux")]
            {
                use x11::xlib;
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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
