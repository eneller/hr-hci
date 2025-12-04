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
      </div>

      <!-- 8 Surrounding Buttons in Circle -->
      <button *ngFor="let key of circleKeysFirst; let i = index" 
              class="circle-button"
              [style.transform]="getCirclePositionFromTop(i, 110)"
              (click)="keyPressed.emit(key)">
        {{ shiftActive ? key : key.toLowerCase() }}
      </button>

     <button *ngFor="let key of circleKeysThird; let i = index" 
          class="circle-button third-ring"
          [style.transform]="getCirclePositionFromTop(i, 170)"
          (click)="keyPressed.emit(key)">
    {{ shiftActive ? key : key.toLowerCase() }}
      </button>
    </div>
  `,
  styles: [`
    .circle-keyboard-container {
      position: relative;
      width: 400px;
      height: 400px;
      margin: 50px auto;
    }

    /* Center Button Container */
    .center-button-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 140px;
      z-index: 1;
    }

    /* Center Button Sections */
    .center-section {
      position: absolute;
      background: white;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
      border: 2px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Top-left: Backspace (triangle) */
    .top-left{
      top: 0;
      left: 0;
      width: 70px;
      height: 70px;
      border-radius: 70px 0 0 0;
    }

    /* Top-right: Enter*/
    .top-right {
      top: 0;
      right: 0;
      width: 70px;
      height: 70px;
      border-radius: 0 70px 0 0;
    }

    /* Bottom: Space */
    .bottom-left {
      bottom: 0;
      left: 0;
      width: 70px;
      height: 70px;
      border-radius: 0 0 0 70px;
    }

    .bottom-left.active {
      background: #4CAF50 !important;
      color: white;
      border-color: #45a049;
    }

    .bottom-right {
        bottom: 0;
        right: 0;
        width: 70px;
        height: 70px;
        border-radius: 0 0 70px 0;
    }

    /* 8 Circle Buttons */
    .circle-button {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      border-radius: 50%;
      border: 2px solid #ddd;
      background: white;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 1;
    }

    .third-ring {
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
    }

    .fourth-ring {
        width: 30px;
        height: 30px;
        margin: -20px 0 0 -20px;
    }

    .circle-button:hover, .center-section:hover {
      background: #e8e8e8;
      border-color: #999;
    }

    .circle-button:active, .center-section:active {
      background: #d0d0d0;
    }
  `]
})
export class CircleKeyboardComponent {
  @Input() shiftActive = false;
  @Output() keyPressed = new EventEmitter<string>();
  @Output() shiftToggled = new EventEmitter<void>();

  // 8 keys arranged in circle
  circleKeysFirst = ['E', 'T', 'A', 'O', 'N', 'I', 'H', 'S'];
  circleKeysSecond = ['R', 'L', 'D', 'U', 'C', 'M', 'W', 'Y'];
  circleKeysThird = ['F', 'G', 'P', 'B', 'V', 'K', 'J', 'X'];
  circleKeysFourth = ['Q', 'Z', ',', '.'];

  // Calculate position for each button in circle
  getCirclePositionFromTop(index: number, radius: number): string {
    const angle = (index * 45) - 90; // Start from top (0°), 45° apart
    const angleRad = (angle * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    return `translate(${x}px, ${y}px)`;
  }
}
