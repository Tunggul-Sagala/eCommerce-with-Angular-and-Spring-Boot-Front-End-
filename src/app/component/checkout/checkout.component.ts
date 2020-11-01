import { State } from './../../models/state';
import { Country } from './../../models/country';
import { CartService } from './../../services/cart.service';
import { FormService } from './../../services/form.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutFormGroup: FormGroup;
  
  totalQuantity: number =0;
  totalPrice: number =0.00;

  creditCardYears: number[] =[];
  creditCardMonths: number[] =[];

  countries : Country[];
  shippingAddressStates :State[] =[];
  billingAddressStates :State[] =[];

  subscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCreditCardMonths();
    this.getCreditCardYear();
    this.getCountries();
  }

  initializeForm() {
    this.checkoutFormGroup =this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidators.containsWhitespace])
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace])
      }),
      
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace])
      }),
      
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.containsWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
      
    });
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  
  get creditCardCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  onCopyShippingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates =this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates =[];
    }
  }

  getCreditCardMonths() {
    const startMonth: number =new Date().getMonth() +1;
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths =data;
      }
    );
  }

  getCreditCardYear() {
    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears =data;
      }
    );
  }

  onHandleCreditCardYear() {
    const creditCardFormGroup =this.checkoutFormGroup.get('creditCard');

    const currentYear: number =new Date().getFullYear();
    const selectedYear: number =Number(creditCardFormGroup.value.expirationYear);
    let startMonth:number;
    
    if (currentYear === selectedYear) {
      startMonth =new Date().getMonth() + 1;
    }
    else {
      startMonth =1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths =data;
      }
    )
  }

  getCountries() {
    this.subscription =this.formService.getCountries().subscribe(
      data => {
        this.countries =data;
      }
    )
  }

  onGetStates(formGroupName:string) {
    const formGroup =this.checkoutFormGroup.get(formGroupName);
    const countryCode =formGroup.value.country.code;
    
    this.subscription =this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates =data;
        }
        else {
          this.billingAddressStates =data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
