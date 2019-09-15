import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the UploadOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upload-options',
  templateUrl: 'upload-options.html'
})
export class UploadOptionsComponent {

  pages: Array<{ title: string,icon: String,slug:string }>;

  constructor(public viewCtrl: ViewController) {
    this.pages = [
      {title:'Camera',icon:'md-camera',slug:'camera'},
      {title:'Gallery',icon:'md-photos',slug:'gallery'},
    ]
  }

  dismissPopover(mod) {
    this.viewCtrl.dismiss(mod);
  }

}
