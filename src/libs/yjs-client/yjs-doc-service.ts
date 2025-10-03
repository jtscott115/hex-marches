import {Injectable, OnDestroy, signal} from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

@Injectable({providedIn: 'root'})
export class YjsDocService implements OnDestroy{
  private doc = new Y.Doc();
  private provider?: WebsocketProvider;
  // expose reactive maps (signals) for layers
  layerClaims = signal<Map<string, any>>(new Map());
  private claimsMap = this.doc.getMap('layer:claims');

  connect(roomId: string, wsUrl: string) {
    this.provider = new WebsocketProvider(wsUrl, roomId, this.doc, { connect: true });
    this.claimsMap.observe(event => {
      const next = new Map<string, any>();
      this.claimsMap.forEach((v, k) => next.set(k, v));
      this.layerClaims.set(next);
    });
  }

  setClaim(hexKey: string, value: any) { this.claimsMap.set(hexKey, value); }
  deleteClaim(hexKey: string) { this.claimsMap.delete(hexKey); }

  ngOnDestroy() { this.provider?.destroy(); this.doc?.destroy(); }
}
