import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize} from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
   
  }
  @Input() canvasWidth = 640;
  @Input() canvasHeight = 360;
  @ViewChild("downloadLink") downloadLink: ElementRef | undefined;
  // @ViewChild('imgSource') imgSource: ElementRef | null;
  @ViewChild('roiCanvas') canvas: ElementRef | null;
  cx: CanvasRenderingContext2D | null;
  im_1: CanvasRenderingContext2D | null;
  drawingSubscription: Subscription = new Subscription();
  lineTo: any = [];
  constructor(){
    this.cx = null;
    this.im_1 = null;
    this.canvas = null;
  }

  
  ngAfterViewInit() {
    const canvasElem: HTMLCanvasElement = this.canvas?.nativeElement;
    this.cx = canvasElem.getContext('2d');
    this.im_1 = canvasElem.getContext('2d');

    console.log(this.canvas)
    canvasElem.width =this.canvas?.nativeElement.clientWidth;
    canvasElem.height = this.canvasHeight;
    // this.cx?.fillStyle = 'rgba(255,63,52,0.15)';
    // this.cx?.strokeStyle = '#c23616';
    // this.cx?.lineWidth = 2;
    const mouseDownStream = fromEvent(this.canvas?.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas?.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    mouseDownStream.pipe(
      tap((event: any) => {
        if( this.im_1!=null){
          var iim = document.getElementById("imageSrc") as HTMLCanvasElement;
          this.im_1.drawImage(iim, event.offsetX, event.offsetY,iim.width,iim.height);
      
        }
          
      console.log(event.offsetX, event.offsetY)
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: any) => {
          console.log(event.offsetX, event.offsetY)
        }),
        takeUntil(mouseUpStream),
        finalize(() => {
         
        })
      ))
    ).subscribe(console.log);
    

    
    this.captureEvents(canvasElem);
  }
  drawChart(x: number, y: number) {
    if(this.cx!=null){
      this.cx?.beginPath();
      this.cx?.arc(x, y, 2, 0, Math.PI * 2);
      this.cx.strokeStyle = '#88A3B8';
      this.cx.fillStyle = '#88A3B8';
      this.cx?.stroke();
      this.cx?.fill();
    }
  
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
      if (canDraw) {
        startX = null;
        startY = null;

        const rect = canvasEl.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        if (firstX == null) {
          firstX = startX;
          firstY = startY;
        }
        else if (Math.abs(firstX - startX) <= 5 && Math.abs(firstY - startY) <= 5) {
          console.log('stop here', startX, startY);
          canDraw = false;
         
      
        }
        console.log('test here', startX, startY);
        this.drawChart(startX, startY);
        //this.lineTo.push({ x: startX, y: startY });
        //tempArray.push({ x: startX, y: startY });
        // console.log(tempArray)
        if (this.lineTo.length > 0) {
          if(this.cx!=null){
            this.cx.lineWidth = 7;
            var last = this.lineTo[this.lineTo.length - 1];
  
            this.cx?.beginPath();
            this.cx?.moveTo(last.x, last.y);
            this.cx?.lineTo(startX, startY);
            this.cx.strokeStyle = '#88A3B8';
            this.cx?.stroke();
          }
       
        }
        //console.log(tempArray)
        this.lineTo.push({ x: startX, y: startY });
        if(!canDraw){
          if(this.cx!=null && this.canvas!=null){
            this.cx.fillStyle = "#EEF3F9";
            this.cx.beginPath();
            this.cx.moveTo(firstX, firstY);
            this.lineTo.forEach((el: { x: number;y:number }) => {
              if(this.cx!=null){
              this.cx.lineTo(el.x,el.y);
              }
            });
          
            this.cx.closePath();
            this.cx.fill();


    
        if(this.im_1!=null){
          var iim = document.getElementById("imageSrc") as HTMLCanvasElement;
          this.im_1.drawImage(iim, 0,0,iim.width,iim.height);
          
              
        }


            html2canvas(this.canvas.nativeElement,{backgroundColor:null}).then(canvas => {
              if(this.canvas!=null && this.downloadLink){
              
                this.canvas.nativeElement.src = canvas.toDataURL();
                this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
                //console.log(canvas.toDataURL("image/png"))
                this.downloadLink.nativeElement.download = "marble-diagram.png";
                this.downloadLink.nativeElement.click();
              }
             
            });

          }
        }
      }

    });
  }
  clear() {
    this.cx?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.lineTo = [];
  }
  drawPaths() {
  
      // delete everything
    this.cx?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // draw all the paths in the paths array
    this.lineTo.forEach((path: any) => {
      this.cx?.beginPath();
      var last = this.lineTo[this.lineTo.length - 1];
      this.cx?.moveTo(last.x, last.y);
      for (let i = 1; i < path.length; i++) {
        this.drawChart(path[i].x, path[i].y);
        this.cx?.lineTo(path[i].x, path[i].y);
      }
      if(this.cx!=null){
      this.cx.strokeStyle = '#88A3B8';
      this.cx?.stroke();
      }
    });
    
    
  }
  undo() {
    this.lineTo.splice(-1, 1);

    this.cx?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.lineTo.forEach((path: any, i: any) => {

      this.cx?.beginPath();

      this.drawChart(path.x, path.y);

      if (this.lineTo.length > i + 1) {
        this.cx?.lineTo(this.lineTo[i + 1].x, this.lineTo[i + 1].y);
      }

      //this.cx?.strokeStyle = '#0652DD';
      this.cx?.stroke();
    });
  }
}

