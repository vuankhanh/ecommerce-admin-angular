import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { filter, map, Observable, tap } from 'rxjs';
import { IAlbum, IMedia } from '../shared/interface/album.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(
    private mySocket: MySocket
  ) { }

  get listenLogoChange$(): Observable<IMedia> {
    return this.mySocket.listen('data_change').pipe(
      filter(data => data.route === 'logo'),
      map(data => data.data as IMedia)
    );
  }

  get listenAlbumChange$(): Observable<IAlbum> {
    return this.mySocket.listen('data_change').pipe(
      filter(data => data.route === 'album'),
      map(data => data.data as IAlbum)
    );
  }

  get listenHightlightMarketingChange$(): Observable<IMedia> {
    return this.mySocket.listen('data_change').pipe(
      filter(data => data.route === 'hightlightMarketing'),
      map(data => data.data as IMedia)
    );
  }

  get listenSocketReconnect$(): Observable<string> {
    return this.mySocket.socketEvent$
  }
}

@Injectable({
  providedIn: 'root'
}) class MySocket {
  private socket: Socket;
  constructor() {
    this.socket = io(environment.backend);
  }

  get socketEvent$(): Observable<string> {
    return new Observable((subscriber) => {
      let isConnected = false;
      this.socket.on('connect', () => {
        console.log(isConnected);
        if (isConnected) {
          subscriber.next('reconnect');
        } else {
          subscriber.next('connect');
        }
        isConnected = true;
      });

      this.socket.on('disconnect', () => {
        subscriber.next('disconnect');
      });
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}