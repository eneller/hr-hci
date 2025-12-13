import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opti-keyboard',
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
          <button (click)="keyPressed.emit('Space')" 
                    class="key-button space-key">
              Space
            </button>
        <button *ngFor="let key of row2" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
        <button (click)="keyPressed.emit('Space')" 
                class="key-button space-key">
          Space
        </button>
      </div>


      <div class="keyboard-row">
        <button (click)="shiftToggled.emit()" 
                [class.active]="shiftActive"
                class="key-button shift-key">
          ⇧ Shift
        </button>
        <button *ngFor="let key of row3" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
        <button (click)="keyPressed.emit('Enter')" 
                class="key-button">
          ↵ Enter
        </button>
      </div>

        <div class="keyboard-row">
            <button (click)="keyPressed.emit('Space')" 
                class="key-button space-key">
          Space
        </button>
        <button *ngFor="let key of row4" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
        <button (click)="keyPressed.emit('Space')" 
                class="key-button space-key">
          Space
        </button>
      </div>

      <div class="keyboard-row">
        <button *ngFor="let key of row5" 
                (click)="keyPressed.emit(key)"
                class="key-button">
          {{ shiftActive ? key : key.toLowerCase() }}
        </button>
      </div>

      <div class="keyboard-row special-keys">
        <button (click)="keyPressed.emit('Backspace')" 
                class="key-button">
          ⌫ Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    .space-key {
      min-width: 126px !important;
    }
  `],
  styleUrl: '../app.component.css'
})
export class OptiKeyboardComponent {
  @Input() shiftActive = false;
  @Output() keyPressed = new EventEmitter<string>();
  @Output() shiftToggled = new EventEmitter<void>();

  row1 = ['Q', 'F', 'U', 'M', 'C', 'K', 'Z'];
  row2 = ['O', 'T', 'H'];
  row3 = ['B', 'S', 'R', 'E', 'A', 'W', 'X'];
  row4 = ['I', 'N', 'D'];
  row5 = ['J', 'P', 'V', 'G', 'L', 'Y', ',', '.'];

}
