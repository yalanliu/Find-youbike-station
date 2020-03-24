import $ from 'jquery'
import axios from 'axios'

$(document).ready(()=>{
  $('.searching').on('click',function(event){
    event.preventDefault();
    let bike_area = $('#bike_area').val();

    axios.get("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json")
      .then((response)=>{
        let bike_data = Object.values(response.data.retVal);
        let data_area = bike_data.filter(data => {return bike_area === data.sarea});
        let bike_information = [];
        
        console.log(bike_data);
        console.log(data_area);
        data_area.map(data => {
          let address = data.ar;
          let station = data.sna;
          let available_num = data.sbi;
          let empty_num = data.bemp;
          let update_time = data.mday;
          let bike_list = `<article class="message is-primary">
                            <div class="message-header">
                              <div class="column is-8">站名: ${station}</div>
                              <p><strong>可借: ${available_num} / 可停: ${empty_num}</strong></p>
                            </div>
                            <div class="message-body">
                              <p>地址: ${address}</p>
                              <small class="has-text-grey-light">最後更新時間: ${update_time}</small>
                            </div>
                          </article>`
          bike_information += bike_list
        })

        document.querySelector('.bike_information').innerHTML = bike_information
      })
  })
})
