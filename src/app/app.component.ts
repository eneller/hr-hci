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

  // Keyboard Layout
  row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  
  shiftActive = false;

  toggleShift(): void {
    this.shiftActive = !this.shiftActive;
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
