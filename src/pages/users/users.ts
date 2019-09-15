import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController, Events } from 'ionic-angular';
import { NewsServices } from '../../services/news.services';
import { UserFormPage } from '../user-form/user-form';
import { User } from '../../models/User';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  openSearch: boolean;
  loader: any;
  users: any = [];
  virtualUsers: any = [];
  constructor(public events: Events,public authService: AuthServiceProvider,public alertController: AlertController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public service: NewsServices, public navCtrl: NavController, public navParams: NavParams) {
    this.openSearch = false;
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
    });
    this.loader.present();
    this.events.subscribe('search:users', text => {
      this.virtualCargar();
      if(text && text.trim() != ""){
        this.virtualUsers = this.virtualUsers.filter((user) => {
          return ((user.fullname).toLowerCase().indexOf(text.toLowerCase()) > -1 || (user.email).toLowerCase().indexOf(text.toLowerCase()) > -1);
        })
      }
    })
  }

  
  ionViewCanEnter(){
    this.loader.dismiss();
    return this.authService.authenticated() && this.authService.getUser().isAdmin;
  }

  ngOnInit() {
    this.cargar();
  }

  getItems(event) {

  }

  editUser(user) {
    const modal = this.modalCtrl.create(UserFormPage, { user });
    modal.onDidDismiss(data => {
      if (data) {
        if (data.success && data.message) {
          this.presentAlert(data.message, (data.success) ? 'Success' : 'Error');
        }
      }
    });
    modal.present();
  }

  changeStatus(userData) {
    const message = (userData.status) ? 'Sure you want to deactivate the user?' : 'confirm user activation?';
    const confirm = this.alertController.create({
      title: 'Confirm',
      message: message,
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
              var user = new User(JSON.parse(JSON.stringify(userData)));
              const msg = (user.status == true)?'deactivated':'activated';
              user.status = !user.status;
              this.service.addUpUser(JSON.parse(JSON.stringify(user)));
              this.presentAlert('User successfully '+msg,'Success');
            }catch(error){
               this.presentAlert('There was a problem updating the status, try again','Error');
            }
            
          }
        }
      ]
    });
    confirm.present();
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

presentModalAddUser() {
  const modal = this.modalCtrl.create(UserFormPage);
  modal.onDidDismiss(data => {
    if (data) {
      
    }
  });
  modal.present();
}

async cargar() {
  await this.service.getAllUsers().valueChanges().subscribe((users) => {
    this.users = users.reverse();
    this.virtualUsers = this.users;
  });
}

virtualCargar(){
  this.virtualUsers = this.users;
}

doRefresh(event) {
  this.cargar().then(() => {
    event.complete();
  })
}

}
