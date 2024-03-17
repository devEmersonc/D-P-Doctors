import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges{
  
  @Input() paginator:any;

  pages: number[];

  from: number;
  until:number;

  constructor(private route:Router){}

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges){
    let updatedPager = changes['paginator'];
    if(updatedPager.previousValue){
      this.initPaginator();
      window.scrollTo(0,0)
    }
    
  };

  private initPaginator():void{
    this.from = Math.min(Math.max(1, this.paginator.number-4), this.paginator.totalPages-5);
    this.until = Math.max(Math.min(this.paginator.totalPages, this.paginator.number+4), 6);

    if(this.paginator.totalPages>5){
      this.pages = new Array(this.until - this.from + 1).fill(0).map((_value, index) => index + this.from);
    }else{
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_value, index) => index +1 );
    }
  }
}
