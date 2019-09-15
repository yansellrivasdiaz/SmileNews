import { Component } from '@angular/core';
import { ViewController, AlertController, Events } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import { SigninPage } from '../../pages/signin/signin';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DataSharingService } from '../../services/behavior.subject.services';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  pages: Array<{ title: string, icon: String, component: any, auth: string }>;
  isUserLoggedIn: boolean;
  constructor(public events:Events,public alertController: AlertController,public viewCtrl: ViewController, public authService: AuthServiceProvider, public dataSharingService: DataSharingService) {
    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
    this.pages = [
      { title: 'Profile', icon: 'contact', component: ProfilePage, auth: 'loggedIn' },
      { title: 'Signin', icon: 'log-in', component: SigninPage, auth: 'none' },
    ]
  }


  dismissPopover(mod) {
    this.viewCtrl.dismiss(mod);
  }


  logout() {
      const confirm = this.alertController.create({
      title: 'Confirm',
      message: 'Sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.authService.logout();
            this.dataSharingService.isUserLoggedIn.next(false);
            this.viewCtrl.dismiss({ title: 'Logout', icon: 'log-out', component: SigninPage });
            this.events.publish('goToPage',HomePage);
          }
        }
      ]
    });
    confirm.present();
  }

}
