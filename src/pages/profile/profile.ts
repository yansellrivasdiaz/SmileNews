import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController, AlertController, Events } from 'ionic-angular';
import { UploadOptionsComponent } from '../../components/upload-options/upload-options';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { User } from '../../models/User';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationServiceProvider } from '../../providers/provider';
import { NewsServices } from '../../services/news.services';
import { DataSharingService } from '../../services/behavior.subject.services';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  avatar: any;
  changePassword:boolean = true;
  changeInfo:boolean = true;
  user:User = null;
  changePasswordForm: FormGroup;
  changeInfoForm: FormGroup;
  constructor(public photoViewer: PhotoViewer,public dataSharingService: DataSharingService,public events: Events,public service: NewsServices,public fb: FormBuilder,public auth: AuthServiceProvider,public alertController: AlertController,public camera: Camera,public popoverCtrl: PopoverController,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    if(this.auth.authenticated())this.user = new User(JSON.parse(JSON.stringify(this.auth.getUser())));
    
    this.changePasswordForm = this.fb.group({
      oldPassword: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,18}$/)]],
      confirmPassword: ['',[Validators.required]],
    },{
      validator: ValidationServiceProvider.MatchPassword
    });

    this.changeInfoForm = this.fb.group({
      avatar: [''],
      phoneNumber: [''],
      fullname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
    });

  }
  ZoonAvatar(avatar){
    this.photoViewer.show(avatar,this.auth.getUser().fullname,{share:false});
  }
  resetForm(form){
    form.reset();
    this.cancelEdition();
  }
  updateInfo(){
      var infoData = this.changeInfoForm.value;
      if(infoData.fullname !== this.user.fullname)this.user.fullname = infoData.fullname;
      if(infoData.phoneNumber !== this.user.phoneNumber)this.user.phoneNumber = infoData.phoneNumber;
      if(infoData.avatar !== this.user.avatar)this.user.avatar = infoData.avatar;
      if(infoData.birthday !== this.user.birthday)this.user.birthday = infoData.birthday;
      try{
        this.service.updateUser(this.user);
        this.auth.login(this.user);
        this.dataSharingService.isUserLoggedIn.next(true);
        this.events.publish('updatesession');
        this.presentAlert('Profile updated successfully!','Success');
        this.resetForm(this.changeInfoForm);
      }catch(error){
        this.presentAlert('Problem updating the profile info, try again!','Error');
        console.log(error);
      }
  }

  updatePassword(){
    if(this.service.decrypt(this.user.password) === infoData.oldPassword){
      if(infoData.oldPassword != infoData.password){
        var infoData = this.changePasswordForm.value;
        var password = this.service.encrypt(infoData.password);
        this.user.password = password;
        try{
          this.service.updateUser(this.user);
          this.resetForm(this.changePasswordForm);
          this.presentAlert('Password updated successfully!','Success');
        }catch(error){
          this.presentAlert('Problem updating the password, try again!','Error');
          console.log(error);
        }
      }else{
        this.presentAlert('Old password and new password can\'t equals!','Warning');
      }
    }else{
      this.presentAlert('Old password is incorrect!','Warning');
    }
  }

  ionViewDidLoad() {
    this.updateInfoForm();
  }

  updateInfoForm(){
    this.user = new User(JSON.parse(JSON.stringify(this.auth.getUser())));
    if(this.auth.authenticated() && this.user){
      this.avatar = this.user.avatar;
      this.changeInfoForm.patchValue({
        avatar: this.user.avatar,
        phoneNumber: this.user.phoneNumber,
        fullname: this.user.fullname,
        birthday: this.user.birthday,
      });
    }
  }

  formatDate(date){
    moment.locale('es-do');
    return moment(date).format('LL');
  }

  ionViewCanEnter(){
    return this.auth.authenticated();
  }

  cancelEdition(){
    this.changePassword = true;
    this.changeInfo = true;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(UploadOptionsComponent);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if (popoverData) {
        if(popoverData.slug == 'camera'){
          this.takePhoto();
        }
        if(popoverData.slug == 'gallery'){
          this.uploadPhoto();
        }
      }
    })
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

  takePhoto(){
    const options: CameraOptions = {
      quality:70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE     
    }
    this.camera.getPicture(options).then((ImageData) => {
      this.avatar = 'data:image/jpeg;base64,' + ImageData;
      this.changeInfoForm.patchValue({avatar: this.avatar});
    },(err)=>{      
      console.log(err);
    })
  }

  uploadPhoto(){
    const options: CameraOptions = {
      quality:70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((ImageData) => {
      this.avatar = 'data:image/jpeg;base64,' + ImageData;
      this.changeInfoForm.patchValue({avatar: this.avatar});
    },(err)=>{
      console.log(err);
    })
  }

}
