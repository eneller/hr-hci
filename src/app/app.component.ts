import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";
import { QwertyKeyboardComponent } from './keyboards/qwerty-keyboard.component';
import { DvorakKeyboardComponent } from './keyboards/dvorak-keyboard.component';
import { CircleKeyboardComponent } from './keyboards/circle-keyboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    QwertyKeyboardComponent,
    DvorakKeyboardComponent,
    CircleKeyboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  greetingMessage = "";
  currentLayout: 'qwerty' | 'dvorak' | 'circle' = 'qwerty';
  shiftActive = false;

  @ViewChild('greetInput') inputElement!: ElementRef;

  ngAfterViewInit() {
    this.inputElement.nativeElement.focus();
  }

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }

  toggleShift(): void {
    this.shiftActive = !this.shiftActive;
  }
  
  switchLayout(): void {
    if (this.currentLayout == 'qwerty'){
      this.currentLayout = 'dvorak';
    } else if (this.currentLayout == 'dvorak'){
      this.currentLayout = 'circle';
    } else if (this.currentLayout == 'circle'){
      this.currentLayout = 'qwerty';
    }
  }

  async handleKeyPress(key: string): Promise<void> {
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
