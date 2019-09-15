import { Component, Input } from '@angular/core';
import { PopoverComponent } from '../popover/popover';
import { PopoverController, ModalController, Events } from 'ionic-angular';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  openSearch:boolean;
  @Input('title') title:any;
  @Input('search') search:any;
  constructor(public popoverCtrl: PopoverController, public modalCtrl:ModalController,public events: Events) {
    this.openSearch = false;
  }

  presentPopover(myEvent){
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if(popoverData && popoverData.title != 'Logout'){
        this.events.publish('openModal',popoverData.component);
      }
    })
  }

  getItems(event){
    var text = event.target.value;
    this.events.publish('search:'+this.search,text);
  }

}
