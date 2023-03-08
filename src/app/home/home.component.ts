import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize } from 'rxjs/operators';


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
  firstX: any;
  firstY: any;
  canDraw = true;
  keepX: any;
  keepY: any;
  drawingSubscription: Subscription = new Subscription();
  lineTo: any = [];
  imgTo: any = [];
  constructor() {
    this.cx = null;
    this.im_1 = null;
    this.canvas = null;
  }


  ngAfterViewInit() {
    const canvasElem: HTMLCanvasElement = this.canvas?.nativeElement;
    this.cx = canvasElem.getContext('2d');
    this.im_1 = canvasElem.getContext('2d');
    this.canvasWidth = this.canvas?.nativeElement.clientWidth;
    console.log(this.canvas)
    canvasElem.width = this.canvas?.nativeElement.clientWidth;
    canvasElem.height = this.canvasHeight;
    // this.cx?.fillStyle = 'rgba(255,63,52,0.15)';
    // this.cx?.strokeStyle = '#c23616';
    // this.cx?.lineWidth = 2;
    const mouseDownStream = fromEvent(this.canvas?.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas?.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    
    mouseMoveStream.pipe(
      tap((event: any) => {
        if (!this.canDraw && this.im_1 != null && this.cx != null) {
          this.im_1.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.cx?.arc(this.firstX, this.firstY, 2, 0, Math.PI * 2);
          this.cx.fillStyle = "#EEF3F9";
          this.cx.strokeStyle = '#88A3B8';
          this.cx.lineWidth = 7;
          this.cx.beginPath();
          this.cx.moveTo(this.firstX, this.firstY);
          this.lineTo.forEach((el: { x: number; y: number }) => {
            if (this.cx != null) {
              this.cx.lineTo(el.x, el.y);
            }
          });
          this.cx?.stroke();
          this.cx.closePath();
          this.cx.fill();
        
          this.imgTo.forEach((el: { x: number; y: number, w: number, h:number, type: string }) => {
            if (this.cx != null) {
              var iim = document.getElementById(el.type) as HTMLCanvasElement;
              this.cx.drawImage(iim,el.x, el.y, el.w, el.h);

              if(event.offsetX-el.x <=el.w && event.offsetX-el.x >=0  && event.offsetY-el.y <=el.h && event.offsetY-el.y >=0){
                console.log(event.offsetX,el.x, event.offsetY, el.y)
              
                // this.cx.lineWidth=2;
                // this.cx.strokeStyle = "#5f3eef";
                // this.cx.shadowColor="#5f3eef";
                // this.cx.shadowBlur=10;
                // this.cx.strokeRect(el.x-1, el.y-1, el.w+1, el.h+1);
                // this.cx.shadowBlur = 0;
                this.cx.font = "15px";
                this.cx.fillStyle = "#5f3eef";
                this.cx.strokeStyle = "#fafafa";
                this.cx.lineWidth=2;
                this.cx.fillRect(el.x + el.w/3 + 10,  el.y + el.h/3-30, 130, 30)
                this.cx.fillStyle = "white";
                this.cx.fillText("Desk "+ el.x  , el.x + el.w/3 + 5 + 10, el.y + el.h/3-15);
                this.cx.strokeRect(el.x + el.w/3-1 + 10,el.y + el.h/3, 131, 41);
                this.cx.fillStyle = "white";
                this.cx.fillRect(el.x + el.w/3 + 10,  el.y + el.h/3, 130, 40)
                this.cx.strokeRect(el.x + el.w/3-1 + 10,el.y + el.h/3, 131, 41);
                this.cx.fillStyle = "#88A3B8";
                this.cx.fillText("Hi "+ el.x  , el.x + el.w/2 + 5 + 10, el.y + el.h/2 + 15);
              }
            }
          });
       
         
         
        }

        console.log(event.offsetX, event.offsetY)
      })
    ).subscribe(console.log);

    mouseDownStream.pipe(
      tap((event: any) => {
        if (!this.canDraw && this.im_1 != null && this.cx != null) {
          this.im_1.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.cx?.arc(this.firstX, this.firstY, 2, 0, Math.PI * 2);
          this.cx.fillStyle = "#EEF3F9";
          this.cx.strokeStyle = '#88A3B8';
          this.cx.lineWidth = 7;
          this.cx.beginPath();
          this.cx.moveTo(this.firstX, this.firstY);
          this.lineTo.forEach((el: { x: number; y: number }) => {
            if (this.cx != null) {
              this.cx.lineTo(el.x, el.y);
            }
          });
          this.cx?.stroke();
          this.cx.closePath();
          this.cx.fill();
        
        
          if(this.keepX==null){
            this.keepX = event.offsetX;
            this.keepY = event.offsetY;
            var iim = document.getElementById("imageSrc2") as HTMLCanvasElement;
            this.imgTo.push({x:event.offsetX, y:event.offsetY, w:iim.width, h:iim.height, type:"imageSrc2"});
          }
          
          this.imgTo.forEach((el: { x: number; y: number, w: number, h:number, type: string }) => {
            if (this.cx != null) {
              var iim = document.getElementById(el.type) as HTMLCanvasElement;
              this.cx.drawImage(iim,el.x, el.y, el.w, el.h);

              if(event.offsetX-el.x <=el.w && event.offsetX-el.x >=0  && event.offsetY-el.y <=el.h && event.offsetY-el.y >=0){
                console.log(event.offsetX,el.x, event.offsetY, el.y)
              }
            }
          });
       
         
         
        }

        console.log(event.offsetX, event.offsetY)
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: any) => {
          event.preventDefault();
          event.stopPropagation();
         console.log("mmmm")
  
        }),
        takeUntil(mouseUpStream),
        finalize(() => {

        })
      ))
    ).subscribe(console.log);



    this.captureEvents(canvasElem);
  }
  drawChart(x: number, y: number) {
    if (this.cx != null) {
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

    canvasEl.addEventListener('mousedown', (e) => {
      if (this.canDraw) {
        startX = null;
        startY = null;

        const rect = canvasEl.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        if (this.firstX == null) {
          this.firstX = startX;
          this.firstY = startY;
        }
        else if (Math.abs(this.firstX - startX) <= 5 && Math.abs(this.firstY - startY) <= 5) {
          console.log('stop here', startX, startY);
          this.canDraw = false;


        }
        console.log('test here', startX, startY);
        this.drawChart(startX, startY);
        //this.lineTo.push({ x: startX, y: startY });
        //tempArray.push({ x: startX, y: startY });
        // console.log(tempArray)
        if (this.lineTo.length > 0) {
          if (this.cx != null) {
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
        if (!this.canDraw) {
          if (this.cx != null && this.canvas != null) {
            this.cx.fillStyle = "#EEF3F9";
            this.cx.beginPath();
            this.cx.moveTo(this.firstX, this.firstY);
            this.lineTo.forEach((el: { x: number; y: number }) => {
              if (this.cx != null) {
                this.cx.lineTo(el.x, el.y);
              }
            });

            this.cx.closePath();
            this.cx.fill();



            // if (this.im_1 != null) {
            //   var iim = document.getElementById("imageSrc") as HTMLCanvasElement;
            //   this.im_1.drawImage(iim, 0, 0, iim.width, iim.height);
            // }


            html2canvas(this.canvas.nativeElement, { backgroundColor: null }).then(canvas => {
              if (this.canvas != null && this.downloadLink) {

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
      if (this.cx != null) {
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

