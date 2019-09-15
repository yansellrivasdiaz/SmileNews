import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, PopoverController, Events } from 'ionic-angular';
import { NewsDetailsPage } from '../news-details/news-details';
import { NewsServices } from '../../services/news.services';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  openSearch: boolean;
  loader: any;
  news: any = [];
  users: any = [];
  virtualNews: any = [];
  constructor(public events: Events,public auth: AuthServiceProvider, public service: NewsServices, public popoverCtrl: PopoverController, public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    this.openSearch = false;
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
    });
    this.loader.present();
    this.events.subscribe('search:news', text => {
      this.virtualCargar();
      if(text && text.trim() != ""){
        this.virtualNews = this.virtualNews.filter((item) => {
          return ((item.title).toLowerCase().indexOf(text.toLowerCase()) > -1 || (item.body).toLowerCase().indexOf(text.toLowerCase()) > -1);
        })
      }
    })
  }

  
  async cargar() {
    await this.service.getAllUsers().valueChanges().subscribe((users) => {
      this.users = users.reverse();
    });
    await this.service.getAllNews().valueChanges().subscribe((posts) => {
      this.news = posts.reverse();
      this.virtualNews = this.news;
    });
  }

  virtualCargar() {
    this.virtualNews = this.news;
  }

  getItems(event) {

  }

  ngOnInit() {
    this.cargar();
  }

  ionViewDidLoad() {
    this.loader.dismiss();
  }


  doRefresh(event) {
    this.cargar().then(() => {
      event.complete();
    });
  }

  async goToComments(posts) {
    posts.author = await this.users.find(user => user.id == posts.author_id);
    if (!posts.author) posts.author = null;
    this.navCtrl.push(NewsDetailsPage, { news: posts, y: 'comments' });
  }

  async showDetails(posts) {
    posts.author = await this.users.find(user => user.id == posts.author_id);
    if (!posts.author) posts.author = null;
    if (posts.comments && posts.comments.lenght > 0) {
      posts.comments.map(async (index, value) => {
        posts.comments[index].author = await this.users.find(user => user.id == value.author_id);
        if (!posts.comments[index].author) posts.comments[index].author = null;
      })
    }
    this.navCtrl.push(NewsDetailsPage, { news: posts });
  }

  likeNews(posts) {
    var likes = this.service.objectToArray(posts.likes);
    var user = this.auth.getUser();
    var like = null;
    likes.map((data) => {
      if(data[1].user_id === user.id)like = data[1];
    });
    if (like == null || like == 'undefined') {
      try {
        var data = { id: Date.now().toString(), user_id: user.id, created_at: new Date() };
        data = JSON.parse(JSON.stringify(data));
        this.service.likeNews(posts, data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        this.service.unlikeNews(posts, like);
      } catch (error) {
        console.log(error);
      }
    }

  }

}
