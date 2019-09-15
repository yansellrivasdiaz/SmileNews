import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, App, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { UsersPage } from '../pages/users/users';
import { GalleriesPage } from '../pages/galleries/galleries';
import { PostsPage } from '../pages/posts/posts';
import { NewsServices } from '../services/news.services';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { DataSharingService } from '../services/behavior.subject.services';
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, icon: String, component: any,auth:string }>;
  users: any = [];
  user: any;
  avatar: string = '../assets/imgs/reader.svg';
  showmenu: boolean = false;
  isUserLoggedIn: boolean;
  isAdmin:boolean;
  constructor(public photoView: PhotoViewer,public alertController: AlertController,public modalCtrl: ModalController,public dataSharingService: DataSharingService, public appCtrl: App, public events: Events, public authService: AuthServiceProvider, public service: NewsServices, platform: Platform, public statusBar: StatusBar, splashScreen: SplashScreen) {
    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
    
    this.dataSharingService.isUserAdmin.subscribe(value => {
      this.isAdmin = value;
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Home', icon: 'home', component: HomePage, auth:'none' },
      { title: 'Galleries', icon: 'images', component: GalleriesPage, auth:'none' },
      { title: 'Posts', icon: 'paper', component: PostsPage, auth:'admin' },
      { title: 'Users', icon: 'people', component: UsersPage, auth:'admin' }
    ];

    events.subscribe('updatesession', () => {
      this.user = this.authService.getUser();
      if (this.user != null) {
        if (this.user.avatar && this.user.avatar.trim() != '') this.avatar = this.user.avatar;
      }
    });

    events.subscribe('goToPage', (page) => {
      this.nav.setRoot(page);
    });

    events.subscribe('openModal', (page) => {
      if(page){
        const modal = this.modalCtrl.create(page);
        modal.onDidDismiss(data => {
          if (data) {
            
          }
        });
        modal.present();
      }
    });

  }

  checkIsAdmin(){
    if(this.authService.authenticated() && this.authService.getUser().isAdmin) return false;
    return true;
  }

  ionViewDidLoad() {
    if(this.authService.authenticated){
      this.dataSharingService.isUserAdmin.next(this.authService.getUser().isAdmin);
    }else{
      this.dataSharingService.isUserAdmin.next(false);
    }
  }

  ZoonAvatar(avatar){
    this.photoView.show(avatar,this.authService.getUser().fullname,{share:false});
  }

  async getAllUsers() {
    this.users = await this.service.getAllUsers();
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

  openPage(page) {
    this.nav.setRoot(page.component).catch(err => {
      this.presentAlert('No Authorized','Error');
    });
  }
}

