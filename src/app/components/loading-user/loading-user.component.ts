import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {ConfigurationService} from "../../services/configuration.service";
import {LanguageComponent} from "../language-component";
import {BoardService} from '../../services/board.service';
import {MultilinguismService} from "../../services/multilinguism.service";

// @ts-ignore
@Component({
  selector: 'app-loading-user',
  templateUrl: './loading-user.component.html',
  styleUrls: ['./loading-user.component.css'],
})
export class LoadingUserComponent extends LanguageComponent implements OnInit {

  username: string = "";

  constructor(private userPageService: UserPageService,
              private indexeddbaccessService: IndexeddbaccessService,
              public configurationService: ConfigurationService,
              public boardService: BoardService,
              public route: ActivatedRoute,
              public router: Router,
              public multilinguism: MultilinguismService
              ) {
    super(configurationService, route );
  }

  ngOnInit(): void {
    this.getAndSetLanguageValueIfNeeded();
    this.username = String(this.route.snapshot.paramMap.get('id'));
    this.boardService.AFSR = true;
    this.indexeddbaccessService.loadUserOfUsersList(this.username);

  }

}
