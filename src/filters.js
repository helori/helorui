import { useI18n } from "vue-i18n"
import { DateTime } from 'luxon'
import numeral from 'numeral'

function date(value, format, inputFormat)
{
    //format = format ? format : 'dd/MM/yyyy';
    format = format ? format : 'yyyy-MM-dd';
    //format = format ? format : 'dd MMMM yyyy';
    inputFormat = inputFormat ? inputFormat : 'yyyy-MM-dd HH:mm:ss';

    var formattedDate = value ? DateTime.fromFormat(value, inputFormat).toFormat(format) : '';

    // Use this to control the date format.
    // The date can then be translated using {{ $t($filters.date(...)) }}
    return formattedDate;

    // Use this to translate the date automatically :
    //const { d } = useI18n({ useScope: 'global' })
    //return formattedDate ? d($formattedDate, 'short') : '';
}

function dateLocalized(value, inputFormat)
{
    var formattedDate = date(value, 'yyyy-MM-dd', inputFormat);

    const { d } = useI18n({ useScope: 'global' })
    return formattedDate ? d(formattedDate, 'short') : '';

    inputFormat = inputFormat ? inputFormat : 'yyyy-MM-dd HH:mm:ss';
    return value ? DateTime.fromFormat(value, inputFormat).toFormat('dd MMM yyyy') : '';
}

function duration(value, unit)
{
    if(value || (value === 0))
    {
        let remainingSec = value;

        let hours = parseInt(Math.floor(remainingSec / 3600));
        remainingSec = remainingSec - hours * 3600;
        let minutes = parseInt(Math.floor(remainingSec / 60));
        remainingSec = remainingSec - minutes * 60;
        let seconds = remainingSec;

        hours = ((hours < 10) ? '0' : '') + hours;
        minutes = ((minutes < 10) ? '0' : '') + minutes;
        seconds = ((seconds < 10) ? '0' : '') + seconds;

        return hours + ':' + minutes + ':' + seconds;
    }
    return value;
}

function number(value, decimals)
{
    var format = '0,0';
    if(decimals > 0){
        format += '.';
        for(var i=0; i<parseInt(decimals); ++i){
            format += '0';
        }
    }
    if(value === null || value === '' || typeof value === 'undefined'){
        return '';
    }
    if(typeof value === 'string'){
        value = parseFloat(value);
    }
    return numeral(value).format(format);
}

function ucfirst(string) {
    if(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }else{
        return '';
    }
}

function ucwords(string) {
    return string.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function(letter){
            return letter.toUpperCase();
        }
    );
}

function strtoupper(string) {
    if(string){
        return string.toUpperCase();
    }else{
        return '';
    }
}

function strtolower(string) {
    if(string){
        return string.toLowerCase();
    }else{
        return '';
    }
}

function implode(items, separator) {
    if(items && (items.constructor === Array)){
        return items.join(separator);
    }else{
        return items;
    }
}

function strPadLeft(string, targetLength, padString) {
    if(string){
        return string.padStart(targetLength, padString);
    }else{
        return string;
    }
}

function coma2br(str) {
    return str ? str.split(',').join('<br/>') : '';
}

function nl2br(str, is_xhtml = false){
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function octets(value, decimals) {
    var format = '0,0';
    if(decimals > 0){
        format += '.';
        for(var i=0; i<parseInt(decimals); ++i){
            format += '0';
        }
    }
    if(value === null || value === '' || typeof value === 'undefined'){
        return '';
    }
    if(typeof value === 'string'){
        value = parseFloat(value);
    }

    if(value === 0){
        return "0";
    }

    var units = ['o','ko','Mo','Go','To','Po'];
    var unitIdx = Math.floor(Math.log(value) / Math.log(1024));
    var val = Math.round(value / Math.pow(1024, unitIdx), 2);

    return numeral(val).format(format) + ' ' + units[unitIdx];
}

export default {
    date,
    dateLocalized,
    duration,
    number,
    ucfirst,
    ucwords,
    strtoupper,
    strtolower,
    implode,
    strPadLeft,
    coma2br,
    nl2br,
    octets,
}
