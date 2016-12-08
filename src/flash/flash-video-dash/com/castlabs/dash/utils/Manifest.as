/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.utils {
public class Manifest {
    public function Manifest() {
        throw new Error("It's a static class");
    }

    public static function toSeconds(value:String):Number {

        // format: "PT\d+H\d+M\d+S"; "S" means seconds, "M" means minutes and "H" means hours

        var match:Array;

        match = value.match(/([\d.]+)S/);
        var seconds:Number = match ? Number(match[1]) : 0;

        match = value.match(/([\d.]+)M/);
        var minutes:Number = match ? Number(match[1]) : 0;

        match = value.match(/([\d.]+)H/);
        var hours:Number = match ? Number(match[1]) : 0;

        return (hours * 60 * 60) + (minutes * 60) + seconds;
    }

    public static function toUnixTimestamp(date:Date):Number {
        return Math.round(date.getTime() / 1000);
    }

    /**
     * Parses dates that conform to the W3C Date-time Format into Date objects.
     *
     * This function is useful for parsing RSS 1.0 and Atom 1.0 dates.
     *
     * @param str
     *
     * @returns date
     *
     * @langversion ActionScript 3.0
     * @playerversion Flash 9.0
     * @tiptext
     *
     * @see http://www.w3.org/TR/NOTE-datetime
     */
    public static function parseW3CDTF(str:String):Date {
        /*
            Source code comes from https://code.google.com/p/as3corelib/source/browse/trunk/src/com/adobe/utils/DateUtil.as
            and it's licensed under New BSD License.
         */
        var finalDate:Date;

        try {
            var dateStr:String = str.substring(0, str.indexOf("T"));
            var timeStr:String = str.substring(str.indexOf("T")+1, str.length);
            var dateArr:Array = dateStr.split("-");
            var year:Number = Number(dateArr.shift());
            var month:Number = Number(dateArr.shift());
            var date:Number = Number(dateArr.shift());

            var multiplier:Number;
            var offsetHours:Number;
            var offsetMinutes:Number;
            var offsetStr:String;

            if (timeStr.indexOf("Z") != -1) {
                multiplier = 1;
                offsetHours = 0;
                offsetMinutes = 0;
                timeStr = timeStr.replace("Z", "");
            } else if (timeStr.indexOf("+") != -1) {
                multiplier = 1;
                offsetStr = timeStr.substring(timeStr.indexOf("+")+1, timeStr.length);
                offsetHours = Number(offsetStr.substring(0, offsetStr.indexOf(":")));
                offsetMinutes = Number(offsetStr.substring(offsetStr.indexOf(":")+1, offsetStr.length));
                timeStr = timeStr.substring(0, timeStr.indexOf("+"));
            } else { // offset is -
                multiplier = -1;
                offsetStr = timeStr.substring(timeStr.indexOf("-")+1, timeStr.length);
                offsetHours = Number(offsetStr.substring(0, offsetStr.indexOf(":")));
                offsetMinutes = Number(offsetStr.substring(offsetStr.indexOf(":")+1, offsetStr.length));
                timeStr = timeStr.substring(0, timeStr.indexOf("-"));
            }

            var timeArr:Array = timeStr.split(":");
            var hour:Number = Number(timeArr.shift());
            var minutes:Number = Number(timeArr.shift());
            var secondsArr:Array = (timeArr.length > 0) ? String(timeArr.shift()).split(".") : null;
            var seconds:Number = (secondsArr != null && secondsArr.length > 0) ? Number(secondsArr.shift()) : 0;

            var milliseconds:Number = (secondsArr != null && secondsArr.length > 0) ? 1000*parseFloat("0." + secondsArr.shift()) : 0;
            var utc:Number = Date.UTC(year, month-1, date, hour, minutes, seconds, milliseconds);
            var offset:Number = (((offsetHours * 3600000) + (offsetMinutes * 60000)) * multiplier);
            finalDate = new Date(utc - offset);

            if (finalDate.toString() == "Invalid Date") {
                throw new Error("This date does not conform to W3CDTF.");
            }
        }
        catch (e:Error) {
            var eStr:String = "Unable to parse the string [" +str+ "] into a date. ";
            eStr += "The internal error was: " + e.toString();
            throw new Error(eStr);
        }

        return finalDate;
    }
}
}
