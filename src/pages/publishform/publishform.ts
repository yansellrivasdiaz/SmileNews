import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, PopoverController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsServices } from '../../services/news.services';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadOptionsComponent } from '../../components/upload-options/upload-options';
import { News } from '../../models/News';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the PublishformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publishform',
  templateUrl: 'publishform.html',
})
export class PublishformPage {
  loader:any;
  newsForm: FormGroup;
  image: any;
  posts:any;
  constructor(public auth: AuthServiceProvider,public loadingCtrl: LoadingController,public popoverCtrl: PopoverController,private camera: Camera, public alertController: AlertController, public service: NewsServices, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fb: FormBuilder) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop:true,
    });
    this.loader.present();
    this.posts = this.navParams.get("posts");
    this.image = null;
    this.newsForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      body: ['', [Validators.required]],
      status: [false, { onlySelf: true }],
      image: [''],
    });
  }

  ionViewDidLoad() {
    if(this.posts){
      this.image = this.posts.image;
      this.newsForm.patchValue({
        id: this.posts.id || null,
        image: this.posts.image || null,
        title: this.posts.title ||  '',
        subtitle: this.posts.subtitle || '',
        body: this.posts.body || '',
        status: this.posts.status || false,
      });
    }
    this.loader.dismiss();
  }

  ngOnInit() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  gotoNextField(event, nextElement) {
    if (event.key === "Enter") {
      nextElement.setFocus();
    }
  }

  updateNews() {
    var newsData = JSON.parse(JSON.stringify(this.newsForm.value));
    newsData.author_id = this.auth.getUser().id;
    var news = new News(newsData);
    try{
      this.service.addUpNews(JSON.parse(JSON.stringify(news)));      
      this.resetNews();
      this.viewCtrl.dismiss({success:true,message:'Posts updated successfully...'});
    }catch(error){
      this.presentAlert('An error occurred while saving the posts','Error saving');
    }
  }

  resetNews(){
    this.image = '../../assets/imgs/noimage.png';
    this.newsForm.reset();
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
      this.image = 'data:image/jpeg;base64,' + ImageData;
      this.newsForm.patchValue({image: this.image});
    },(err)=>{
      this.presentAlert('Error uploading the photo, Try again','Error uploading');
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
      this.image = 'data:image/jpeg;base64,' + ImageData;
      this.newsForm.patchValue({image: this.image});
    },(err)=>{
      this.presentAlert('Error uploading the photo, Try again','Error uploading');
    })
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
        console.log(popoverData);
      }
    })
  }

}
