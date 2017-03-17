import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from 'app/components/spinner/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: [ './spinner.component.sass' ]
})
export class SpinnerComponent implements OnInit,OnDestroy {
  visible = false;
  private spinnerSubscription: Subscription;

  constructor(private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerSubscription = this.spinnerService.spinnerState
      .subscribe((state) => {
        this.visible = state;
      });
  }

  ngOnDestroy() {
    this.spinnerSubscription.unsubscribe();
  }


}