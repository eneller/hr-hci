import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

//TODO: Second and fourth ring of keys

@Component({
  selector: 'app-circle-keyboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circle-keyboard-container">
      <!-- Center Button - Large with 3 sections -->
      <div class="center-button-container">
        <!-- Top half split: Backspace left, Enter right -->
        <button class="center-section top-left" 
                (click)="keyPressed.emit('Backspace')"
                title="Backspace">
          ⌫
        </button>
        <button class="center-section top-right" 
                (click)="keyPressed.emit('Enter')"
                title="Enter">
          ↵
        </button>
        <!-- Bottom half: Space -->
        <button class="center-section bottom-right" 
                (click)="keyPressed.emit('Space')"
                title="Space">
          ␣
        </button>
          <button (click)="shiftToggled.emit()" 
                [class.active]="shiftActive"
                class="center-section bottom-left">
          ⇧
        </button>
        <button class="center-section middle-left"
                (click)="keyPressed.emit('.')"
                title="Period">
                .
        </button>
        <button class="center-section middle-right"
                (click)="keyPressed.emit(',')"
                title="Comma">
                ,
        </button>
      </div>

      <!-- 8 Surrounding Buttons in Circle -->
      <button *ngFor="let key of circleKeysFirst; let i = index" 
              class="circle-button"
              [style.transform]="getCirclePositionFromTop(i, 110)"
              (click)="keyPressed.emit(key)">
        {{ shiftActive ? key : key.toLowerCase() }}
      </button>

      <button *ngFor="let key of circleKeysSecond; let i = index" 
          class="circle-button second-ring"
          [style.transform]="getCirclePositionFromTop(i, 150, 22.5)"
          (click)="keyPressed.emit(key)">
    {{ shiftActive ? key : key.toLowerCase() }}
      </button>

     <button *ngFor="let key of circleKeysThird; let i = index" 
          class="circle-button third-ring"
          [style.transform]="getCirclePositionFromTop(i, 170)"
          (click)="keyPressed.emit(key)">
    {{ shiftActive ? key : key.toLowerCase() }}
      </button>

      <button class="circle-button fourth-ring"
          [style.transform]="getCirclePositionFromTop(0, 182, -12)"
          (click)="keyPressed.emit(circleKeysFourth[0])">
    {{ shiftActive ? circleKeysFourth[0] : circleKeysFourth[0].toLowerCase() }}
      </button>

      <button class="circle-button fourth-ring"
          [style.transform]="getCirclePositionFromTop(0, 182, 14)"
          (click)="keyPressed.emit(circleKeysFourth[1])">
    {{ shiftActive ? circleKeysFourth[1] : circleKeysFourth[1].toLowerCase() }}
      </button>
    </div>
  `,
  styleUrl: './circle-keyboard.component.css'
})
export class CircleKeyboardComponent {
  @Input() shiftActive = false;
  @Output() keyPressed = new EventEmitter<string>();
  @Output() shiftToggled = new EventEmitter<void>();

  // 8 keys arranged in circle
  circleKeysFirst = ['E', 'T', 'A', 'O', 'N', 'I', 'H', 'S'];
  circleKeysSecond = ['R', 'L', 'D', 'U', 'C', 'M', 'W', 'Y'];
  circleKeysThird = ['F', 'G', 'P', 'B', 'V', 'K', 'J', 'X'];
  circleKeysFourth = ['Q', 'Z'];

  // Calculate position for each button in circle
  getCirclePositionFromTop(index: number, radius: number, offset: number = 0): string {
    const angle = ((index * 45) - 90) + offset; // Start from top (0°), 45° apart
    const angleRad = (angle * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    return `translate(${x}px, ${y}px)`;
  }
}
