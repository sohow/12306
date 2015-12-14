<?php
/**
 * Created by PhpStorm.
 * Author: 韩宗稳
 * Email: zongwen1@staff.weibo.com
 * Time: 上午10:28
 */
include_once ("Tool/Http.php");

class train {

    public static $query_num = 0;
    public static $query_date = '2016-02-06';
    public static $from_station = 'BJP';
    public static $to_station = 'YPK';

    public static function main()
    {
        self::query(self::$query_date,self::$from_station,self::$to_station);
    }

    public static function query($query_date,$from_station,$to_station)
    {
        $url = 'https://kyfw.12306.cn/otn/lcxxcx/query?';
        $param = array(
            'purpose_codes' =>  'ADULT',
            'queryDate'     =>  $query_date,    //'2016-02-06',
            'from_station'  =>  $from_station,  //'BJP',
            'to_station'    =>  $to_station,    //'YPK'
        );
        $url .= http_build_query($param);

        do {
            $restul = Helper_Http::get($url);
            $rt = json_decode($restul, true);
            if (isset($rt['status']) && $rt['status']) {
                self::do_query($rt);
            } else if (isset($rt['messages'])) {
                var_dump($rt['messages']);
            } else {
                var_dump($restul);
            }
        } while (true);
    }

    public static function do_query($rt)
    {
        foreach ($rt['data']['datas'] as $item) {
            $msg = "{$item['station_train_code']}\t{$item['gg_num']}\t{$item['gr_num']}\t{$item['qt_num']}\t{$item['rw_num']}\t{$item['rz_num']}\t{$item['tz_num']}\t{$item['wz_num']}\t{$item['yb_num']}\t{$item['yw_num']}\t{$item['yz_num']}\t{$item['ze_num']}\t{$item['zy_num']}\t{$item['swz_num']}";
            self::show($msg);
            if ((is_numeric($item['gg_num']) && $item['gg_num'] > 0) ||
                (is_numeric($item['gr_num']) && $item['gr_num'] > 0) ||
                (is_numeric($item['qt_num']) && $item['qt_num'] > 0) ||
                (is_numeric($item['rw_num']) && $item['rw_num'] > 0) ||
                (is_numeric($item['rz_num']) && $item['rz_num'] > 0) ||
                (is_numeric($item['tz_num']) && $item['tz_num'] > 0) ||
                (is_numeric($item['wz_num']) && $item['wz_num'] > 0) ||
                (is_numeric($item['yb_num']) && $item['yb_num'] > 0) ||
                (is_numeric($item['yw_num']) && $item['yw_num'] > 0) ||
                (is_numeric($item['yz_num']) && $item['yz_num'] > 0) ||
                (is_numeric($item['ze_num']) && $item['ze_num'] > 0) ||
                (is_numeric($item['zy_num']) && $item['zy_num'] > 0) ||
                (is_numeric($item['swz_num']) && $item['swz_num'] > 0)) {
                self::waring($msg);
            }
        }
        self::$query_num++;
        $msg = sprintf("\t\t\t\t%s\t%s => %s\t\tquery time: %s",
            self::$query_date,self::$from_station,self::$to_station,self::$query_num);
        self::show($msg);
    }

    public static function waring($msg)
    {
        exec("gnome-terminal -x bash -c \"date;echo 有票啦 {$msg}; read;\"");
        exit;
    }

    public static function show($msg)
    {
        echo "{$msg}\n";
    }
}

/*
 * HZH 杭州东
 * ARH 鳌江
 */
if(PHP_SAPI == 'cli' && isset($argv[0]) && $argv[0] == basename(__FILE__) ) {
    var_dump($argv);
    train::$query_date = $argv[1];//出发时间
    if(isset($argv[2])){
        train::$from_station = $argv[2];//出发站
    }
    if(isset($argv[3])){
        train::$to_station = $argv[3];//终点站
    }
}
train::main();


