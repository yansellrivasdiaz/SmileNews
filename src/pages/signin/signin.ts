import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Events, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewsServices } from '../../services/news.services';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DataSharingService } from '../../services/behavior.subject.services';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  loader:any;
  signinForm: FormGroup;
  public users:any = [];
  constructor(public viewCtrl: ViewController, public dataSharingService: DataSharingService,public events: Events,public authService: AuthServiceProvider,public service: NewsServices,public alertController: AlertController ,public navCtrl: NavController, public navParams: NavParams,public fb: FormBuilder, public loadingCtrl: LoadingController) {
    this.cargar();
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberme: [false],
    });
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop:true,
    });
    this.loader.present();
  }

  ionViewDidLoad() {
    var rememberme = this.service.getRememberMe();
    if(rememberme["email"])this.signinForm.patchValue({email: rememberme["email"]});
    if(rememberme["password"])this.signinForm.patchValue({password:rememberme["password"]});
    if(rememberme["rememberme"])this.signinForm.patchValue({rememberme:rememberme["rememberme"]});
    this.loader.dismiss();
  }

  signin(){
    this.loader = this.loadingCtrl.create({
      content: "Iniciando sesión...",
      showBackdrop:true,
    });
    this.loader.present();
    var {email,password} = this.signinForm.value;
    var user = this.users.find(user => user.email === email);
    if(user != undefined && user.status == true && password == this.service.decrypt(user.password)){
      this.authService.login(user);      
      this.dataSharingService.isUserLoggedIn.next(true);
      this.events.publish('updatesession');
      this.loader.dismiss();
      this.dismiss();
    }else{
      this.loader.dismiss();
      this.presentAlert('Credenciales incorrectas!','Warinig');
    }
  }

  rememberMe(event){
    if(event.checked){
      this.service.rememberMe(this.signinForm.value);
    }else{
      this.service.rememberMe(null);
    }
  }

  openSignup(){
    this.dismiss();
    this.events.publish('openModal',SignupPage);
  }

  gotoNextField(event,nextElement){
    if (event.key === "Enter") {
      nextElement.setFocus();
    }
  }

  cargar() {
    this.service.getAllUsers().valueChanges().subscribe( (users)=>{
      this.users = users;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async presentAlert(message:string,title:string) {
    const alert = await this.alertController.create({
      title: title,
      subTitle: null,
      message: message,
      buttons: ['Cerrar']
    });
  
     await alert.present();
  }

}
