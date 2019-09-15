import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, AlertController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { UploadOptionsComponent } from '../../components/upload-options/upload-options';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { NewsServices } from '../../services/news.services';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the GalleriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-galleries',
  templateUrl: 'galleries.html',
})
export class GalleriesPage {
  images:any = [];
  photo: any;
  constructor(public alertController: AlertController,public auth: AuthServiceProvider,public service: NewsServices,public camera: Camera,public popoverCtrl: PopoverController,public platForm: Platform,public photoView: PhotoViewer,public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.cargar();
  }

  isAuth(){
    return (this.auth.authenticated() && this.auth.getUser().isAdmin);
  }

  ZoonImage(url){
    this.photoView.show(url,"",{share:true});
  }

  DeleteImage(image){
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
              this.service.deleteImage(JSON.parse(JSON.stringify(image))).then(res=>{
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

  async presentAlert(message: string, title: string) {
    const alert = await this.alertController.create({
      title: title,
      subTitle: null,
      message: message,
      buttons: ['Cerrar']
    });
  
    await alert.present();
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

  doRefresh(event) {
    this.cargar().then(()=>{
      event.complete();
    })
  }

  async cargar() {
    await this.service.getAllImages().valueChanges().subscribe( (images)=>{
      this.images = images.reverse();
    });
  }

  takePhoto(){
    const options: CameraOptions = {
      quality:70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE     
    }
    this.camera.getPicture(options).then((ImageData) => {
      this.photo = 'data:image/jpeg;base64,' + ImageData;
      var image = {id:Date.now().toString(),image:this.photo,created_at:new Date()};
      this.service.addUpImage(JSON.parse(JSON.stringify(image)));
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
      this.photo = 'data:image/jpeg;base64,' + ImageData;      
      var image = {id:Date.now().toString(),image:this.photo,created_at:new Date()};
      this.service.addUpImage(JSON.parse(JSON.stringify(image)));
    },(err)=>{
      console.log(err);
    })
  }

}
