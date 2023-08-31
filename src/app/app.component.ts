import { Component } from '@angular/core';
declare var Appian: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'singleCtrl';

  public appianDocId: any | undefined;
  public appianEnableTestMode: boolean | undefined;
  public appianConfig: any | undefined;
  public appianMasterValues: any | undefined;
  public appianFormDetails: any | undefined;
  public appianConnectedSystem: any | undefined;
  public docData: any | undefined;
  public docName: string | undefined;

  clearValue() {
    this.appianDocId = 0;
  }
  ngOnInit() {
    Appian.Component.onNewValue((newValues: any) => {
      try {
        if (newValues.enableTestMode != null) {
          this.appianEnableTestMode = newValues.enableTestMode;
          console.log('enableTestMode :' + this.appianEnableTestMode);
        }

        if (newValues.appianDocId != null) {
          this.appianDocId = newValues.appianDocId;
          console.log('appianDocId :' + this.appianDocId);
          this.bindtoModel(this.appianDocId);
        }

        if (newValues.config != null) {
          this.appianConfig = newValues.config;
          console.log('config :' + this.appianConfig);
        }
        if (newValues.masterValues != null) {
          this.appianMasterValues = newValues.masterValues;
          console.log('masterValues :' + this.appianMasterValues);
        }
        if (newValues.formDetails != null) {
          this.appianFormDetails = newValues.formDetails;
          console.log('formDetails :' + this.appianFormDetails);
        }
        const payload = {
          documentId: newValues.appianDocId,
        };
        if (newValues.docAccessConnectedSystem != null) {
          this.appianConnectedSystem = newValues.docAccessConnectedSystem;
          console.log(
            'docAccessConnectedSystem :' + this.appianConnectedSystem
          );
          const promise = Appian.Component.invokeClientApi(
            this.appianConnectedSystem,
            'DocumentRetrieveClientApi',
            payload
          ).then(this.handleClientApiResponse, this.handleError);
        }
      } catch (e) {
        console.error(e);
      }
    });
    //this.bindtoModel(5353);
    console.log('ngOnInit Step1');
  }
  handleClientApiResponse(response: any) {
    console.log('handleClientApiResponse :' + response);

    var payload = {};
    if (
      response.type == 'INVOCATION_SUCCESS' &&
      response.payload != undefined &&
      response.payload.hasOwnProperty('error')
    ) {
      Appian.Component.setValidations([
        'Error occured while retrieving the document, Please check if you have sufficient privileges to view it. ' +
          JSON.stringify(response.payload),
      ]);
    }

    if (
      response.type == 'INVOCATION_SUCCESS' &&
      response.payload != undefined &&
      response.payload.hasOwnProperty('docData')
    ) {
      payload = response.payload;
      // this.docData = response.payload.docData;
      // this.docName = response.payload.docName;
      console.log('this.docData' + response.payload.docData);
      console.log('this.docName' + response.payload.docName);
    } else {
      Appian.Component.setValidations([
        'Unable to retrieve document from Appian, please check documentId',
        response.payload.error,
      ]);
    }

    return;
  }

  handleError(handleResponse: any) {
    console.log('handleError :' + handleResponse);
    if (handleResponse.error && handleResponse.error[0]) {
      Appian.Component.setValidations([handleResponse.error]);
    } else {
      Appian.Component.setValidations(['An unspecified error occurred']);
    }
    return;
  }
  ngOnChanges() {
    console.log(`ngOnChanges - data is`);
  }

  ngDoCheck() {
    console.log('ngDoCheck');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
  bindtoModel(value: number) {
    this.appianDocId = value;

    console.log('bindtoModel ' + this.appianDocId);
    return value;
  }
}
