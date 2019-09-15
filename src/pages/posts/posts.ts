import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Events } from 'ionic-angular';
import { PublishformPage } from '../publishform/publishform';
import { NewsServices } from '../../services/news.services';
import { NewsDetailsPage } from '../news-details/news-details';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the PostsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {
  loader:any;
  openSearch:boolean;
  news: any = [];
  virtualNews: any = [];
  users: any = [];
  constructor(public events: Events,public authService: AuthServiceProvider,public alertController: AlertController,public service: NewsServices,public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController, public loadingCtrl: LoadingController) {
    this.openSearch = false;
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop:true,
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

  ionViewCanEnter(){
    this.loader.dismiss();
    return (this.authService.authenticated && this.authService.getUser() && this.authService.getUser().isAdmin);
  }

  ngOnInit(){
    this.cargar();
  }

  ionViewDidLoad() {
    
  }

  getItems(event){

  }
  
  presentModalAddNews() {    
    const modal = this.modalCtrl.create(PublishformPage);
    modal.onDidDismiss(data => {
      if(data){
        
      }
    });
    modal.present();
  } 
  
  async cargar() {
    await this.service.getAllUsers().valueChanges().subscribe( (users)=>{
      this.users = users.reverse();
    });
    await this.service.getAllNews().valueChanges().subscribe( (posts)=>{
      this.news = posts.reverse();
      this.virtualNews = this.news;
    });
  }

  virtualCargar(){
    this.virtualNews = this.news;
  }

  shareUnShare(posts){
    const msg = (posts.status == true)?'Unshared':'Shared';
    posts.status = !posts.status;
    this.service.addUpNews(JSON.parse(JSON.stringify(posts)));
    this.presentAlert('News successfully '+msg,'Success');
  }

  deletePost(posts){
    const confirm = this.alertController.create({
      title: 'Confirm!',
      message: 'Sure you want to delete the news?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            try{
              this.service.removeNews(JSON.parse(JSON.stringify(posts))).then(res=>{
                this.presentAlert(res.message,'Success');
              });
            }catch(error){
               this.presentAlert('There was a problem removing the news, try again','Error');
            }
            
          }
        }
      ]
    });
    confirm.present();
  }

  editPosts(posts) {
    const modal = this.modalCtrl.create(PublishformPage, { posts });
    modal.onDidDismiss(data => {
      if (data) {
        if (data.success && data.message) {
          this.presentAlert(data.message, (data.success) ? 'Success' : 'Error');
        }
      }
    });
    modal.present();
  }

  async presentAlert(message: string, title: string) {
    const alert = await this.alertController.create({
      title: title,
      subTitle: null,
      message: message,
      buttons: ['Cerrar']
    });
  
    await alert.present();
  }

  doRefresh(event) {
    this.cargar().then(()=>{
      event.complete();
    })
  }

  async showDetails(posts){
    posts.author = await this.users.find(user => user.id == posts.author_id);
    if(!posts.author)posts.author=null;
    if(posts.comments && posts.comments.lenght > 0){
      posts.comments.map(async (index,value)=>{
        posts.comments[index].author = await this.users.find(user => user.id == value.author_id);
        if(!posts.comments[index].author)posts.comments[index].author=null;
      })
    }
    this.navCtrl.push(NewsDetailsPage,{news:posts});
  }

}
