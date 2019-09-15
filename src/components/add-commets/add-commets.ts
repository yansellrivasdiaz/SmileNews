import { Component, Input } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsServices } from '../../services/news.services';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the AddCommetsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-commets',
  templateUrl: 'add-commets.html'
})
export class AddCommetsComponent {
  commentForm: FormGroup;
  @Input('news') news:any;
  constructor(public events: Events,public auth: AuthServiceProvider,public alertController: AlertController, public service: NewsServices, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  addComment(){
    var data = this.commentForm.value;
    var user = this.auth.getUser();
    if(data.comment && data.comment.trim() != "" && user){
      let comment = {id: Date.now().toString(),comment:data.comment,user_id:user.id,created_at:new Date()};
      comment = JSON.parse(JSON.stringify(comment));
      try{
        this.service.commentNews(this.news,comment);
        this.service.getAllComments(this.news).valueChanges().subscribe(comments => {
          this.events.publish('news:update',comments);
        }) 
        this.commentForm.reset();
      }catch(error){
        this.presentAlert('Comment error, try again..','Error');
      }
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
