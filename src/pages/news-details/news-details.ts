import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { NewsServices } from '../../services/news.services';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the NewsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  news:any;
  authenticated:boolean = false;
  idScroll:any;
  @ViewChild(Content) content: Content;
  constructor(public events: Events,public auth: AuthServiceProvider,public service: NewsServices,public navCtrl: NavController, public navParams: NavParams) {
    this.news = this.navParams.get('news');
    this.idScroll = this.navParams.get('y') || null;
    this.events.subscribe('news:update',(comments)=>{
      this.news.comments = comments;
    })
  }
  
  ionViewDidLoad() {    
    this.authenticated = this.auth.authenticated();
  }

  ionViewDidEnter(){    
    if(this.idScroll != null){
      let y = document.getElementById(this.idScroll).offsetTop;
      this.content.scrollTo(0, y);
    }
  }

}
