import {Component, OnInit} from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';

@Component({
  selector: 'app-page-title-management',
  templateUrl: './page-title-management.component.html',
  styleUrls: ['./page-title-management.component.css']
})
export class PageTitleManagementComponent implements OnInit {

  constructor(public  usertoolbarService: UsertoolbarService) {
  }

  ngOnInit(): void {
  }

}
