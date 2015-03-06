// Agus Ibrahim
// @agusmibrahim

// Cek apakah cordova sudah terhubung
document.addEventListener("deviceready", function (){
	//myApp.alert("Ready");
});

// Tangani tombol back
document.addEventListener("backbutton", function (){
	//temtukan disini
});

// Tangani saat keyboard show/hide
// Menggunakan plugin keyboard dari ionic
// Untuk memperbaiki masalah fokus pada input saat keyboard muncul
// Sibet sih, tapi ampuh
window.addEventListener('native.keyboardshow', keyboardShowHandler);
function keyboardShowHandler(e){
  $$(".page-content").css("padding-bottom", (e.keyboardHeight-50)+"px");
  document.getElementById( 'nama' ).scrollIntoView();
}
window.addEventListener('native.keyboardhide', keyboardHideHandler);
function keyboardHideHandler(e){
  if (!$$("body").hasClass("with-picker-modal")){
	  $$(".page-content").attr("style", "");
  }
}

// Definisikan app
var myApp = new Framework7({
	swipePanel: "left"
});

// Persingkat Selectors engine
var $$ = Dom7;
// Saat ada request ajax maka show preloader
$$(document).on('ajaxStart', function (e) {
    myApp.showPreloader("Mengambil data...");
});

// Jika ajax selesai di hide preloadernya
$$(document).on('ajaxComplete', function () {
    myApp.hidePreloader();
});

// Main view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
});

// Batasi jumalah karakter input NISN, serta sembunyikan tombol titik
myApp.keypad({
	input: '#nisn',
	valueMaxLength: 10,
	dotButton: false,
});

// Saat Accordion "NISN" dibuka, tutup accordion "Nama" (jika sedang terbuka)
$$("#bynisn").on("open", function (){
	if ($$("#byname").hasClass("accordion-item-expanded")){
		myApp.accordionClose("#byname");
	}
});

// Saat Accordion "Nama" dibuka, tutup accordion "NISN" (jika sedang terbuka)
$$("#byname").on("open", function (){
	if ($$("#bynisn").hasClass("accordion-item-expanded")){
		myApp.accordionClose("#bynisn");
	}
});

// Tangani accordion opened dan close
// Untuk keperluan hide/show tombol login
$$("#byname").on("close", function (){
	$$("#nama").change();
});
$$("#bynisn").on("close", function (){
	$$("#nisnmode").change();
});
$$("#bynisn").on("opened", function (){
	$$("#nisnmode").change();
});
$$("#byname").on("opened", function (){
	$$("#nama").change();
});

// Input kalender
myApp.calendar({
    input: '#tanggalan'
});

// Tombol login di klik
// Masih belum bekerja ;)
$$('#kirim').on('click', function () {
  if (!$$(".accordion-item-expanded").html()){
	  myApp.alert("Pilih metode masuk");
	  return;
	  }
  if ($$("#bynisn").hasClass("accordion-item-expanded")){
	  myApp.alert("NISN akan diproses");
  }else if ($$("#byname").hasClass("accordion-item-expanded")){
	  myApp.alert("Data akan diproses");
  }
});

// Saat mengisi/mengetik NISN
// jika panjang NISN=10 maka tombol login akan enable dan sebaliknya
$$("#nisnmode").on("change", function (){
	if ($$("#bynisn").hasClass("accordion-item-expanded")){
		if ($$("#nisn").val().length==10){
			$$("#kirim").removeAttr("disabled");
		}else{
			$$("#kirim").attr("disabled","");
		}
	}else{
		$$("#kirim").attr("disabled","");
	}
});

// Saat mengisi/mengetik Nama/TL/Tanggal lahir
// jika panjang Nama>3, panjang TL>3 dan panjang Tanggal>8 maka tombol login akan enable dan sebaliknya
$$("#namemode").on("change", function (){
	if ($$("#byname").hasClass("accordion-item-expanded")){
		if ($$("#nama").val().length>3 && $$("#tlahir").val().length>3 && $$("#tanggalan").val().length>8){
			$$("#kirim").removeAttr("disabled");
		}else{
			$$("#kirim").attr("disabled","");
		}
	}else{
		$$("#kirim").attr("disabled","");
	}
});

// Fungsi Scan Barcode
// Menggunakan plugin barcodescanner (Zxing)
$$("#scanbar").on("click", function (){
	cordova.plugins.barcodeScanner.scan(
      function (result) {
		  // jika user tidak mencancel
		  if (!result.cancelled){
			  // set result ke #nisn
			  $$("#nisn").val(result.text);
		  }
      },
	  // scan error
      function (error) {
          myApp.alert("Scanning failed: " + error);
      }
   );
});
function showProfile(data){
	var prof='<div class="popup popup-profile">'+
	  '<div id="wrapper">'+
		'<div id="profile">'+
		  '<div class="img"></div>'+
		  '<div class="info">'+
			'<strong>Jack Sparrow</strong>. I\'m a <strong>50 year old</strong> self-employed <strong>Pirate</strong> from the <strong>Caribbean</strong>.'+
		  '</div>'+
		'</div>'+
		'<a href="#" class="button button-fill color-red close-popup">Close</a>'+
	  '</div>'+
    '</div>';
	myApp.popup(prof);
}
