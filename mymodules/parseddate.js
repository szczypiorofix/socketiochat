exports.getParsedDate = function() {
    function leadingZero(i) {
      return (i < 10)? '0'+i : i;
    }
    let months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 'Lipiec', "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    let d = new Date();
    return leadingZero(
    leadingZero(d.getDate()) 
    +" "+months[d.getMonth()]
    +" "+d.getFullYear()
    +" "+leadingZero(d.getHours()))
    +":"+leadingZero(d.getMinutes())
    +":"+leadingZero(d.getSeconds())+", ";
}