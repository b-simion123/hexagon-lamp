import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import {  LoadingController, NavController, AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html'
})
export class ConnectionPage {
  devices: any[] = [];

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController, 
              private ble: BLE,
              private bleProvider: BluetoothProvider,
              private alertCtrl: AlertController,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.devices = [];  // clear existing list
    this.ble.scan([NEOPIXEL_SERVICE], 4).subscribe(
      device => this.onDiscoveredDevice(device), 
      e => this.showAlert('Scan Failed', 'Error scanning for BLE devices.')
    );

    console.log('Scanning for Bluetooth LE Devices');
  }

  onDiscoveredDevice(device) {
    console.log('Discovered ' + JSON.stringify(device));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  deviceSelected(device) {
    console.log("connection page: selected device")
    let connectingLoader = this.loadingCtrl.create({
      content: 'Connecting to the lamp'
    });
    connectingLoader.present();
    
    this.bleProvider.connectDevice(device);
    
    setTimeout(() => {this.navCtrl.push(TabsPage)},2500);
    setTimeout(() => {connectingLoader.dismiss()}, 3500);
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
