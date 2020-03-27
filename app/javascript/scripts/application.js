import $ from 'jquery'
import axios from 'axios'

let map;
let markers = [];
let infowindows = []; 

window.initMap = initMap;
function initMap() {
  map = new google.maps.Map($('#map')[0], {
    center: {lat: 25.0408578889, lng: 121.567904444},
    zoom: 15
  });
};

$(document).ready(()=>{
  $('.searching').on('click',function(event){
    event.preventDefault();
    let bike_area = $('#bike_area').val();
    
    clearMarkers();
    function clearMarkers() {
      for (var i = 0; i < markers.length; i++) {
        if(markers[i]){
          markers[i].setMap(null);
        }
      }
      markers = [];
      infowindows = [];
    }

    axios.get("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json")
      .then((response)=>{
        let bike_data = Object.values(response.data.retVal);
        let data_area = bike_data.filter(data => {return bike_area === data.sarea});
        let bike_information = [];
        let position = [];
        let content = [];

        data_area.map(data => {
          let data_position = [
            {lat: parseFloat(data.lat), lng: parseFloat(data.lng)}
          ];
          position = data_position;
          
          let data_content = [
            {content: `<div>${data.sna}</div>`}
          ];
          content = data_content;
          
          for (var i = 0; i < position.length; i++) {
            addMarker(i);
          };

          function addMarker(e) {
            infowindows.push(new google.maps.InfoWindow({
              content: content[e].content
            }));
            markers.push(new google.maps.Marker({
              position: {
                lat: position[e].lat,
                lng: position[e].lng
              },
              map: map,
            }));
          };
        });
        data_area.map(data => {
          let address = data.ar;
          let station = data.sna;
          let available_num = data.sbi;
          let empty_num = data.bemp;
          let update_time = data.mday.split("");
          let update_year = update_time.slice(0,4).join("");
          let update_month = update_time.slice(4,6).join("");
          let update_day = update_time.slice(6,8).join("");
          let update_hr = update_time.slice(8,10).join("");
          let update_min = update_time.slice(10,12).join("");
          let update_sec = update_time.slice(12,14).join("");
          update_time = `${update_year}-${update_month}-${update_day} ${update_hr}:${update_min}:${update_sec}`
          
          let bike_list = `<article class="message is-primary">
                            <div class="message-header">
                              <div class="column is-8">站名: ${station}</div>
                              <p><strong>可借: ${available_num} / 可停: ${empty_num}</strong></p>
                            </div>
                            <div class="message-body">
                              <p>地址: ${address}</p>
                              <small class="has-text-grey-light">最後更新時間 ${update_time}</small>
                            </div>
                          </article>`
          bike_information += bike_list;
        })
        $('.bike_information').html(bike_information);
      })
  })
})
