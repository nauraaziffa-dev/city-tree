/**
 * publik.js — logika halaman publik satu pohon.
 */
(function () {
  'use strict';

  const KODE_CONTOH = 'PH-YOG-042';
  const BATAS_FOTO = 5 * 1024 * 1024;
  const SISI_MAKS_FOTO = 900;

  const IKON = Object.freeze({
    usia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 3h10M7 21h10M8 3c0 4.8 4 6 4 9s-4 4.2-4 9M16 3c0 4.8-4 6-4 9s4 4.2 4 9"/></svg>',
    air: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9.5 15.2a2.6 2.6 0 0 0 2.5 2.3"/></svg>',
    pangkas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="m8.4 8.4 11.6 11M8.4 15.6 20 4.6"/></svg>',
    kesehatan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.2a5 5 0 0 0 0-7.1Z"/><path d="M3.4 12h4.2l1.8-3 2.9 6 1.9-3h6.4"/></svg>',
    kamera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    centang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    pohon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3 6 11h3l-2 4h10l-2-4h3L12 3Z"/><path d="M12 15v6M9 21h6"/></svg>'
  });

  const isiHalaman = document.getElementById('isi-halaman');
  let pohonAktif = null;

  function esc(nilai) {
    const peta = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(nilai === null || nilai === undefined ? '' : nilai)
      .replace(/[&<>"']/g, (karakter) => peta[karakter]);
  }

  function normalisasiKode(nilai) {
    let kode = String(nilai || '').trim().toUpperCase();
    if (/^\d{1,3}$/.test(kode)) {
      kode = 'PH-YOG-' + kode.padStart(3, '0');
    }
    return kode;
  }

  function kelasStatus(status) {
    return ['aman', 'perhatian', 'kritis', 'dikerjakan'].includes(status)
      ? status
      : 'perhatian';
  }

  // Laporan pada tahap 4 berarti perawatan sedang berlangsung. Status ini
  // dipakai juga saat data laporan diubah manual tanpa memperbarui status pohon.
  function sedangDikerjakan(pohon, laporan) {
    if (!laporan) return false;
    return Number(laporan.tahap) === 4 || pohon.status === 'dikerjakan';
  }

  function statusTampil(pohon, laporan) {
    if (sedangDikerjakan(pohon, laporan)) return 'dikerjakan';
    // Status lama "dikerjakan" tanpa laporan berjalan dianggap sudah normal.
    if (!laporan && pohon.status === 'dikerjakan') return 'aman';
    return kelasStatus(pohon.status);
  }

  function mulai() {
    if (!window.SIPohon) {
      isiHalaman.innerHTML = '<section class="kartu kartu-isi"><p>Data pohon gagal dimuat. Muat ulang halaman ini.</p></section>';
      return;
    }

    pasangDialogScan();

    const parameter = new URLSearchParams(window.location.search);
    const mentah = parameter.get('id');

    if (mentah === null || !String(mentah).trim()) {
      tampilkanTanpaKode();
      return;
    }

    const kode = normalisasiKode(mentah);
    const pohon = kode ? window.SIPohon.getPohon(kode) : null;

    if (pohon) {
      tampilkanPohon(pohon);
    } else {
      tampilkanTidakDitemukan(mentah);
    }
  }

  function tampilkanTanpaKode() {
    document.title = 'Pohon tidak ditemukan — Sistem Informasi Pohon Perkotaan';
    isiHalaman.innerHTML = `
      <section class="kartu kartu-isi keadaan-kosong">
        <span class="ikon-kosong" aria-hidden="true">${IKON.pohon}</span>
        <h1>Pohon tidak ditemukan</h1>
        <p class="teks-redup">Tautan ini belum menyertakan kode pohon. Pilih pohon dari daftar kawasan, atau buka contoh halaman pohon untuk melihat tampilannya.</p>
        <div class="aksi-kosong">
          <a class="tombol tombol-utama" href="taman.html">Lihat Daftar Pohon Kawasan</a>
          <a class="tombol tombol-sekunder" href="index.html?id=${KODE_CONTOH}">Lihat contoh: ${KODE_CONTOH}</a>
        </div>
      </section>
    `;
  }

  function tampilkanTidakDitemukan(kode) {
    document.title = 'Pohon tidak ditemukan — Sistem Informasi Pohon Perkotaan';
    const keterangan = kode
      ? 'Kode <strong>' + esc(kode) + '</strong> tidak ada dalam data pohon.'
      : 'Kode pohon tidak tersedia pada tautan ini.';
    isiHalaman.innerHTML = `
      <section class="kartu kartu-isi keadaan-kosong">
        <span class="ikon-kosong" aria-hidden="true">${IKON.pohon}</span>
        <h1>Pohon tidak ditemukan</h1>
        <p class="teks-redup">${keterangan} Silakan pilih pohon dari daftar kawasan di bawah ini.</p>
        <a class="tombol tombol-utama" href="taman.html">Lihat Daftar Pohon Kawasan</a>
      </section>
    `;
  }

  function tampilkanPohon(pohon) {
    pohonAktif = pohon;
    document.title = pohon.id + ' ' + pohon.nama + ' — Sistem Informasi Pohon Perkotaan';

    const laporanAktif = window.SIPohon.laporanBerjalan(pohon.id);
    const status = statusTampil(pohon, laporanAktif);
    const statusKelas = kelasStatus(status);
    const labelStatus = window.SIPohon.LABEL_STATUS[status] || 'Status tidak dikenal';

    isiHalaman.innerHTML = `
      <section class="kartu kartu-pohon" aria-labelledby="judul-pohon">
        <div class="kepala-pohon">
          <div class="identitas-pohon">
            <p class="kode-pohon">${esc(pohon.id)}</p>
            <h1 class="judul-pohon" id="judul-pohon">${esc(pohon.nama)}</h1>
            <p class="nama-latin">${esc(pohon.namaLatin)}</p>
          </div>
          <span class="badge badge-${statusKelas}" id="badge-status">${esc(labelStatus)}</span>
          <div class="wadah-progres" id="wadah-progres">${progresHtml(laporanAktif)}</div>
        </div>
        <div class="kartu-isi">
          ${statistikHtml(pohon)}
        </div>
      </section>

      <section class="bagian" aria-label="Informasi tambahan pohon">
        ${akordeonManfaat()}
        ${akordeonRiwayat(pohon)}
      </section>

      ${bagianLaporHtml(pohon, laporanAktif)}
    `;

    pasangFormLaporan(pohon);
  }

  function kartuStatistik(ikon, label, nilai, sub) {
    return `
      <div class="statistik">
        <span class="ikon-stat" aria-hidden="true">${IKON[ikon]}</span>
        <p class="label-stat">${esc(label)}</p>
        <p class="nilai-stat">${esc(nilai)}</p>
        ${sub ? `<p class="sub-stat">${esc(sub)}</p>` : ''}
      </div>
    `;
  }

  function statistikHtml(pohon) {
    const kesehatan = Math.max(0, Math.min(100, Number(pohon.kesehatan) || 0));
    const resapan = pohon.resapanAir || {};
    const liter = Number(resapan.liter);
    const subResapan = Number.isFinite(liter) ? '±' + liter + ' L/hari' : 'Data belum tersedia';
    const jadwal = pohon.jadwalPangkas
      ? window.SIPohon.formatTanggalIndonesia(pohon.jadwalPangkas)
      : 'Belum dijadwalkan';

    return `
      <div class="statistik-grid">
        ${kartuStatistik('usia', 'Estimasi Usia', (Number(pohon.usia) || 0) + ' tahun')}
        ${kartuStatistik('air', 'Daya Resapan Air', resapan.tingkat || '-', subResapan)}
        ${kartuStatistik('pangkas', 'Jadwal Pemangkasan', jadwal)}
        <div class="statistik">
          <span class="ikon-stat" aria-hidden="true">${IKON.kesehatan}</span>
          <p class="label-stat">Tingkat Kesehatan</p>
          <p class="nilai-stat">${kesehatan}%</p>
          <div class="bar-kesehatan" role="progressbar" aria-label="Tingkat kesehatan" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${kesehatan}">
            <div class="bar-kesehatan-isi" style="width: ${kesehatan}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  function akordeonManfaat() {
    return `
      <details class="akordeon">
        <summary>Manfaat bagi mikro-iklim jalan</summary>
        <div class="akordeon-isi">
          <p>Pohon di ruang jalan membantu menurunkan suhu udara dan permukaan aspal, terutama pada siang hari.</p>
          <ul class="daftar-manfaat">
            <li>Menyerap polusi dan debu halus dari kendaraan.</li>
            <li>Memberi keteduhan bagi pejalan kaki dan pedagang di sekitar jalan.</li>
            <li>Membantu meresapkan air hujan sehingga mengurangi genangan.</li>
          </ul>
        </div>
      </details>
    `;
  }

  function akordeonRiwayat(pohon) {
    const daftar = Array.isArray(pohon.riwayat)
      ? pohon.riwayat.slice().sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      : [];
    const isi = daftar.length
      ? `<ul class="riwayat-daftar">
          ${daftar.map((item) => `
            <li class="riwayat-item">
              <p class="riwayat-tanggal">${esc(window.SIPohon.formatTanggalIndonesia(item.tanggal))}</p>
              <p class="riwayat-judul">${esc(item.judul)}</p>
              <p class="riwayat-teks">${esc(item.keterangan)}</p>
            </li>
          `).join('')}
        </ul>`
      : '<p class="teks-redup">Belum ada riwayat pemeliharaan.</p>';

    return `
      <details class="akordeon">
        <summary>Riwayat Pemeliharaan</summary>
        <div class="akordeon-isi">${isi}</div>
      </details>
    `;
  }

  function progresHtml(laporan) {
    if (!laporan) return '';

    const tahap = Math.min(5, Math.max(1, Number(laporan.tahap) || 1));
    const labelProgres = window.SIPohon.LABEL_PROGRES;
    const lebarGaris = (tahap - 1) * 20;

    const langkah = labelProgres.map((label, indeks) => {
      const nomor = indeks + 1;
      let kelas = '';
      let isi = String(nomor);
      let keterangan = '';

      if (nomor < tahap) {
        kelas = ' selesai';
        isi = IKON.centang;
        keterangan = '<span class="sr-only"> (selesai)</span>';
      } else if (nomor === tahap) {
        kelas = ' sekarang';
        keterangan = '<span class="sr-only"> (tahap saat ini)</span>';
      }

      return `
        <li class="progres-langkah${kelas}"${nomor === tahap ? ' aria-current="step"' : ''}>
          <span class="progres-lingkaran" aria-hidden="true">${isi}</span>
          <span class="progres-label">${esc(label)}${keterangan}</span>
        </li>
      `;
    }).join('');

    const tahapTeks = window.SIPohon.labelTahapLengkap(tahap, laporan.subTahap);
    const perkiraan = window.SIPohon.perkiraanSelesai(laporan);
    const tim = laporan.tim
      ? `<p>Tim lapangan: <strong>${esc(laporan.tim)}</strong></p>`
      : '';

    return `
      <div class="progres-pohon">
        <div class="progres-kepala">
          <p class="progres-judul">Progres perawatan</p>
          <p class="progres-kode">${esc(laporan.id)}</p>
        </div>
        <ol class="progres-daftar" style="--progres-lebar: ${lebarGaris}%" aria-label="Progres perawatan laporan ${esc(laporan.id)}">
          ${langkah}
        </ol>
        <div class="progres-keterangan">
          <p>Tahap saat ini: <strong>${esc(tahapTeks)}</strong></p>
          <p>Perkiraan selesai: <strong>${esc(perkiraan)}</strong></p>
          ${tim}
        </div>
      </div>
    `;
  }

  function bagianLaporHtml(pohon, laporanAktif) {
    if (sedangDikerjakan(pohon, laporanAktif)) {
      const laporan = laporanAktif;
      const rincian = [];
      if (laporan && laporan.subTahap) {
        rincian.push('Sub-tahap: <strong>' + esc(laporan.subTahap) + '</strong>');
      }
      if (laporan && laporan.tim) {
        rincian.push('Tim: <strong>' + esc(laporan.tim) + '</strong>');
      }

      return `
        <section class="bagian kartu kartu-isi" aria-labelledby="judul-lapor">
          <h2 id="judul-lapor">Laporkan Masalah Pohon Ini</h2>
          <div class="pesan pesan-info" role="status">
            Laporan Anda sedang ditangani. Halaman ini akan kembali normal setelah perawatan selesai.
          </div>
          ${rincian.length ? `<p class="detail-dikerjakan">${rincian.join(' · ')}</p>` : ''}
        </section>
      `;
    }

    return `
      <section class="bagian kartu kartu-isi" aria-labelledby="judul-lapor">
        <h2 id="judul-lapor">Laporkan Masalah Pohon Ini</h2>
        <p class="teks-redup">Laporan Anda bersifat anonim dan tanpa perlu login untuk kenyamanan warga.</p>
        <p class="pesan pesan-sukses" id="pesan-sukses" role="status" tabindex="-1" hidden></p>

        <form id="form-laporan" class="form-laporan" novalidate>
          <div class="form-grup">
            <label class="label-form" for="deskripsi">Ceritakan masalah pada pohon ini <span class="tanda-wajib">* wajib</span></label>
            <textarea class="area-teks" id="deskripsi" name="deskripsi" rows="6" maxlength="500" placeholder="Akar pohon mengangkat trotoar di depan toko..." aria-required="true" aria-describedby="bantuan-deskripsi penghitung-deskripsi error-deskripsi"></textarea>
            <p class="bantuan" id="bantuan-deskripsi">Tuliskan minimal 10 karakter dan maksimal 500 karakter.</p>
            <p class="penghitung" id="penghitung-deskripsi" aria-live="polite">0/500</p>
            <p class="pesan-error" id="error-deskripsi" role="alert" hidden></p>
          </div>

          <div class="form-grup">
            <p class="label-form" id="label-foto">Foto kondisi pohon <span class="tanda-wajib">* wajib</span></p>
            <div class="kotak-unggah" id="kotak-unggah">
              <span class="ikon-unggah" aria-hidden="true">${IKON.kamera}</span>
              <p class="unggah-judul">Tambahkan foto kondisi pohon</p>
              <p class="bantuan">Ambil dari galeri atau kamera. Hanya gambar, maksimal 5 MB.</p>
              <button class="tombol tombol-sekunder" type="button" id="tombol-pilih-foto" aria-describedby="bantuan-foto error-foto">Pilih Foto</button>
            </div>
            <input class="sr-only" type="file" id="input-foto" accept="image/*" tabindex="-1" aria-labelledby="label-foto" aria-describedby="bantuan-foto error-foto">
            <p class="bantuan" id="bantuan-foto">Foto digunakan petugas untuk memeriksa kondisi pohon.</p>
            <p class="pesan-error" id="error-foto" role="alert" hidden></p>
            <div class="pratinjau-foto" id="pratinjau" hidden>
              <img id="gambar-pratinjau" alt="Pratinjau foto laporan" width="640" height="420">
              <div class="aksi-foto">
                <button class="tombol tombol-bahaya tombol-kecil" type="button" id="tombol-hapus-foto">Hapus Foto</button>
                <button class="tombol tombol-sekunder tombol-kecil" type="button" id="tombol-ganti-foto">Ganti Foto</button>
              </div>
            </div>
          </div>

          <p class="pesan-error" id="error-umum" role="alert" hidden></p>
          <button class="tombol tombol-utama tombol-blok" type="submit" id="tombol-kirim">Kirim Laporan</button>
          <p class="bantuan teks-tengah">Laporan akan diverifikasi petugas DLH. Identitas Anda tidak disimpan.</p>
        </form>
      </section>
    `;
  }

  function pasangFormLaporan(pohon) {
    const form = document.getElementById('form-laporan');
    if (!form) return;

    const areaDeskripsi = document.getElementById('deskripsi');
    const penghitung = document.getElementById('penghitung-deskripsi');
    const errorDeskripsi = document.getElementById('error-deskripsi');
    const errorFoto = document.getElementById('error-foto');
    const errorUmum = document.getElementById('error-umum');
    const inputFoto = document.getElementById('input-foto');
    const tombolPilihFoto = document.getElementById('tombol-pilih-foto');
    const tombolGantiFoto = document.getElementById('tombol-ganti-foto');
    const tombolHapusFoto = document.getElementById('tombol-hapus-foto');
    const tombolKirim = document.getElementById('tombol-kirim');
    const kotakUnggah = document.getElementById('kotak-unggah');
    const pratinjau = document.getElementById('pratinjau');
    const gambarPratinjau = document.getElementById('gambar-pratinjau');
    const pesanSukses = document.getElementById('pesan-sukses');

    let fotoData = null;
    let fotoSedangDiproses = false;

    function tampilkanPesan(elemen, pesan) {
      if (!elemen) return;
      elemen.textContent = pesan;
      elemen.hidden = false;
    }

    function sembunyikanPesan() {
      Array.prototype.forEach.call(arguments, (elemen) => {
        if (!elemen) return;
        elemen.hidden = true;
        elemen.textContent = '';
      });
    }

    function tandaiSalah(elemen, salah) {
      if (!elemen) return;
      if (salah) elemen.setAttribute('aria-invalid', 'true');
      else elemen.removeAttribute('aria-invalid');
    }

    function perbaruiPenghitung() {
      const jumlah = areaDeskripsi.value.length;
      penghitung.textContent = jumlah + '/500';
      penghitung.classList.toggle('penghitung-di-luar', jumlah > 0 && jumlah < 10);
    }

    function bersihkanFoto() {
      fotoData = null;
      gambarPratinjau.removeAttribute('src');
      pratinjau.hidden = true;
      kotakUnggah.hidden = false;
      inputFoto.value = '';
      sembunyikanPesan(errorFoto);
    }

    areaDeskripsi.addEventListener('input', () => {
      perbaruiPenghitung();
      sembunyikanPesan(errorDeskripsi);
      tandaiSalah(areaDeskripsi, false);
    });
    perbaruiPenghitung();

    tombolPilihFoto.addEventListener('click', () => inputFoto.click());
    tombolGantiFoto.addEventListener('click', () => inputFoto.click());
    tombolHapusFoto.addEventListener('click', () => {
      bersihkanFoto();
      tombolPilihFoto.focus();
    });

    inputFoto.addEventListener('change', async () => {
      const berkas = inputFoto.files && inputFoto.files[0];
      if (!berkas) return;

      sembunyikanPesan(errorFoto);

      if (!berkas.type || !berkas.type.startsWith('image/')) {
        tampilkanPesan(errorFoto, 'Berkas harus berupa gambar (JPG, PNG, atau WebP).');
        inputFoto.value = '';
        tombolPilihFoto.focus();
        return;
      }
      if (berkas.size > BATAS_FOTO) {
        tampilkanPesan(errorFoto, 'Ukuran foto maksimal 5 MB.');
        inputFoto.value = '';
        tombolPilihFoto.focus();
        return;
      }

      fotoSedangDiproses = true;
      tombolPilihFoto.disabled = true;
      tombolPilihFoto.textContent = 'Memproses foto...';

      try {
        fotoData = await kompresFoto(berkas);
        gambarPratinjau.src = fotoData;
        pratinjau.hidden = false;
        kotakUnggah.hidden = true;
        sembunyikanPesan(errorFoto);
      } catch (kesalahan) {
        tampilkanPesan(errorFoto, kesalahan && kesalahan.message
          ? kesalahan.message
          : 'Foto tidak dapat diproses. Coba gambar lain.');
      } finally {
        fotoSedangDiproses = false;
        tombolPilihFoto.disabled = false;
        tombolPilihFoto.textContent = 'Pilih Foto';
        inputFoto.value = '';
      }
    });

    form.addEventListener('submit', (peristiwa) => {
      peristiwa.preventDefault();
      sembunyikanPesan(errorDeskripsi, errorFoto, errorUmum);
      tandaiSalah(areaDeskripsi, false);

      const deskripsi = areaDeskripsi.value.trim();
      let fokusKe = null;

      if (deskripsi.length < 10) {
        tampilkanPesan(errorDeskripsi, 'Deskripsi wajib diisi minimal 10 karakter.');
        tandaiSalah(areaDeskripsi, true);
        fokusKe = areaDeskripsi;
      } else if (deskripsi.length > 500) {
        tampilkanPesan(errorDeskripsi, 'Deskripsi maksimal 500 karakter.');
        tandaiSalah(areaDeskripsi, true);
        fokusKe = areaDeskripsi;
      }

      if (fotoSedangDiproses) {
        tampilkanPesan(errorFoto, 'Foto masih diproses. Tunggu sebentar lalu kirim lagi.');
        if (!fokusKe) fokusKe = tombolPilihFoto;
      } else if (!fotoData) {
        tampilkanPesan(errorFoto, 'Foto kondisi pohon wajib diunggah.');
        if (!fokusKe) fokusKe = tombolPilihFoto;
      }

      if (fokusKe) {
        fokusKe.focus();
        return;
      }

      tombolKirim.disabled = true;
      tombolKirim.textContent = 'Mengirim...';

      const hasil = window.SIPohon.tambahLaporan({
        idPohon: pohon.id,
        deskripsi,
        foto: fotoData
      });

      tombolKirim.disabled = false;
      tombolKirim.textContent = 'Kirim Laporan';

      if (!hasil.ok) {
        tampilkanPesan(errorUmum, hasil.pesan || 'Laporan gagal dikirim. Coba lagi.');
        return;
      }

      const pohonTerbaru = window.SIPohon.getPohon(pohon.id);
      const badge = document.getElementById('badge-status');
      if (pohonTerbaru && badge) {
        badge.className = 'badge badge-' + kelasStatus(pohonTerbaru.status);
        badge.textContent = window.SIPohon.LABEL_STATUS[pohonTerbaru.status] || '';
        pohonAktif = pohonTerbaru;
      }

      const wadahProgres = document.getElementById('wadah-progres');
      if (wadahProgres) wadahProgres.innerHTML = progresHtml(hasil.laporan);

      form.reset();
      bersihkanFoto();
      perbaruiPenghitung();
      sembunyikanPesan(errorDeskripsi, errorFoto, errorUmum);
      tandaiSalah(areaDeskripsi, false);

      pesanSukses.textContent = 'Laporan ' + hasil.laporan.id +
        ' berhasil dikirim dan akan diverifikasi petugas DLH.' +
        (hasil.sementara ? ' Catatan: penyimpanan browser tidak tersedia, jadi data hanya bertahan selama halaman ini terbuka.' : '');
      pesanSukses.hidden = false;
      pesanSukses.focus();
    });
  }

  function kompresFoto(berkas) {
    return new Promise((resolve, reject) => {
      const pembaca = new FileReader();
      pembaca.onerror = () => reject(new Error('Foto tidak dapat dibaca. Coba gambar lain.'));
      pembaca.onload = () => {
        const gambar = new Image();
        gambar.onerror = () => reject(new Error('Foto tidak dapat dibaca. Coba gambar lain.'));
        gambar.onload = () => {
          try {
            const sisiTerpanjang = Math.max(gambar.naturalWidth, gambar.naturalHeight);
            if (!sisiTerpanjang) {
              reject(new Error('Ukuran gambar tidak valid. Coba gambar lain.'));
              return;
            }
            const skala = Math.min(1, SISI_MAKS_FOTO / sisiTerpanjang);
            const lebar = Math.max(1, Math.round(gambar.naturalWidth * skala));
            const tinggi = Math.max(1, Math.round(gambar.naturalHeight * skala));
            const kanvas = document.createElement('canvas');
            kanvas.width = lebar;
            kanvas.height = tinggi;
            const konteks = kanvas.getContext('2d');
            if (!konteks) {
              reject(new Error('Browser tidak dapat memproses foto.'));
              return;
            }
            konteks.fillStyle = '#FFFFFF';
            konteks.fillRect(0, 0, lebar, tinggi);
            konteks.drawImage(gambar, 0, 0, lebar, tinggi);
            resolve(kanvas.toDataURL('image/jpeg', 0.8));
          } catch (kesalahan) {
            reject(new Error('Foto tidak dapat diproses. Coba gambar lain.'));
          }
        };
        gambar.src = String(pembaca.result);
      };
      pembaca.readAsDataURL(berkas);
    });
  }

  function pasangDialogScan() {
    const dialog = document.getElementById('dialog-scan');
    const tombolScan = document.getElementById('tombol-scan');
    const formScan = document.getElementById('form-scan');
    const inputScan = document.getElementById('input-scan');
    const errorScan = document.getElementById('error-scan');
    const tombolBatal = document.getElementById('tombol-batal-scan');
    if (!dialog || !tombolScan || !formScan || !inputScan || !errorScan || !tombolBatal) return;

    function tampilkanErrorScan(pesan) {
      errorScan.textContent = pesan;
      errorScan.hidden = false;
    }

    function bukaKode(nilai) {
      const kode = normalisasiKode(nilai);
      if (!kode) {
        tampilkanErrorScan('Masukkan kode pohon terlebih dahulu.');
        inputScan.focus();
        return false;
      }
      const pohon = window.SIPohon.getPohon(kode);
      if (!pohon) {
        tampilkanErrorScan('Kode ' + kode + ' tidak ditemukan. Periksa kembali kode pada papan kawasan.');
        inputScan.focus();
        return false;
      }
      window.location.href = 'index.html?id=' + encodeURIComponent(pohon.id);
      return true;
    }

    tombolScan.addEventListener('click', () => {
      errorScan.hidden = true;
      errorScan.textContent = '';
      inputScan.value = '';

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
        window.setTimeout(() => inputScan.focus(), 30);
        return;
      }

      const kode = window.prompt('Masukkan kode pohon (contoh: PH-YOG-042):');
      if (kode === null) return;
      const pohon = window.SIPohon.getPohon(normalisasiKode(kode));
      if (!pohon) {
        window.alert('Kode pohon tidak ditemukan.');
        return;
      }
      window.location.href = 'index.html?id=' + encodeURIComponent(pohon.id);
    });

    formScan.addEventListener('submit', (peristiwa) => {
      peristiwa.preventDefault();
      bukaKode(inputScan.value);
    });

    inputScan.addEventListener('input', () => {
      errorScan.hidden = true;
      errorScan.textContent = '';
    });

    tombolBatal.addEventListener('click', () => {
      if (typeof dialog.close === 'function') dialog.close();
    });

    dialog.addEventListener('click', (peristiwa) => {
      if (peristiwa.target === dialog) dialog.close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();
