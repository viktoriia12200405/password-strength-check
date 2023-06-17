import { Component } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { PasswordStrengthEnum } from 'src/app/enums/password-strength-enum';

const weakRegex = /^([a-zA-Z]+|[!@#$%^&*]+|[0-9]+)$/;
const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])|(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[0-9])(?=.*[!@#$%^&*])+.*$/;
const strongRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).+$/;

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})

export class PasswordComponent {
    sectionsLength = 3;
    inputType$ = new BehaviorSubject<string>('password');
    buttonText$ = this.inputType$.pipe(map(type => (type === 'password' ? 'Show' : 'Hide')));
    sections$: BehaviorSubject<string>[] = [];

    ngOnInit() {
        this.sections$ = Array.from({ length: this.sectionsLength }, () => new BehaviorSubject<string>(PasswordStrengthEnum[PasswordStrengthEnum.default]));
    }

    onPasswordChange(event: any) {
        const strength = this.calculatePasswordStrength(event!.target.value);
        this.sections$.forEach(x => {
            x.next(PasswordStrengthEnum.default);
        });

        switch(strength) {
            case PasswordStrengthEnum.short:
                this.sections$.forEach(x => {
                    x.next(PasswordStrengthEnum[strength]);
                });
                break;
            case PasswordStrengthEnum.weak:
                this.sections$[0].next(PasswordStrengthEnum[strength]);
                break;
            case PasswordStrengthEnum.medium:
                this.sections$[0].next(PasswordStrengthEnum[strength]);
                this.sections$[1].next(PasswordStrengthEnum[strength]);
                break;
            case PasswordStrengthEnum.strong:
                this.sections$.forEach(x => {
                    x.next(PasswordStrengthEnum[strength]);
                });
                break;
            default:
                break;
        }
    }
    
    calculatePasswordStrength(password: string): PasswordStrengthEnum {
        if (password == null || password.length === 0)
            return PasswordStrengthEnum.default;

        if (password.length < 8)
            return PasswordStrengthEnum.short;

        if (weakRegex.test(password))
            return PasswordStrengthEnum.weak;
        
        if (strongRegex.test(password))
            return PasswordStrengthEnum.strong;

        if (mediumRegex.test(password))
            return PasswordStrengthEnum.medium;

        return PasswordStrengthEnum.default;
    }

    toggleInputType():void {
        const currentType = this.inputType$.getValue();
        const newType = currentType === 'password' ? 'text' : 'password';
        this.inputType$.next(newType);
    }
}