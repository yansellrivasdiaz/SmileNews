import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ValidationServiceProvider {
    constructor(){
        
    }

    //Validation for password and confirm password
    static MatchPassword(AC:AbstractControl){
        const password = AC.get('password').value
        const confirmPassword = AC.get('confirmPassword').value
        if(password != confirmPassword){
            AC.get('confirmPassword').setErrors({ MatchPassword : true })
        }else{
            AC.get('confirmPassword').setErrors(null);
        }
    }

    //Validation for password and confirm password
    static RequiredPasswordIfNullId(AC:AbstractControl){
        const id = AC.get('id').value
        if(id && id != null && parseInt(id) > 0){
            AC.get('password').setErrors(null);
        }else{
            const password = AC.get('password').value || "";
            if(password == ""){
                AC.get('password').setErrors({ required : true,pattern: false })
            }else{
                let testpass = password.search(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,18}$/);
                if(testpass == 0){
                    AC.get('password').setErrors(null); 
                }else{
                    AC.get('password').setErrors({ required : false,pattern:true }); 
                }
            }
        }
    }
}