import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigninPage } from '../signin/signin';
import { ValidationServiceProvider } from '../../providers/provider'
import { NewsServices } from '../../services/news.services';
import {User} from '../../models/User'

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;
  public users:any = new Array();
  constructor(public events:Events,public viewCtrl: ViewController, public alertController: AlertController,public service: NewsServices,public navCtrl: NavController, public navParams: NavParams,public fb: FormBuilder) {
    this.cargar();
    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,18}$/)]],
      confirmPassword: ['', [Validators.required]],
    },{
      validator: ValidationServiceProvider.MatchPassword
    });


  }

  ionViewDidLoad() {
  }

  ngOnInit(){
  }

  signup(){
    var data = this.signupForm.value;
    if(!this.checkEmail(data.email)){
      data.password = this.service.encrypt(data.password);
      var user = new User(data);
      try{
        this.service.addUpUser(user);
        this.presentAlert('Registro exitoso!','Alert');
        this.signupForm.reset();
      }catch(error){
        this.presentAlert('Error al guardar registro! '+error.toString(),'Error');
      }
    }else{
      this.presentAlert('Email ya ha sido registrado en otra cuenta!','Warning');
    }
  }

  checkEmail(email:string){
    var user = this.users.find(user => user.email === email);
    if(user !== null && this.users.length > 0)return true;
    return false;
  }

  cargar() {
    this.service.getAllUsers().valueChanges().subscribe( (users)=>{
      if(users)this.users = users;
      else this.users = new Array();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openSignin(){
    this.dismiss();
    this.events.publish('openModal',SigninPage);
  }

  gotoNextField(event,nextElement){
    if (event.key === "Enter") {
      nextElement.setFocus();
    }
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
