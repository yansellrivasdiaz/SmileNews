import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
@Injectable()
export class NewsServices {
    StorageData: string = 'sn-user';
    RememberMeData: string = 'sn-rememberme';
    key: string = '5114fhskdj6516fhkdfvnc5498xnvxkjcvk645jsdhfksjd';
    constructor(public AFDB: AngularFireDatabase) { }
    public addUpNews(news) {
        var url = 'news/' + news.id;
        this.AFDB.database.ref(url).set(news);
    }
    public getAllNews() {
        return this.AFDB.list("news");
    }
    public getAllComments(news) {
        return this.AFDB.list("news/"+news.id+"/comments");
    }
    public getAllImages() {
        return this.AFDB.list("images");
    }
    public addUpImage(image) {
        var url = 'images/' + image.id;
        this.AFDB.database.ref(url).set(image);
    }
    public getAllLikes(news){
        return this.AFDB.database.ref("news/"+news.id+"/likes").toJSON();
    }
    public removeNews(news) {
        var url = 'news/' + news.id;
        var result = this.AFDB.database.ref(url).remove().catch(error => {
            return error;
        }).then(() => {
            return {
                error: false,
                message: "Deleted successfully!",
                item: news
            };
        });
        return result;
    }

    public deleteImage(image) {
        var url = 'images/' + image.id;
        var result = this.AFDB.database.ref(url).remove().catch(error => {
            return error;
        }).then(() => {
            return {
                error: false,
                message: "Deleted successfully!",
                item: image
            };
        });
        return result;
    }

    public commentNews(news, comment) {
        var url = 'news/' + news.id + '/comments/' + comment.id;
        return this.AFDB.database.ref(url).set(comment);
    }

    public likeNews(news, like) {
        var url = 'news/' + news.id + '/likes/' + like.id;
        return this.AFDB.database.ref(url).set(like);
    }

    public unlikeNews(news, like) {
        var url = 'news/' + news.id + '/likes/' + like.id;
        return this.AFDB.database.ref(url).remove();
    }

    public getNewsById(id:number) {
        return this.AFDB.list("news/"+id);
    }

    public getAllUsers() {
        return this.AFDB.list("users");
    }

    public updateUser(user) {
        var url = 'users/' + user.id;
        return this.AFDB.database.ref(url).set(user);
    }

    public getUserById(id:number) {
        
    }

    public addUpUser(user) {
        var url = 'users/' + user.id;
        return this.AFDB.database.ref(url).set(user);
    }

    public rememberMe(user) {
        var response = false;
        if (user !== null) {
            try {
                user.rememberme = "yes";
                localStorage.setItem(this.RememberMeData, JSON.stringify(user));
                response = true;
            } catch (error) { }
            return response;
        }
        localStorage.removeItem(this.RememberMeData);
    }
    public getRememberMe() {
        var response = {};
        try {
            if (localStorage.getItem(this.RememberMeData)) {
                response = JSON.parse(localStorage.getItem(this.RememberMeData));
                response["rememberme"] = true;
            }
        } catch (error) { }
        return response;
    }
    public encrypt(plainPassword: string) {
        if (plainPassword.trim() !== "") return CryptoJS.AES.encrypt(plainPassword.trim(), this.key.trim()).toString();
        return null;
    }
    public decrypt(encPassword: string) {
        if (encPassword.trim() !== "") return CryptoJS.AES.decrypt(encPassword.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
        return null;
    }

    public textFormatter(text: string) {
        var formatterText = '';
        if (text && text.trim() != "") formatterText = '<p>' + text.replace(/\n/g, '</p><p>') + '</p>';
        return formatterText;
    }

    public formatDate(date) {
        moment.locale('es-do');
        let dayspass = moment(date).startOf('hour').fromNow();
        if (dayspass.match(/(\d+)/) && parseInt(dayspass.match(/(\d+)/)[0]) > 24) {
            return moment(date).format('DD-MM-YYYY')
        }
        return moment(date).fromNow();
    }

    public objectToArray(object){
        if(typeof object === 'object'){
            var data = Object.keys(object).map(function(key) {
                return [Number(key), object[key]];
            });
            return data;
        }

        if(Array.isArray(object)){
            return object;
        }
        
        return [];
    }
}