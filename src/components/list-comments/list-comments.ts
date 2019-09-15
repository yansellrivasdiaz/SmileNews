import { Component, Input } from '@angular/core';
import { NewsServices } from '../../services/news.services';

/**
 * Generated class for the ListCommentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-comments',
  templateUrl: 'list-comments.html'
})
export class ListCommentsComponent {

  @Input('news') news:any;
  comments:any = [];
  users:any = [];
  constructor(public service: NewsServices) {
    if(this.news && this.news.comments)this.comments = this.news.comments || [];
  }

  ngOnInit(){
    this.cargarUsers();
    this.cargarComentarios();
  }

  cargarComentarios(){
    this.service.getAllComments(this.news).valueChanges().subscribe(comments => {
      var users = this.users;
      comments.map((value,index)=>{
        comments[index]['user'] = users.find(user => user.id === value['user_id']);
      });
      this.comments = comments.reverse();
    });
  }

  cargarUsers(){
    this.service.getAllUsers().valueChanges().subscribe(users => {
      this.users = users.reverse();
    });
  }

}
