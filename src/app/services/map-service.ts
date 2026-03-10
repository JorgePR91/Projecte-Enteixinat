import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private markerCluster = L.markerClusterGroup();

  crearMapa(contenidor: HTMLElement): L.Map {
    this.markerCluster = L.markerClusterGroup();
    this.map = L.map(contenidor).setView([40, -4.0], 6);
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const baseMapURl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(baseMapURl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
    }).addTo(this.map);
    this.map.addLayer(this.markerCluster);
    return this.map;
  }
  netejarMarkers() {
    this.markerCluster.clearLayers();
    this.markers = [];
  }
  afegirMarker(lat: number, log: number, icon: L.DivIcon, popup: string) {
    const marker = L.marker([lat, log], { icon }).bindPopup(popup);
    this.markers.push(marker);
    this.markerCluster.addLayer(marker);
    return marker;
  }
}
