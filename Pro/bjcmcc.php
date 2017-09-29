<?php
/**
 * User: sohow.cc
 * Date: 17-9-28
 * Time: 下午3:20
 */
include_once (dirname(dirname(__FILE__)) . "/Tool/Http.php");

class Cron {
	const LOGIN_SEC = '';

	const LOGIN_URL = 'https://mobilebj.cn/app/websitepwdLogin?ver=bjservice_and_5.4.0&ef=';
	const SIGN_URL = 'http://mobilebj.cn:12065/app/querySignInfo?token=';
	const COUPONS_URL = 'http://mobilebj.cn:12065/app/queryEffCoupon?token=';
	const EXCHANGE_URL = 'http://mobilebj.cn:12065/app/exchangeCoupon?token=';

	public static function start() {
		$try = 3;
		do {
			$result = Helper_Http::get(self::LOGIN_URL . self::LOGIN_SEC);
			$result = json_decode($result, true);
			print_r($result);
			$token = $result['token'];
		} while (!$token && $try--);

		$result = Helper_Http::get(self::SIGN_URL . $token);
		$result = json_decode($result, true);
		print_r($result);

		$result = Helper_Http::get(self::COUPONS_URL . $token);
		$result = json_decode($result, true);
		print_r($result);
		if (is_array($result['coupon'])) {
			foreach ($result['coupon'] as $coupon) {
				if (isset($coupon['id'])) {
					$result = Helper_Http::get(self::EXCHANGE_URL . $token . "&couponId=" . $coupon['id']);
					$result = json_decode($result, true);
					print_r($result);
				}
			}
		}
	}
}

Cron::start();
