<?php
/**
 * Created by PhpStorm.
 * User: sohow
 * Date: 16-3-15
 * Time: 下午2:29
 */
include_once ("Tool/Http.php");

class ziroom {
    public static function search_house()
    {
        $url = 'http://interfaces.ziroom.com/index.php?_p=api_mobile&_a=searchHouse';
        $data = 'uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&max_lng=&sort=1&min_area=&min_lat=&timestamp=1458122593&house_tags%5B1%5D=0&max_area=&bizcircle_code=&house_type=0&max_lat=&house_tags%5B3%5D=0&length=8&huxing=&house_tags%5B5%5D=0&min_lng=&keywords=&min_rentfee=&subway_station_name=%E4%B8%B0%E5%8F%B0%E7%AB%99&sign=e035870c72793edda0278a2d85486b6f&house_tags%5B2%5D=0&house_tags%5B0%5D=0&max_rentfee=&house_tags%5B4%5D=0&heating=&city_code=110000&house_tags%5B6%5D=0&start=';
        $count = 0;
        $found_room_num = 1;

        while (true) {
            $result = Helper_Http::post($url, $data.$count);
            $rt = json_decode($result, true);
            //print_r($rt);
            if (empty($rt['data'])) {
                break;
            }

            foreach ($rt['data'] as $house) {
                if (isset($house['house_code'])) {
                    $house_info = self::get_house_detail($house['house_code']);
                    if (isset($house_info['house_status'])) {
                        echo "({$found_room_num}): house_code={$house['house_code']}, house_status={$house_info['house_status']}, price={$house['house_price']}, house_name={$house['house_name']}\n";
                        $found_room_num++;
                    }
                    else {
                        var_dump($house_info);
                        break;
                    }
                }
                else {
                    var_dump($house);
                    break;
                }
            }

            $count++;
            sleep(1);
        }
    }

    public static function get_house_detail($house_code)
    {
        $url = 'http://interfaces.ziroom.com/index.php?_p=api_mobile&_a=detailShow';
        $data = "sign=87a729826ea08ac03754b8d3facce3fe&uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&timestamp=1458125599&house_code={$house_code}&city_code=110000";
        $result = Helper_Http::post($url, $data);
        $rt = json_decode($result,true);
        //print_r($rt);exit;
        return $rt['data'][0];
    }
}

ziroom::search_house();

//ziroom::get_house_detail('62369');

exit;

//appId=2000895332appType=2appVersionStr=v3.2.4cityCode=110000city_code=110000houseCode=60091493houseId=60016066houseType=1imei=864387023969328isBlank=0isShort=0osType=2payment=3price=1860priceUnit=月signDate=2016-03-17source=1stopDate=2017-03-16tenancyType=p1timestamp=1458196455707uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77uuid=2000895332_14581964557077srzT88FcNiRQA3n
//$url = 'http://interfaces.ziroom.com/index.php?_p=api_mobile&_a=searchHouse';
//$data = 'uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&max_lng=&sort=1&min_area=&min_lat=&timestamp=1458122593&house_tags%5B1%5D=0&max_area=&bizcircle_code=&house_type=0&max_lat=&house_tags%5B3%5D=0&length=8&huxing=&house_tags%5B5%5D=0&min_lng=&keywords=&min_rentfee=&subway_station_name=%E4%B8%B0%E5%8F%B0%E7%AB%99&sign=e035870c72793edda0278a2d85486b6f&house_tags%5B2%5D=0&house_tags%5B0%5D=0&max_rentfee=&house_tags%5B4%5D=0&heating=&city_code=110000&house_tags%5B6%5D=0&start=';
$count = 0;
//$url = 'http://s.ziroom.com/crm/contractInfo/getContractTenancy';
$url = 'http://s.ziroom.com/crm/contractInfo/submitContractInfo';
$houseCode = '198482';
$houseId= '28876';

//$houseCode = '60095213';
//$houseId= '60016686';
//$houseCode = '60091493';
//$houseId= '60016066';
//houseCode=60095213&appType=2&houseId=60016686
$timestamp = time() . '707';
//$str = "appId=2000895332appType=2appVersionStr=v3.2.4cityCode=110000city_code=110000houseCode={$houseCode}houseId={$houseId}houseType=1imei=864387023969328osType=2source=1timestamp={$timestamp}uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77uuid=2000895332_{$timestamp}7srzT88FcNiRQA3n";
$str = "appId=2000895332appType=2appVersionStr=v3.2.4cityCode=110000city_code=110000houseCode={$houseCode}houseId={$houseId}houseType=1imei=864387023969328isBlank=0isShort=0osType=2payment=3price=1860priceUnit=月signDate=2016-03-17source=1stopDate=2017-03-16tenancyType=p1timestamp={$timestamp}uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77uuid=2000895332_{$timestamp}7srzT88FcNiRQA3n";
$sign = md5($str);

//$data = "uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&appId=2000895332&imei=864387023969328&appVersionStr=v3.2.4&cityCode=110000&osType=2&sign={$sign}&timestamp={$timestamp}&source=1&houseType=1&city_code=110000&uuid=2000895332_{$timestamp}&houseCode={$houseCode}&appType=2&houseId={$houseId}";
$data = "uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&stopDate=2017-03-16&appId=2000895332&tenancyType=p1&payment=3&isShort=0&imei=864387023969328&appVersionStr=v3.2.4&cityCode=110000&osType=2&priceUnit=%E6%9C%88&sign={$sign}&timestamp={$timestamp}&price=1860&signDate=2016-03-17&source=1&houseType=1&city_code=110000&uuid=2000895332_{$timestamp}&isBlank=0&houseCode={$houseCode}&appType=2&houseId={$houseId}";
while (true) {
    $result = Helper_Http::post($url, $data);
    $rt = json_decode($result, true);
    print_r($rt);
    if (empty($rt['data'])) {
        break;
    }
    $count++;
    sleep(3);
}
echo "finish\n";

"uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&stopDate=2017-03-16&appId=2000895332&tenancyType=p1&payment=3&isShort=0&imei=864387023969328&appVersionStr=v3.2.4&cityCode=110000&osType=2&priceUnit=%E6%9C%88&sign=f8ee7aca7995a067c1c921ed7fda4f26&timestamp=1458200713707&price=1860&signDate=2016-03-17&source=1&houseType=1&city_code=110000&uuid=2000895332_1458200713707&isBlank=0&houseCode=60091493&appType=2&houseId=60016066";
"uid=bc867dfa-3b87-1790-8ccf-3b5bdab53f77&stopDate=2017-03-16&appId=2000895332&tenancyType=p1&payment=3&isShort=0&imei=864387023969328&appVersionStr=v3.2.4&cityCode=110000&osType=2&priceUnit=%E6%9C%88&sign=4b061139243ff0064b74020d509710b8&timestamp=1458196455707&price=1860&signDate=2016-03-17&source=1&houseType=1&city_code=110000&uuid=2000895332_1458196455707&isBlank=0&houseCode=60095213&appType=2&houseId=60016686";
