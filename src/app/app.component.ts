import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  greetingMessage = "";

  @ViewChild('greetInput') inputElement!: ElementRef;

  ngAfterViewInit() {
    // Beim Start fokussieren
    this.inputElement.nativeElement.focus();
  }

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }

  // Keyboard Layout State
  currentLayout: 'qwerty' | 'dvorak' = 'qwerty';
  
  // QWERTY Layout
  qwertyRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  qwertyRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  qwertyRow3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ",", "."];
  
  // DVORAK Layout
  dvorakRow1 = [',', '.', 'P', 'Y', 'F', 'G', 'C', 'R', 'L'];
  dvorakRow2 = ['A', 'O', 'E', 'U', 'I', 'D', 'H', 'T', 'N', 'S'];
  dvorakRow3 = ['Q', 'J', 'K', 'X', 'B', 'M', 'W', 'V', 'Z'];
  
  shiftActive = false;
  
  // Getters for current layout
  get row1() { return this.currentLayout === 'qwerty' ? this.qwertyRow1 : this.dvorakRow1; }
  get row2() { return this.currentLayout === 'qwerty' ? this.qwertyRow2 : this.dvorakRow2; }
  get row3() { return this.currentLayout === 'qwerty' ? this.qwertyRow3 : this.dvorakRow3; }

  toggleShift(): void {
    this.shiftActive = !this.shiftActive;
  }
  
  switchLayout(): void {
    this.currentLayout = this.currentLayout === 'qwerty' ? 'dvorak' : 'qwerty';
  }

  async sendKey(key: string): Promise<void> {
    this.inputElement.nativeElement.focus();
    
    let finalKey = key;
    if (key.length === 1) {
      finalKey = this.shiftActive ? key.toUpperCase() : key.toLowerCase();
    }
    
    await invoke("send_key", { key: finalKey });
    
    if (this.shiftActive && key.length === 1) {
      this.shiftActive = false;
    }
  }
}
