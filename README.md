https://stackblitz.com/edit/angular-ivy-kdc7dp?file=src%2Fapp%2Fapp.component.ts

import {
  Component,
  ElementRef,
  Input,
  VERSION,
  ViewChild,
} from '@angular/core';
import {
  fromEvent,
  pairwise,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  @Input() canvasWidth = 640;
  @Input() canvasHeight = 360;

  @ViewChild('roiCanvas') canvas: ElementRef;
  cx: CanvasRenderingContext2D;
  drawingSubscription: Subscription = new Subscription();
  lineTo: any = [];
  ngAfterViewInit() {
    const canvasElem: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasElem.getContext('2d');
    canvasElem.width = this.canvasWidth;
    canvasElem.height = this.canvasHeight;
    // this.cx.fillStyle = 'rgba(255,63,52,0.15)';
    // this.cx.strokeStyle = '#c23616';
    // this.cx.lineWidth = 2;
    this.captureEvents(canvasElem);
  }
  drawChart(x, y) {
    this.cx.beginPath();
    this.cx.arc(x, y, 4, 0, Math.PI * 2);
    this.cx.strokeStyle = '#88A3B8';
    this.cx.fillStyle = '#88A3B8';
    this.cx.stroke();
    this.cx.fill();
  }
  captureEvents(canvasEl: HTMLCanvasElement) {
    let startX: any;
    let startY: any;
    let mouseX: any;
    let mouseY: any;
    let tempArray = [];
    let firstX: any;
    let firstY: any;
    let canDraw = true;
    canvasEl.addEventListener('mousedown', (e) => {
      if(canDraw){
        startX = null;
        startY = null;
  
        const rect = canvasEl.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
       
        if(firstX==null){
          firstX = startX;
          firstY = startY;
        }
        else if(Math.abs(firstX-startX)<=5  && Math.abs(firstY-startY)<=5 ){
          console.log('stop here', startX, startY);
          canDraw = false;
        }
        console.log('test here', startX, startY);
        this.drawChart(startX, startY);
        //this.lineTo.push({ x: startX, y: startY });
        //tempArray.push({ x: startX, y: startY });
        // console.log(tempArray)
        if (this.lineTo.length > 0) {
          this.cx.lineWidth = 10;
          var last = this.lineTo[this.lineTo.length - 1];
  
          this.cx.beginPath();
          this.cx.moveTo(last.x, last.y);
          this.cx.lineTo(startX, startY);
          this.cx.strokeStyle = '#88A3B8';
          this.cx.stroke();
        }
        //console.log(tempArray)
        this.lineTo.push({ x: startX, y: startY });
      }
     
    });
  }
  clear() {
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.lineTo = [];
  }
  drawPaths() {
    // delete everything
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // draw all the paths in the paths array
    this.lineTo.forEach((path: any) => {
      this.cx.beginPath();
      var last = this.lineTo[this.lineTo.length - 1];
      this.cx.moveTo(last.x, last.y);
      for (let i = 1; i < path.length; i++) {
        this.drawChart(path[i].x, path[i].y);
        this.cx.lineTo(path[i].x, path[i].y);
      }
      this.cx.strokeStyle = '#88A3B8';
      this.cx.stroke();
    });
  }
  undo() {
    this.lineTo.splice(-1, 1);
    
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
    this.lineTo.forEach((path: any, i: any) => {
  
      this.cx.beginPath();
  
      this.drawChart(path.x, path.y);
  
      if(this.lineTo.length > i+1) {
        this.cx.lineTo(this.lineTo[i+1].x, this.lineTo[i+1].y);
      }
  
      //this.cx.strokeStyle = '#0652DD';
      this.cx.stroke();
    });
  }
}
