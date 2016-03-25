<?php
/**
 * Created by PhpStorm.
 * User: sohow
 * Date: 16-3-25
 * Time: 下午3:06
 */
include_once ("Tool/Http.php");

class Douban {
    static $key_word = array('沙河','西二旗','龙泽','回龙观','中关村','软件园','金域华府','新龙城','圆明园','西苑','安和桥北','马连洼');
    static $echo_ids = array();
    static $echo_uids = array();
    static $header = array('Authorization: Bearer e7324528f7eb3e64b596cf7ae7c1bb2c','User-Agent: api-client/1 com.douban.frodo/3.6.0(57) Android/19 H60-L11 HUAWEI H60-L11  rom:android');

    public static function main()
    {
        $url = 'https://frodo.douban.com/api/v2/group/user/recent_topics?udid=4552fbb18d3e2d2348f02a23070a45b78b50a82f&device_id=4552fbb18d3e2d2348f02a23070a45b78b50a82f&channel=Douban&apiKey=0dad551ec0f84ed02907ff5c42e8ec70&os_rom=android&count=';
        $count = 20;
        $url .= $count;
        self::init();
        while (true) {
            $result = Helper_Http::get($url, self::$header);
            //echo $result;exit;
            $rt = json_decode($result, true);
            if (isset($rt['count']) && $rt['count'] > 0) {
                foreach ($rt['topics'] as $topic) {
                    foreach (self::$key_word as $key) {
                        if (!isset(self::$echo_ids[$topic['id']]) &&
                            !isset(self::$echo_ids[$topic['author']['id']]) &&
                            strstr($topic['title'], $key) !== false) {
                            self::$echo_ids[$topic['id']] = 1;
                            self::$echo_uids[$topic['author']['id']] = 1;
                            $topic_info = self::get_detail($topic['id']);
                            echo sprintf("title: %s\tkey: %s\tuid: %s\turl: %s\n%s\n\n", $topic['title'], $key, $topic['author']['id'],$topic['url'],$topic_info['content']);

                        }
                    }
                    //var_dump($topic['title']);
                }
                //echo "\n";
            }

            self::finish();
            sleep(3);
        }
    }

    public static function get_detail($topic_id)
    {
        $url = "https://frodo.douban.com/api/v2/group/topic/{$topic_id}?udid=4552fbb18d3e2d2348f02a23070a45b78b50a82f&device_id=4552fbb18d3e2d2348f02a23070a45b78b50a82f&channel=Douban&apiKey=0dad551ec0f84ed02907ff5c42e8ec70&os_rom=android";
        $result = Helper_Http::get($url,self::$header);
        return json_decode($result,true);
    }

    public static function init()
    {
        $fp1 = fopen('echo_ids_fp_topic_id.txt','a+');
        $fp2 = fopen('echo_ids_fp_uid.txt','a+');
        self::$echo_ids = json_decode(fgets($fp1),true);
        self::$echo_uids = json_decode(fgets($fp2),true);
        fclose($fp1);
        fclose($fp2);
    }

    public static function finish()
    {
        $fp1 = fopen('echo_ids_fp_topic_id.txt','a+');
        $fp2 = fopen('echo_ids_fp_uid.txt','a+');
        fputs($fp1,json_encode(self::$echo_ids));
        fputs($fp2,json_encode(self::$echo_uids));
        fclose($fp1);
        fclose($fp2);
    }
}

Douban::main();