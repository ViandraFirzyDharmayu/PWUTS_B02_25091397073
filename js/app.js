/* ===== Data contoh (meniru tabel PENGGUNA, LOG_AKTIVITAS, BACKUP_DATABASE di SRS) ===== */
const MODUL = ['Login','Akun','Peminjaman','Backup','Konfigurasi'];
const IP = {'25091397055':'10.8.1.21','25091397058':'10.8.1.34',adminlab:'10.8.2.5',adminsistem:'10.8.0.1'};
// [menit lalu, pengguna, modul, aksi]
const SEED = [[5,'adminsistem','Login','Login berhasil'],[22,'25091397055','Peminjaman','Pengajuan baru'],[40,'adminlab','Peminjaman','Setujui pengajuan'],
 [75,'25091397055','Login','Login berhasil'],[110,'adminlab','Peminjaman','Catat pengambilan'],[180,'25091397058','Login','Login gagal ke-1'],[181,'25091397058','Login','Login berhasil'],
 [300,'adminsistem','Akun','Reset password 25091397058'],[420,'adminlab','Peminjaman','Catat pengembalian'],[600,'adminsistem','Akun','Blokir akun 25091397099'],
 [900,'adminsistem','Konfigurasi','Ubah timeout sesi'],[1440,'adminsistem','Backup','Backup otomatis'],[1500,'25091397055','Peminjaman','Batalkan pengajuan'],[2000,'adminsistem','Akun','Tambah akun adminlab']];
let LOG = SEED.map(r=>({w:new Date(Date.now()-r[0]*60000).toLocaleString('id-ID'),u:r[1],m:r[2],a:r[3],ip:IP[r[1]]||'10.8.1.40'}));
let AKUN = ['25091397055','25091397058','25091397073','adminlab','adminsistem'];
let BACKUP = [{f:'backup_auto_1.sql',j:'Otomatis',w:new Date(Date.now()-86400000).toLocaleString('id-ID'),k:'412 KB'},{f:'backup_auto_0.sql',j:'Otomatis',w:new Date(Date.now()-8*86400000).toLocaleString('id-ID'),k:'398 KB'}];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const waktu = () => new Date().toLocaleString('id-ID');
const catat = (m,a) => LOG.unshift({w:waktu(),u:'adminsistem',m:m,a:a,ip:'10.8.0.1'});

/* ===== Navigasi Ajax (jQuery .load) ===== */
let beranda = '';
function muat(p){
  $('#side nav a').removeClass('aktif').filter('[data-page="'+p+'"]').addClass('aktif');
  history.replaceState(null,'','#'+p); $('#side').removeClass('open'); window.scrollTo(0,0);
  if(p==='beranda'){ $('#isi').html(beranda); statistik(); return; }
  $('#isi').html('<p class="sub">Memuat halaman…</p>').load('pages/'+p+'.html',function(_,st){
    if(st==='error'){ $(this).html('<div class="card"><b>Halaman gagal dimuat.</b><p>Ajax butuh server HTTP. Jalankan <code>python server.py</code> lalu buka http://127.0.0.1:8000</p></div>'); return; }
    if(p==='log') initLog(); if(p==='backup') initBackup(); if(p==='akun') initAkun();
  });
}
function statistik(){
  const gagal = LOG.filter(l=>/gagal|Blokir|kunci/i.test(l.a)).length;
  $('#stats').html([[AKUN.length,'Akun terdaftar'],[LOG.length,'Entri log'],[gagal,'Login gagal / blokir'],[BACKUP[0].w.split(',')[0],'Backup terakhir']]
    .map(x=>'<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join(''));
}
$(function(){
  beranda = $('#isi').html(); statistik();
  $('#menuBtn').on('click',()=>$('#side').toggleClass('open'));
  $(document).on('click','a[data-page]',function(e){e.preventDefault();muat($(this).data('page'));});
  const h=location.hash.slice(1); if(h&&h!=='beranda') muat(h);
});

/* ===== Halaman 2.b: Log aktivitas + simulasi penguncian akun ===== */
function initLog(){
  $('#modul').append(MODUL.map(m=>'<option>'+m+'</option>').join(''));
  const tampil = () => {
    const q=$('#cari').val().toLowerCase(), m=$('#modul').val();
    const d=LOG.filter(l=>(!m||l.m===m)&&(l.u+' '+l.a).toLowerCase().includes(q));
    $('#tb').html(d.length?d.map(l=>'<tr><td>'+l.w+'</td><td>'+esc(l.u)+'</td><td>'+l.m+'</td><td><span class="tag '+(/gagal|kunci|Blokir/i.test(l.a)?'gagal':'')+'">'+esc(l.a)+'</span></td><td>'+l.ip+'</td></tr>').join('')
      :'<tr><td colspan="5">Tidak ada log yang cocok. Ubah kata kunci atau modul.</td></tr>');
    $('#jml').text(d.length+' dari '+LOG.length+' entri ditampilkan.');
  };
  $('#cari,#modul').on('input change',tampil); tampil();
  $('#ekspor').on('click',()=>{ const rows=[['Waktu','Pengguna','Modul','Aksi','IP']].concat(LOG.map(l=>[l.w,l.u,l.m,l.a,l.ip]));
    const csv='\ufeff'+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='log_aktivitas.csv'; a.click(); });
  const gg={}, tambah=(u,a)=>{LOG.unshift({w:waktu(),u:u,m:'Login',a:a,ip:'10.8.0.99'}); tampil();};
  const ui=u=>{const n=gg[u]||0; $('#bar').css('width',n*20+'%'); $('#simMsg').attr('class','msg '+(n>=5?'no':'ok')).text(n>=5?'Akun '+u+' terkunci setelah 5 kali gagal login.':'Percobaan gagal: '+n+' dari 5.'); $('#gagal').prop('disabled',n>=5);};
  $('#gagal').on('click',()=>{const u=$('#simUser').val(); gg[u]=(gg[u]||0)+1; tambah(u,'Login gagal ke-'+gg[u]); if(gg[u]===5) tambah(u,'Akun dikunci otomatis'); ui(u);});
  $('#buka').on('click',()=>{const u=$('#simUser').val(); gg[u]=0; tambah('adminsistem','Buka kunci '+u); ui(u);});
  $('#simUser').on('change',()=>ui($('#simUser').val())); ui($('#simUser').val());
}

/* ===== Halaman 2.c: Form tambah akun + validasi jQuery ===== */
function initAkun(){
  const set=(id,msg)=>{$('#e_'+id).text(msg||''); $('#'+id).toggleClass('bad',!!msg).toggleClass('good',!msg&&!!$('#'+id).val()); return !msg;};
  const cek={
    role:v=>v?'':'Pilih peran akun.',
    nama:v=>v.trim().length<3?'Nama minimal 3 karakter.':!/^[A-Za-z .'-]+$/.test(v.trim())?'Nama hanya boleh huruf.':'',
    username:v=>{v=v.trim(); const r=$('#role').val();
      if(!v) return 'Username wajib diisi.';
      if(r==='mahasiswa'&&!/^\d{11}$/.test(v)) return 'NIM mahasiswa harus 11 digit angka.';
      if(r==='adminlab'&&!/^[a-z][a-z0-9]{3,19}$/.test(v)) return 'ID Admin Lab 4–20 karakter huruf kecil/angka.';
      return AKUN.includes(v)?'Username sudah dipakai.':'';},
    kelas:v=>$('#role').val()==='mahasiswa'&&!v?'Pilih kelas A/B/C/D/I.':'',
    angkatan:v=>(+v<2020||+v>2030)?'Angkatan 2020–2030.':'',
    no_hp:v=>/^08\d{8,11}$/.test(v)?'':'Format 08xxxxxxxxxx (10–13 digit).',
    password:v=>v.length<8?'Minimal 8 karakter.':!/[a-z]/.test(v)||!/[A-Z]/.test(v)||!/\d/.test(v)?'Harus ada huruf besar, huruf kecil, dan angka.':'',
    ulang:v=>v!==$('#password').val()?'Password tidak sama.':''
  };
  $('#role').on('change',()=>{$('#boxKelas').toggle($('#role').val()!=='adminlab'); if($('#username').val()) set('username',cek.username($('#username').val()));});
  $('#password').on('input',function(){const v=this.value, s=[v.length>=8,/[a-z]/.test(v),/[A-Z]/.test(v),/\d/.test(v)].filter(Boolean).length;
    $('#kuat').css({width:s*25+'%',background:s<3?'#c62828':s<4?'#f5a524':'#1f7a46'});});
  $.each(cek,(id,fn)=>$('#'+id).on('blur change',function(){set(id,fn($(this).val()));}));
  $('#fAkun').on('submit',function(e){
    e.preventDefault(); let ok=true;
    $.each(cek,(id,fn)=>{ if(!set(id,fn($('#'+id).val()))) ok=false; });
    if(!ok){ $('#hasil').attr('class','msg no').text('Periksa kolom yang ditandai merah, lalu simpan lagi.'); $('.bad').first().focus(); return; }
    const d={role:$('#role').val(),nama:$('#nama').val().trim(),username:$('#username').val().trim(),kelas:$('#kelas').val(),angkatan:+$('#angkatan').val(),no_hp:$('#no_hp').val(),password:$('#password').val()};
    $.ajax({url:'/api/akun',method:'POST',contentType:'application/json',data:JSON.stringify(d)})
     .done(r=>{AKUN.push(d.username); LOG.unshift({w:waktu(),u:'adminsistem',m:'Akun',a:'Tambah akun '+d.username,ip:'10.8.0.1'});
       $('#hasil').attr('class','msg ok').text('Akun '+d.username+' tersimpan di server (id '+r.id+').'); $('#fAkun')[0].reset(); $('#kuat').css('width',0); $('.good').removeClass('good');})
     .fail(x=>$('#hasil').attr('class','msg no').text((x.responseJSON&&x.responseJSON.error)||'Server tidak merespons. Jalankan python server.py.'));
  });
}

/* ===== Halaman Backup & Restore ===== */
function initBackup(){
  const tampil=()=>{
    $('#bkTb').html(BACKUP.map((b,i)=>'<tr><td>'+esc(b.f)+'</td><td>'+b.j+'</td><td>'+b.w+'</td><td>'+b.k+'</td><td><button class="btn alt" data-i="'+i+'">Restore</button></td></tr>').join(''));
    const l=LOG.filter(x=>x.m==='Backup');
    $('#bkLog').html(l.map(x=>'<tr><td>'+x.w+'</td><td>'+esc(x.u)+'</td><td><span class="tag">'+esc(x.a)+'</span></td></tr>').join('')||'<tr><td colspan="3">Belum ada aktivitas backup.</td></tr>');
  };
  const info=(t,ok)=>$('#bkMsg').attr('class','msg '+(ok?'ok':'no')).text(t);
  $('#bkNow').on('click',()=>{
    const n=BACKUP.length+1, f='backup_manual_'+n+'.sql';
    BACKUP.unshift({f:f,j:'Manual',w:waktu(),k:(400+n*3)+' KB'}); catat('Backup','Backup manual '+f); info('Backup '+f+' berhasil dibuat.',true); tampil();
  });
  $('#bkJadwal').on('change',function(){catat('Backup','Ubah jadwal backup: '+this.value); info('Jadwal backup otomatis: '+this.value+'.',true); tampil();});
  $('#bkTb').on('click','button',function(){
    const b=BACKUP[$(this).data('i')];
    if(!confirm('Pulihkan data dari '+b.f+'? Data saat ini akan diganti.')) return;
    catat('Backup','Restore dari '+b.f); info('Data dipulihkan dari '+b.f+'.',true); tampil();
  });
  tampil();
}
