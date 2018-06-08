import {Component, createElement} from '../framework';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

export default class MapWrapper extends Component {
    componentDidMount() {
        const {lnglat, description} = this.props;
        mapboxgl.accessToken = 'pk.eyJ1IjoibGFoYWxhaGEiLCJhIjoiY2ppMm92aWk0MDBlMDNxbzRtaGY2aDhjaCJ9.GXYAQLGcDdLFuFs0-5l9Bw';
        this.map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v10',
            center: lnglat,
            zoom: 16,
        });

        let markerElement = <div class='map-marker' />;
        new mapboxgl.Marker(markerElement)
            .setLngLat(lnglat)
            .setPopup(new mapboxgl.Popup({offset: 10}).setHTML(description))
            .addTo(this.map);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div class='map-container' id='map-container'/>
        );
    }
}
