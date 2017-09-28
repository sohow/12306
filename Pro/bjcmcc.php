<?php
/**
 * User: sohow.cc
 * Date: 17-9-28
 * Time: 下午3:20
 */
include_once ("../Tool/Http.php");

class Cron {
	const LOGIN_SEC = '3aa4fyj1wSk5hp0XHCtW5uIuIPYN9cvLZHA538G7DigpHG32B0TlEgrWVHmUBLtpSiZ0OI8fJz1rt4ykFzaAUDH%2FxjBdfw8V1uyoTWlKVbI4JAnfBzkKuMHndp5I0EnUsM03T%2FBUtYKMXF1vsnXqrQu1Fxs2V9EOtCBZ6kMchxv19CW07aK7%2BIjK45aRmmDnD9Jx%2FNVZQmuyft4CZEj2HRk%2B9A%2FQxe8qBvvG3BCoPXgayBsDu1d5kjELWkMW6AIBIKHAPBYInoAYF0bwB0T6oKQVRZoTvR%2FaG3Y%2FkoTS%2BhTP4xdkISRVadpuX7IsyXcUQzPw%2FgmwP65YFzdcDH8dbkPA3bjqYDFvnS7YXjjBQJam3YalhlRbuwdLVs3ursxiamscD7CoMRd5UJnvNk%2BStKoM1kXqqUEW';

	const LOGIN_URL = 'https://mobilebj.cn/app/websitepwdLogin?ver=bjservice_and_5.4.0&ef=';
	const SIGN_URL = 'http://mobilebj.cn:12065/app/querySignInfo?token=';
	const COUPONS_URL = 'http://mobilebj.cn:12065/app/queryEffCoupon?token=';
	const EXCHANGE_URL = 'http://mobilebj.cn:12065/app/exchangeCoupon?token=';

	public static function start() {
		$try = 3;
		do {
			$result = Helper_Http::get(self::LOGIN_URL . self::LOGIN_SEC);
			$result = json_decode($result, true);
			//print_r($result);
			$token = $result['token'];
		} while (!$token && $try--);

		$result = Helper_Http::get(self::SIGN_URL . $token);
		$result = json_decode($result, true);
		//print_r($result);

		$result = Helper_Http::get(self::COUPONS_URL . $token);
		$result = json_decode($result, true);
		//print_r($result);
		if (is_array($result['coupon'])) {
			foreach ($result['coupon'] as $coupon) {
				if (isset($coupon['id'])) {
					$result = Helper_Http::get(self::EXCHANGE_URL . $token . "&couponId=" . $coupon['id']);
					$result = json_decode($result, true);
					//print_r($result);
				}
			}
		}
	}
}

Cron::start();