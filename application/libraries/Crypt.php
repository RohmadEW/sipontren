<?php

/**
 * Description of Crypt
 *
 * @author rohmad
 */
class Crypt {

    public function encryptPassword($string) {
        return md5($string);
    }

    public function encryptDefaultPassword() {
        return md5('12345');
    }

    public function randomString($length = 25, $char_kapital = FALSE) {
        if ($char_kapital)
            $characters = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
        else
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function randomColor() {
        $color = str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

        return strtoupper($color);
    }

    public function randomColorDark() {
        do {
            $hex = $this->randomColor();
            $luminance = $this->colorLuminanceLight($hex);
        } while (!$luminance);
        
        return $hex;
    }

    public function randomColorLight() {
        do {
            $hex = $this->randomColor();
            $luminance = $this->colorLuminanceLight($hex);
        } while ($luminance);
        
        return $hex;
    }

    private function colorLuminanceLight($hex) {
        $luminance = 0.3 * hexdec(substr($hex, 0, 2)) + 0.59 * hexdec(substr($hex, 2, 2)) + 0.11 * hexdec(substr($hex, 4, 2));
        
        if ($luminance < 128) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    private function colourBrightness($hex, $percent) {
        $rgb = array(hexdec(substr($hex, 0, 2)), hexdec(substr($hex, 2, 2)), hexdec(substr($hex, 4, 2)));

        for ($i = 0; $i < 3; $i++) {
            if ($percent > 0) { // Lighter
                $rgb[$i] = round($rgb[$i] * $percent) + round(255 * (1 - $percent));
            } else { // Darker
                $positivePercent = $percent - ($percent * 2);
                $rgb[$i] = round($rgb[$i] * $positivePercent) + round(0 * (1 - $positivePercent));
            }
            if ($rgb[$i] > 255) {
                $rgb[$i] = 255;
            }
        }

        for ($i = 0; $i < 3; $i++) {
            $hexDigit = dechex($rgb[$i]);
            if (strlen($hexDigit) == 1) {
                $hexDigit = "0" . $hexDigit;
            }
            $hex .= $hexDigit;
        }

        return $hex;
    }

}
