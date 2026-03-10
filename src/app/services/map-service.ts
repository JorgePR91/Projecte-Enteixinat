import { Injectable } from '@angular/core';
import * as L from 'leaflet';

declare global {
  namespace L {
    function markerClusterGroup(options?: any): any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private markerCluster: any;

  crearMapa(contenidor: HTMLElement): L.Map {
    // Ensure markerClusterGroup is available
    if (!L.markerClusterGroup) {
      console.warn('markerClusterGroup not available, leaflet.markercluster may not be loaded');
    }
    this.markerCluster = L.markerClusterGroup ? L.markerClusterGroup() : null;
    this.map = L.map(contenidor).setView([40, -4.0], 6);
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const baseMapURl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(baseMapURl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
    }).addTo(this.map);
    if (this.markerCluster) {
      this.map.addLayer(this.markerCluster);
    }
    return this.map;
  }
  netejarMarkers() {
    if (this.markerCluster) {
      this.markerCluster.clearLayers();
    }
    this.markers = [];
  }
  afegirMarker(lat: number, log: number, icon: L.DivIcon, popup: string) {
    const marker = L.marker([lat, log], { icon }).bindPopup(popup);
    this.markers.push(marker);
    if (this.markerCluster) {
      this.markerCluster.addLayer(marker);
    } else {
      // Fallback: add directly to map if markerCluster is not available
      marker.addTo(this.map);
    }
    return marker;
  }
}
