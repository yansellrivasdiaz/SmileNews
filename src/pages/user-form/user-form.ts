import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationServiceProvider } from '../../providers/provider';
import { UploadOptionsComponent } from '../../components/upload-options/upload-options';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { User } from '../../models/User';
import { NewsServices } from '../../services/news.services';

/**
 * Generated class for the UserFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-form',
  templateUrl: 'user-form.html',
})
export class UserFormPage {
  loader:any;
  userForm: FormGroup;
  avatar: any;
  user:any;
  constructor(public loadingCtrl: LoadingController,public service: NewsServices,public alertController: AlertController,public camera: Camera,public popoverCtrl: PopoverController,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop:true,
    });
    this.loader.present();
    this.user = this.navParams.get("user");
    this.userForm = this.fb.group({
      id: [null],
      avatar: [''],
      phoneNumber: [''],
      fullname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password: [''],
      confirmPassword: ['',[Validators.required]],
      status: [false, { onlySelf: true }],
      isAdmin: [false, { onlySelf: true }],
    },{
      validator: [ValidationServiceProvider.MatchPassword,ValidationServiceProvider.RequiredPasswordIfNullId]
    });
  }

  ionViewDidLoad() {
    if(this.user){
      this.avatar = this.user.avatar;
      this.userForm.patchValue({
        id: this.user.id || null,
        avatar: this.user.avatar || null,
        fullname: this.user.fullname || '',
        phoneNumber: this.user.phoneNumber || '',
        birthday: this.user.birthday || '',
        email: this.user.email || '',
        status: this.user.status || false,
        isAdmin: this.user.isAdmin || false,
      });
    }
    this.loader.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  gotoNextField(event,nextElement){
    if (event.key === "Enter") {
      nextElement.setFocus();
    }
  }

  resetFormUser(){
    this.avatar = '../../assets/imgs/reader.svg';
    this.userForm.reset();
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
      this.userForm.patchValue({avatar: this.avatar});
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
      this.userForm.patchValue({avatar: this.avatar});
    },(err)=>{
      console.log(err)
    })
  }

  updateUser(){
    try{
      var userData = JSON.parse(JSON.stringify(this.userForm.value));
      if(userData.password === ""){
        userData.password = this.user.password;
      }else{
        userData.password = this.service.encrypt(userData.password);
      }
      var user = new User(userData);
      this.service.addUpUser(JSON.parse(JSON.stringify(user)));
      this.resetFormUser();
      this.viewCtrl.dismiss({success:true,message:'User updated successfully'});
    }catch(error){
      this.presentAlert('Problem updating user','Error');
    }
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

}
