export class News{
    id : string;
    title:string;
    subtitle:string;
    body:string;
    image:any;
    author_id:number;
    likes:Array<{user_id:number}>;
    comments:Array<{user_id:number,comment:string}>;
    created_at:Date = new Date();
    published_at:Date;
    status:boolean;

    constructor({id,title,subtitle,body,image,author_id,status}){
        this.id = id || Date.now().toString();
        this.title = title;
        this.subtitle = subtitle;
        this.body = body;
        this.image = image;
        this.author_id = author_id;
        this.status = status || false;
        this.comments = [];
        this.likes = [];
    }
}