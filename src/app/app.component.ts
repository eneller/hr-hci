import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";
import { getMatches } from '@tauri-apps/plugin-cli';
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
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  Keyboards = Keyboards;
  currentLayout: Keyboards = Keyboards.QWERTY;
  shiftActive = false;
  async ngOnInit() {

    const cli = await getMatches();
  }

  @ViewChild('greetInput') inputElement!: ElementRef;

  toggleShift(): void {
    this.shiftActive = !this.shiftActive;
  }
  
  switchLayout(): void {
    if (this.currentLayout === Keyboards.QWERTY){
      this.currentLayout = Keyboards.DVORAK;
    } else if (this.currentLayout === Keyboards.DVORAK){
      this.currentLayout = Keyboards.CIRCLE;
    } else if (this.currentLayout === Keyboards.CIRCLE){
      this.currentLayout = Keyboards.QWERTY;
    }
  }

  async handleKeyPress(key: string): Promise<void> {
    
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
enum Keyboards{
  QWERTY,
  DVORAK,
  CIRCLE
}
