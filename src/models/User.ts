export class User{
    id : string;
    fullname:string;
    phoneNumber:string;
    birthday:Date;
    email:string;
    password:string;
    isAdmin:boolean;
    avatar:string;
    status:boolean;

    constructor({id,fullname,phoneNumber,birthday,email,password,isAdmin,status,avatar}){
        this.id = id || Date.now().toString();
        this.fullname = fullname;
        this.phoneNumber = phoneNumber;
        this.birthday = birthday;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        if(isAdmin == undefined || isAdmin == null )this.isAdmin = false;
        this.status = status;
        if(status == undefined || status == null )this.status = true;
        this.avatar = avatar || '';
    }

    public setId(id:string){
        this.id = id;
    }

    public getId(){
        return this.id;
    }

    public setFullname(fullname:string){
        this.fullname = fullname;
    }

    public setStatus(status:boolean){
        this.status = status;
    }

    public setIsAdmin(isAdmin:boolean){
        this.isAdmin = isAdmin;
    }

    public getFullname(){
        return this.fullname;
    }

    public setEmail(email:string){
        this.email = email;
    }

    public getEmail(){
        return this.email;
    }
}