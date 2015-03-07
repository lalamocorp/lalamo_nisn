// Agus Ibrahim
// @agusmibrahim

// exitPrompt enable or not
// Untuk menghandle saat barcodescanner di cancel
// agar pertanyaan exit tidak muncul
var exitPrompt=true;
// Cek apakah cordova sudah terhubung
document.addEventListener("deviceready", function (){
	//myApp.alert("Ready");
});

// Tangani tombol back
document.addEventListener("backbutton", function (){
	// jika ada modal notif muncul, maka backbutton berfungsi utk menghilakan modal tersebut
	if ($$(".modal-overlay-visible").length>0){
		myApp.closeModal(".modal-in");
	// jika ada modal picker muncul, maka backbutton berfungsi utk menghilakan modal tersebut
	}else if ($$(".picker-modal").length>0){
		myApp.closeModal(".picker-modal");
	// saat sidebar keluar, backbutton berfungsi utk menutup sidebar tersebut
	}else if($$("body").hasClass("with-panel-left-reveal")){
		myApp.closePanel();
	// exitPrompt dilibatkan kesini
	// tanpa pengecualian ini, pertanyaan exit akan muncul saat barcodescanner di cancel
	// saat page berada di index.html (awal) dan exitPrompt bernilai true, maka pertanyaan exit akan muncul
	}else if(mainView.url.indexOf("/www/index.html")>-1&&exitPrompt){
			myApp.confirm('Do you really want to exit?', function () {
       	    // keluar aplikasi
			navigator.app.exitApp();
    });
	}
});
// Tangani saat keyboard show/hide
// Menggunakan plugin keyboard dari ionic (thanks ionicframework.com)
// Untuk memperbaiki masalah fokus pada input saat keyboard muncul
// Sibet sih, tapi ampuh
window.addEventListener('native.keyboardshow', keyboardShowHandler);
function keyboardShowHandler(e){
  // saat keyboard muncul, tambahkan ruang pada body bawah seukuran keyboard dikurangi 50
  $$(".page-content").css("padding-bottom", (e.keyboardHeight-50)+"px");
  // setelah mendapatkan space, scroll halaman agar input nama fokus ke layar (ga tertutup keyboard)
  document.getElementById( 'nama' ).scrollIntoView();
}
window.addEventListener('native.keyboardhide', keyboardHideHandler);
function keyboardHideHandler(e){
  // saat keyboard hide dan tidak ada modal picker
  // hilangkan ruang (yg tadinya dibuat)
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
	valueMaxLength: 13,
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
// .change() berguna mentrigger perubahan data (agar ditangani on("change") )
$$("#byname").on("close", function (){
	$$("#namemode").change();
});
$$("#bynisn").on("close", function (){
	$$("#nisnmode").change();
});
$$("#bynisn").on("opened", function (){
	$$("#nisnmode").change();
});
$$("#byname").on("opened", function (){
	$$("#namemode").change();
});

// Input kalender
myApp.calendar({
    input: '#tanggalan'
});

// Tangani saat tombol login di klik
// Masih belum bekerja ;)
$$('#kirim').on('click', function () {
  // alernatif (jika tombol ngga disable saat accordion tertutup) user dilarang submit data
  if (!$$(".accordion-item-expanded").html()){
	  myApp.alert("Pilih metode masuk");
	  return;
	  }
  // cek mana yang terbuka, NISN atau DATA NAMA
  if ($$("#bynisn").hasClass("accordion-item-expanded")){
	  myApp.alert("NISN akan diproses");
  }else if ($$("#byname").hasClass("accordion-item-expanded")){
	  myApp.alert("Data akan diproses");
  }
});

// Saat mengisi/mengetik NISN
// event "change" akan mengetahui perubahan data
// jika panjang NISN=10 maka tombol login akan enable dan sebaliknya
$$("#nisnmode").on("change", function (){
	if ($$("#bynisn").hasClass("accordion-item-expanded")){
		if ($$("#nisn").val().length==13){
			// hapus attribut disabled pada button
			$$("#kirim").removeAttr("disabled");
		}else{
			// tambahkan attribut disabled pada button
			$$("#kirim").attr("disabled","");
		}
	}else{
		// tambahkan attribut disabled pada button
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
			  // update tombol dengan cara trigger change
			  $$("#nisnmode").change();
		  }else{
			  // exitPrompt set ke false agar pertanyaan exit ga muncul
			  exitPrompt=false;
			  // buat thread agar satu detik kemudian exitPrompt bernilai true
			  setTimeout(function (){exitPrompt=true;}, 1000);
		  }
      },
	  // scan error tampilkan alert
      function (error) {
          myApp.alert("Scanning failed: " + error);
      }
   );
});

// Popup profil siswa
// Still Work In Progress ;)
function showProfile(data){
	var prof='<div class="popup popup-profile">'+
	  '<div id="wrapper">'+
		'<div id="profile">'+
		  '<div class="img cowok"></div>'+
		  '<div class="info">'+
			'<strong>Jack Sparrow</strong>. I\'m a <strong>50 year old</strong> self-employed <strong>Pirate</strong> from the <strong>Caribbean</strong>.'+
		  '</div>'+
		'</div>'+
		'<a href="#" class="button button-fill color-red close-popup">Close</a>'+
	  '</div>'+
    '</div>';
	myApp.popup(prof);
}
