import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-item',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-item.html',
  styleUrl: './new-item.css'
})
export class NewItem {
  
  public newItemForm:FormGroup;

  
  constructor(){
    this.newItemForm=new FormGroup({
      'inv_number':new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(8), this.validateInvNumber], []),
      'name':new FormControl(null,[Validators.required, Validators.minLength(4), Validators.maxLength(32)],[]),
      'locations':new FormArray([
        new FormControl(null, [Validators.required])
      ])

    });

  }

  public submitForm(){
    console.log("Saugoti duomenis");
    console.log(this.newItemForm.value);
    console.log(this.newItemForm.valid);
  }

  private validateInvNumber(control:FormControl):ValidationErrors | null{
   // console.log(control);
    if ( /^[0-9]*$/.test(control.value) ){
      return null;
    }
    return {error:"Neteisingas kodas"};
    
  }

  get locations(){
    return (this.newItemForm.get('locations') as FormArray).controls;
  }

  public addLocationField(){
    (this.newItemForm.get('locations') as FormArray).push(
        new FormControl(null, [Validators.required])
    );

  }

  public removeLocationField(){
    (this.newItemForm.get('locations') as FormArray).removeAt(-1);

  }

}
