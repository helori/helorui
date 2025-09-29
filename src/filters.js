import { useI18n } from "vue-i18n"
import { DateTime, Interval } from 'luxon'
import numeral from 'numeral'

function date(value, outputFormat, inputFormat)
{
    var luxonDate = value;

    if(!inputFormat){
        // https://moment.github.io/luxon/#/parsing?id=sql
        luxonDate = DateTime.fromSQL(value);
    }else{
        // https://moment.github.io/luxon/#/parsing?id=fromformat
        // e.g. var date = DateTime.fromFormat('2012-03-31 12:59:25', 'yyyy-MM-dd HH:mm:ss');
        luxonDate = DateTime.fromFormat(value, inputFormat);
    }

    return luxonDate.toFormat(outputFormat ? outputFormat : 'dd/MM/yyyy');
}

function dateLocalized(value, inputFormat)
{
    var formattedDate = date(value, 'yyyy-MM-dd', inputFormat);

    const { d } = useI18n({ useScope: 'global' })
    return formattedDate ? d(formattedDate, 'short') : '';

    inputFormat = inputFormat ? inputFormat : 'yyyy-MM-dd HH:mm:ss';
    return value ? DateTime.fromFormat(value, inputFormat).toFormat('dd MMM yyyy') : '';
}

function duration(inputSeconds)
{
    if(inputSeconds || (inputSeconds === 0))
    {
        let remainingSec = inputSeconds;

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
    return inputSeconds;
}

function durationHuman(inputSeconds)
{
    if(inputSeconds || (inputSeconds === 0))
    {
        let remainingSec = inputSeconds;

        let hours = parseInt(Math.floor(remainingSec / 3600));
        remainingSec = remainingSec - hours * 3600;
        let minutes = parseInt(Math.floor(remainingSec / 60));
        remainingSec = remainingSec - minutes * 60;
        let seconds = remainingSec;

        let parts = [];
        if(hours > 0) { parts.push(hours + ' h'); }
        if(minutes > 0) { parts.push(minutes + ' min'); }
        if(seconds > 0) { parts.push(seconds + ' sec'); }
        return parts.join(' ');
    }
    return inputSeconds;
}

function age(value, inputFormat = 'yyyy-MM-dd HH:mm:ss')
{
    if(value){
        var birthday = DateTime.fromFormat(value, inputFormat);
        var interval = Interval.fromDateTimes(birthday, DateTime.now());
        var years = interval.toDuration('years').toObject().years;
        return Math.floor(years);
    }else{
        return '';
    }
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

function surface(value, decimals)
{
    if(value === null || value === '' || typeof value === 'undefined'){
        return '';
    }
    if(typeof value === 'string'){
        value = parseFloat(value);
    }
    let unit = 'm²';
    if(value > 100000000){
        value /= 1000000;
        unit = 'km²';
    }
    else if(value > 10000){
        value /= 10000;
        unit = 'Ha';
    }

    var format = '0,0';
    if(decimals > 0){
        format += '.';
        for(var i=0; i<parseInt(decimals); ++i){
            format += '0';
        }
    }

    value = numeral(value).format(format);

    return value + ' ' + unit;
}

function phone(string) {
    if(typeof string === 'string' && string && string.length >= 12){
        return string.slice(0, 3)
            + ' ' + string.slice(3, 4)
            + ' ' + string.slice(4, 6)
            + ' ' + string.slice(6, 8)
            + ' ' + string.slice(8, 10)
            + ' ' + string.slice(10);
    }
    return string;
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

function boolean(value) {
    if(value === '1' || value === 1 || value === 'true' || value === true){
        return 'Oui';
    }else if(value === '0' || value === 0 || value === 'false' || value === false){
        return 'Non';
    }else{
        return '';
    }
}

function siren(string) {
    if(string){
        string = string.replace(/\s/g,'');
        return string.slice(0, 3) + ' ' + string.slice(3, 6) + ' ' + string.slice(6, 9);
    }else{
        return '';
    }
}

function siret(string) {
    if(string){
        string = string.replace(/\s/g,'');
        return string.slice(0, 3) + ' ' + string.slice(3, 6) + ' ' + string.slice(6, 9) + ' ' + string.slice(9);
    }else{
        return '';
    }
}

export default {
    date,
    dateLocalized,
    duration,
    durationHuman,
    age,
    number,
    surface,
    phone,
    ucfirst,
    ucwords,
    strtoupper,
    strtolower,
    implode,
    strPadLeft,
    coma2br,
    nl2br,
    octets,
    boolean,
    siren,
    siret,
}
