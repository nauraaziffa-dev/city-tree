/**
 * taman.js — papan kawasan: ringkasan kawasan, pencarian pohon, dan simulasi scan.
 */
(function () {
  'use strict';

  const IKON = Object.freeze({
    cari: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 4.3 4.3"/></svg>',
    panah: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>'
  });

  const isiTaman = document.getElementById('isi-taman');

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

  function kelasStatus(status) {
    return ['aman', 'perhatian', 'kritis', 'dikerjakan'].includes(status)
      ? status
      : 'perhatian';
  }

  function labelStatus(status) {
    return window.SIPohon.LABEL_STATUS[status] || 'Status tidak dikenal';
  }

  // Kode pendek seperti "42" atau "042" diubah menjadi kode lengkap.
  function kodeKueri(teks) {
    const rapat = String(teks || '').trim().toUpperCase().replace(/\s+/g, '');
    if (/^\d{1,3}$/.test(rapat)) return 'PH-YOG-' + rapat.padStart(3, '0');
    return rapat;
  }

  function normalisasiKode(nilai) {
    return kodeKueri(nilai);
  }

  function saringPohon(daftar, kueri) {
    const teks = String(kueri || '').trim();
    if (!teks) return daftar;
    const huruf = teks.toLowerCase();
    const kode = kodeKueri(teks).toLowerCase();

    return daftar.filter((pohon) => {
      return pohon.id.toLowerCase().includes(kode) ||
        pohon.nama.toLowerCase().includes(huruf) ||
        String(pohon.namaLatin || '').toLowerCase().includes(huruf);
    });
  }

  function barisPohonHtml(pohon) {
    const kelas = kelasStatus(pohon.status);
    return `
      <a class="baris-pohon" href="index.html?id=${encodeURIComponent(pohon.id)}">
        <span class="baris-pohon-teks">
          <span class="baris-pohon-kode">${esc(pohon.id)}</span>
          <span class="baris-pohon-nama">${esc(pohon.nama)}</span>
        </span>
        <span class="baris-pohon-akhir">
          <span class="badge badge-${kelas}">${esc(labelStatus(pohon.status))}</span>
          <span class="baris-pohon-panah" aria-hidden="true">${IKON.panah}</span>
        </span>
      </a>
    `;
  }

  // Satu kelompok pohon beserta judul dan jumlahnya.
  function kelompokPohonHtml(judul, daftar) {
    return `
      <section class="kelompok-pohon">
        <h3 class="kelompok-judul">${esc(judul)} (${daftar.length})</h3>
        <div class="daftar-pohon">${daftar.map(barisPohonHtml).join('')}</div>
      </section>
    `;
  }

  function keadaanKosongHtml(kueri) {
    return `
      <div class="keadaan-cari">
        <p><strong>Tidak ada pohon yang cocok.</strong></p>
        <p class="teks-redup">Tidak ada kode atau nama pohon yang sesuai dengan &ldquo;${esc(String(kueri).trim())}&rdquo;.</p>
        <button class="tombol tombol-sekunder tombol-kecil" type="button" data-bersihkan>Hapus Pencarian</button>
      </div>
    `;
  }

  function teksJumlah(jumlah, total, kueri) {
    if (!String(kueri || '').trim()) return total + ' pohon ditampilkan';
    if (!jumlah) return 'Tidak ada pohon yang cocok';
    return jumlah + ' dari ' + total + ' pohon cocok';
  }

  function mulai() {
    if (!window.SIPohon) {
      isiTaman.innerHTML = '<section class="kartu kartu-isi"><p>Data kawasan gagal dimuat. Muat ulang halaman ini.</p></section>';
      return;
    }

    pasangDialogScan();

    // Papan kawasan menampilkan semua pohon, baik di dalam taman maupun di jalan sekitar.
    const semuaPohon = window.SIPohon.getSemuaPohon();
    const jumlahDikerjakan = semuaPohon.filter((pohon) => pohon.status === 'dikerjakan').length;
    const namaTaman = window.SIPohon.NAMA_TAMAN;
    document.title = 'Kawasan ' + namaTaman + ' — Sistem Informasi Pohon Perkotaan';

    isiTaman.innerHTML = `
      <section class="kartu kartu-taman" aria-labelledby="judul-taman">
        <p class="taman-eyebrow">Papan Kawasan</p>
        <h1 class="taman-judul" id="judul-taman">Kawasan ${esc(namaTaman)}</h1>
        <p class="taman-sub">Kawasan ini sudah menerapkan Smart City</p>
        <div class="taman-statistik">
          <div class="taman-stat">
            <p class="taman-stat-nilai">${semuaPohon.length}</p>
            <p class="taman-stat-label">Pohon terdata</p>
          </div>
          <div class="taman-stat">
            <p class="taman-stat-nilai">${jumlahDikerjakan}</p>
            <p class="taman-stat-label">Sedang dikerjakan</p>
          </div>
        </div>
      </section>

      <section class="bagian kartu kartu-isi" aria-labelledby="judul-daftar">
        <h2 class="judul-daftar" id="judul-daftar">Daftar Pohon</h2>
        <p class="bantuan-taman">QR di pohon rusak atau tidak terbaca? Pilih kode pohon dari daftar ini.</p>

        <form class="cari" id="form-cari" role="search" novalidate>
          <label class="label-form" for="cari-pohon">Cari kode pohon</label>
          <div class="cari-baris">
            <span class="ikon-cari" aria-hidden="true">${IKON.cari}</span>
            <input class="kontrol kontrol-cari" id="cari-pohon" name="cari" type="search" placeholder="Contoh: PH-YOG-042 atau 42" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="jumlah-hasil">
          </div>
        </form>

        <p class="jumlah-hasil" id="jumlah-hasil" aria-live="polite"></p>
        <div class="daftar-pohon" id="daftar-pohon"></div>
      </section>
    `;

    pasangPencarian(semuaPohon);
  }

  function pasangPencarian(semuaPohon) {
    const form = document.getElementById('form-cari');
    const input = document.getElementById('cari-pohon');
    const daftar = document.getElementById('daftar-pohon');
    const jumlah = document.getElementById('jumlah-hasil');
    if (!form || !input || !daftar || !jumlah) return;

    function tampilkan() {
      if (!semuaPohon.length) {
        daftar.innerHTML = `
          <div class="keadaan-cari">
            <p><strong>Belum ada data pohon.</strong></p>
            <p class="teks-redup">Data pohon akan tampil setelah petugas menambahkannya.</p>
          </div>
        `;
        jumlah.textContent = '0 pohon ditampilkan';
        return;
      }

      const hasil = saringPohon(semuaPohon, input.value);
      const adaKueri = Boolean(String(input.value || '').trim());
      const dalamTaman = hasil.filter((pohon) => (pohon.lokasiTipe || 'taman') === 'taman');
      const diJalan = hasil.filter((pohon) => pohon.lokasiTipe === 'jalan');

      // Saat mencari, kelompok yang kosong disembunyikan; saat tidak mencari, keduanya tetap tampil.
      const bagian = [];
      if (dalamTaman.length || !adaKueri) {
        bagian.push(kelompokPohonHtml('Di dalam taman', dalamTaman));
      }
      if (diJalan.length || !adaKueri) {
        bagian.push(kelompokPohonHtml('Di jalan sekitar taman', diJalan));
      }

      daftar.innerHTML = bagian.length ? bagian.join('') : keadaanKosongHtml(input.value);
      jumlah.textContent = teksJumlah(hasil.length, semuaPohon.length, input.value);
    }

    input.addEventListener('input', tampilkan);
    form.addEventListener('submit', (peristiwa) => {
      peristiwa.preventDefault();
      tampilkan();
    });

    daftar.addEventListener('click', (peristiwa) => {
      const tombol = peristiwa.target instanceof Element
        ? peristiwa.target.closest('[data-bersihkan]')
        : null;
      if (!tombol) return;
      input.value = '';
      tampilkan();
      input.focus();
    });

    tampilkan();
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
