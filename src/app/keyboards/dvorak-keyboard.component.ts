import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dvorak-keyboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="keyboard">
      <div class="keyboard-row">
        <button *ngFor="let key of row1" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
      </div>

      <div class="keyboard-row">
        <button *ngFor="let key of row2" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
      </div>

      <div class="keyboard-row">
        <button *ngFor="let key of row3" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
      </div>

      <div class="keyboard-row special-keys">
        <button (click)="shiftToggled.emit()" 
                [class.active]="shiftActive"
                class="key-button shift-key">
          ⇧ Shift
        </button>
        
        <button (click)="keyPressed.emit('Space')" 
                class="key-button space-key">
          Space
        </button>
        
        <button (click)="keyPressed.emit('Backspace')" 
                class="key-button">
          ⌫ Delete
        </button>
        
        <button (click)="keyPressed.emit('Enter')" 
                class="key-button">
          ↵ Enter
        </button>
      </div>
    </div>
  `,
  styleUrl: '../app.component.css'
})
export class DvorakKeyboardComponent {
  @Input() shiftActive = false;
  @Output() keyPressed = new EventEmitter<string>();
  @Output() shiftToggled = new EventEmitter<void>();

  row1 = [',', '.', 'P', 'Y', 'F', 'G', 'C', 'R', 'L'];
  row2 = ['A', 'O', 'E', 'U', 'I', 'D', 'H', 'T', 'N', 'S'];
  row3 = ['Q', 'J', 'K', 'X', 'B', 'M', 'W', 'V', 'Z'];
}
