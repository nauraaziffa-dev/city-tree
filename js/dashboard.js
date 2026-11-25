(function () {
  'use strict';

  const DESKRIPSI_SEGERA = Object.freeze({
    jadwal: 'Jadwal pemeliharaan akan tersedia pada versi berikutnya.',
    pengaturan: 'Pengaturan akun dan preferensi akan tersedia pada versi berikutnya.'
  });

  const ZOOM_MIN = 1;
  const ZOOM_MAKS = 4;
  const ZOOM_LABEL = 2;
  const ZOOM_CARI = 2.5;
  const KAMERA_AWAL = Object.freeze({ cx: 500, cy: 320, zoom: 1 });

  const el = {};
  let jamInterval = null;
  let toastTimer = null;
  let kamera = Object.assign({}, KAMERA_AWAL);
  let abaikanKlikPin = false;
  let modePilihPosisi = false;
  let idPohonDiubah = null;
  let idPohonHapus = null;
  let posisiPilih = null;
  let idTerpilih = null;
  let tampilanAktif = 'dashboard';

  function ambilElemen() {
    el.tampilanDashboard = document.getElementById('tampilan-dashboard');
    el.tampilanLaporan = document.getElementById('tampilan-laporan');
    el.tampilanDataPohon = document.getElementById('tampilan-data-pohon');
    el.slotPetaData = document.getElementById('slot-peta-data');
    el.gridDasbor = document.getElementById('grid-dasbor');
    el.tampilanSegera = document.getElementById('tampilan-segera');
    el.deskripsiSegera = document.getElementById('deskripsi-segera');
    el.kembaliDasbor = document.getElementById('kembali-dasbor');
    el.sidebar = document.getElementById('sidebar-dasbor');
    el.lapisanSidebar = document.getElementById('lapisan-sidebar');
    el.tombolMenu = document.getElementById('tombol-menu-dasbor');
    el.menu = Array.from(document.querySelectorAll('.menu-dasbor'));
    el.tombolReset = document.getElementById('tombol-reset-data');

    el.metrikTotal = document.getElementById('metrik-total');
    el.metrikAman = document.getElementById('metrik-aman');
    el.metrikPerhatian = document.getElementById('metrik-perhatian');
    el.metrikLaporan = document.getElementById('metrik-laporan');
    el.metrikTotalSub = document.getElementById('metrik-total-sub');
    el.metrikAmanSub = document.getElementById('metrik-aman-sub');
    el.metrikPerhatianSub = document.getElementById('metrik-perhatian-sub');
    el.metrikLaporanSub = document.getElementById('metrik-laporan-sub');
    el.lencanaLaporan = document.getElementById('lencana-laporan');
    el.jumlahLaporan = document.getElementById('jumlah-laporan');
    el.daftarLaporan = document.getElementById('daftar-laporan');
    el.daftarLaporanLengkap = document.getElementById('daftar-laporan-lengkap');
    el.ringkasanLaporan = document.getElementById('ringkasan-laporan');
    el.tombolLihatSemuaLaporan = document.getElementById('tombol-lihat-semua-laporan');
    el.judulPeta = document.getElementById('judul-peta');
    el.labelTamanPeta = document.getElementById('label-taman-peta');

    el.lapisanPin = document.getElementById('lapisan-pin');
    el.lapisanLabel = document.getElementById('lapisan-label');
    el.jumlahPin = document.getElementById('jumlah-pin');
    el.peta = document.getElementById('peta-pohon');
    el.kartuPeta = document.querySelector('.kartu-peta');
    el.bingkaiPeta = document.querySelector('.bingkai-peta');
    el.zoomMasuk = document.getElementById('zoom-masuk');
    el.zoomKeluar = document.getElementById('zoom-keluar');
    el.zoomReset = document.getElementById('zoom-reset');
    el.statusZoom = document.getElementById('status-zoom-peta');

    el.formCari = document.getElementById('form-cari-pohon');
    el.inputCari = document.getElementById('cari-pohon-dasbor');
    el.errorCari = document.getElementById('error-cari-dasbor');
    el.statusCari = document.getElementById('status-cari-dasbor');

    el.tanggal = document.getElementById('tanggal-dasbor');
    el.jam = document.getElementById('jam-dasbor');

    el.dialog = document.getElementById('dialog-pohon');
    el.tutupDialog = document.getElementById('tutup-detail-pohon');
    el.detailKode = document.getElementById('detail-kode');
    el.detailNama = document.getElementById('judul-detail-pohon');
    el.detailLatin = document.getElementById('detail-latin');
    el.detailBadge = document.getElementById('detail-badge');
    el.detailRincian = document.getElementById('detail-rincian');
    el.detailTautan = document.getElementById('detail-tautan');

    el.dialogLaporan = document.getElementById('dialog-laporan');
    el.tutupDialogLaporan = document.getElementById('tutup-detail-laporan');
    el.detailLaporanKode = document.getElementById('detail-laporan-kode');
    el.detailLaporanJudul = document.getElementById('judul-detail-laporan');
    el.detailLaporanMeta = document.getElementById('detail-laporan-meta');
    el.detailLaporanBadge = document.getElementById('detail-laporan-badge');
    el.detailLaporanDeskripsi = document.getElementById('detail-laporan-deskripsi');
    el.detailLaporanFotoWadah = document.getElementById('detail-laporan-foto-wadah');
    el.detailLaporanFoto = document.getElementById('detail-laporan-foto');
    el.detailLaporanRincian = document.getElementById('detail-laporan-rincian');
    el.detailLaporanTautan = document.getElementById('detail-laporan-tautan');

    el.panelForm = document.getElementById('panel-form-pohon');
    el.judulForm = document.getElementById('judul-form-pohon');
    el.subForm = document.getElementById('sub-form-pohon');
    el.formPohon = document.getElementById('form-pohon');
    el.inputKode = document.getElementById('input-kode-pohon');
    el.inputNama = document.getElementById('input-nama-pohon');
    el.inputLatin = document.getElementById('input-latin-pohon');
    el.inputUsia = document.getElementById('input-usia-pohon');
    el.inputResapan = document.getElementById('input-resapan-pohon');
    el.inputLiter = document.getElementById('input-liter-pohon');
    el.inputPangkas = document.getElementById('input-pangkas-pohon');
    el.inputKesehatan = document.getElementById('input-kesehatan-pohon');
    el.inputStatus = document.getElementById('input-status-pohon');
    el.inputLokasi = document.getElementById('input-lokasi-pohon');
    el.statusPosisi = document.getElementById('status-posisi-pohon');
    el.errorForm = document.getElementById('error-form-pohon');
    el.errorNama = document.getElementById('error-nama-pohon');
    el.errorKesehatan = document.getElementById('error-kesehatan-pohon');
    el.tutupForm = document.getElementById('tutup-form-pohon');
    el.batalForm = document.getElementById('batal-form-pohon');
    el.simpanForm = document.getElementById('simpan-form-pohon');
    el.lapisanPilih = document.getElementById('lapisan-pilih');
    el.tombolUbah = document.getElementById('tombol-ubah-pohon');
    el.tombolHapus = document.getElementById('tombol-hapus-pohon');

    el.dialogHapus = document.getElementById('dialog-hapus-pohon');
    el.hapusKode = document.getElementById('hapus-kode-pohon');
    el.judulHapus = document.getElementById('judul-hapus-pohon');
    el.pesanHapus = document.getElementById('pesan-hapus-pohon');
    el.peringatanHapus = document.getElementById('peringatan-hapus-pohon');
    el.tutupHapus = document.getElementById('tutup-hapus-pohon');
    el.batalHapus = document.getElementById('batal-hapus-pohon');
    el.konfirmasiHapus = document.getElementById('konfirmasi-hapus-pohon');

    el.kartuData = document.getElementById('kartu-data-pohon');
    el.jumlahTabel = document.getElementById('jumlah-tabel-pohon');
    el.formCariTabel = document.getElementById('form-cari-tabel');
    el.inputCariTabel = document.getElementById('cari-tabel-pohon');
    el.filterStatus = document.getElementById('filter-status-pohon');
    el.filterLokasi = document.getElementById('filter-lokasi-pohon');
    el.tombolTambahTabel = document.getElementById('tombol-tambah-pohon-tabel');
    el.isiTabel = document.getElementById('isi-tabel-pohon');
    el.statusTabel = document.getElementById('status-tabel-pohon');
  }

  // Utilitas kecil

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

  function kodeKueri(teks) {
    const rapat = String(teks || '').trim().toUpperCase().replace(/\s+/g, '');
    if (/^\d{1,3}$/.test(rapat)) return 'PH-YOG-' + rapat.padStart(3, '0');
    return rapat;
  }

  function teksAngka(nilai) {
    return String(Number(nilai) || 0);
  }

  function batasNilai(nilai, minimum, maksimum) {
    return Math.min(maksimum, Math.max(minimum, nilai));
  }

  function angkaDesimal(nilai) {
    return Number(nilai).toFixed(2).replace(/\.?0+$/, '');
  }

  function tampilkanToast(pesan) {
    let toast = document.getElementById('toast-dasbor');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-dasbor';
      toast.className = 'toast-dasbor';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = pesan;
    toast.classList.add('tampil');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('tampil');
    }, 3400);
  }

  // Membuka/menutup <dialog> dengan fallback untuk browser lama.
  function bukaDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
      dialog.classList.add('panel-terbuka');
    }
  }

  function tutupDialog(dialog) {
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      dialog.classList.remove('panel-terbuka');
    }
  }

  // ---------------------------------------------------------------------------
  // Metrik
  // ---------------------------------------------------------------------------

  function renderMetrik() {
    const metrik = window.SIPohon.hitungMetrik();
    const persenAman = metrik.totalPohon
      ? Math.round((metrik.aman / metrik.totalPohon) * 100)
      : 0;
    const totalPerhatian = metrik.perhatian + metrik.kritis;

    el.metrikTotal.textContent = teksAngka(metrik.totalPohon);
    el.metrikAman.textContent = teksAngka(metrik.aman);
    el.metrikPerhatian.textContent = teksAngka(totalPerhatian);
    el.metrikLaporan.textContent = teksAngka(metrik.laporanBaru);

    el.metrikTotalSub.textContent = 'Pohon terdata';
    el.metrikAmanSub.textContent = persenAman + '% dari total pohon';
    el.metrikPerhatianSub.textContent = metrik.kritis
      ? metrik.perhatian + ' perhatian · ' + metrik.kritis + ' kritis'
      : 'Perlu pemantauan';
    el.metrikLaporanSub.textContent = metrik.laporanBaru
      ? 'Menunggu verifikasi'
      : 'Tidak ada laporan baru';

    el.jumlahLaporan.textContent = metrik.laporanBaru + ' baru';
    el.lencanaLaporan.textContent = metrik.laporanBaru;
    el.lencanaLaporan.hidden = metrik.laporanBaru === 0;
  }

  // ---------------------------------------------------------------------------
  // Peta dan pin
  // ---------------------------------------------------------------------------

  // Posisi x/y (0-100) dipetakan ke area peta viewBox 1000x640.
  function posisiPin(pohon) {
    return {
      x: 36 + (Number(pohon.x) / 100) * 928,
      y: 32 + (Number(pohon.y) / 100) * 576
    };
  }

  function pinHtml(pohon) {
    const posisi = posisiPin(pohon);
    const kelas = kelasStatus(pohon.status);
    const label = labelStatus(pohon.status);
    const nomor = String(pohon.id).slice(-3);
    const aria = pohon.id + ', ' + pohon.nama + ', ' + label + '. Buka detail pohon.';
    const x = angkaDesimal(posisi.x);
    const y = angkaDesimal(posisi.y);
    const skala = angkaDesimal(1 / kamera.zoom);

    return `
      <g class="pin-pohon pin-${kelas}" data-id="${esc(pohon.id)}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="${esc(aria)}">
        <g class="pin-skala" transform="scale(${skala})">
          <title>${esc(pohon.id + ' — ' + pohon.nama + ' (' + label + ')')}</title>
          <circle class="pin-area" cx="0" cy="0" r="19"></circle>
          <circle class="pin-titik" cx="0" cy="0" r="17"></circle>
          <text class="pin-teks" x="0" y="0" text-anchor="middle" dy="0.34em">${esc(nomor)}</text>
        </g>
      </g>
    `;
  }

  function labelPinHtml(pohon) {
    const posisi = posisiPin(pohon);
    const x = angkaDesimal(posisi.x);
    const y = angkaDesimal(posisi.y);
    const skala = angkaDesimal(1 / kamera.zoom);

    return `
      <g transform="translate(${x} ${y}) scale(${skala})">
        <text class="pin-label" x="0" y="-26" text-anchor="middle">${esc(pohon.id)}</text>
      </g>
    `;
  }

  function perbaruiSkalaPin() {
    if (!el.lapisanPin) return;
    const skala = angkaDesimal(1 / kamera.zoom);
    el.lapisanPin.querySelectorAll('.pin-skala').forEach((grup) => {
      grup.setAttribute('transform', 'scale(' + skala + ')');
    });
  }

  function renderLabel() {
    if (!el.lapisanLabel) return;
    if (kamera.zoom < ZOOM_LABEL) {
      el.lapisanLabel.innerHTML = '';
      return;
    }
    el.lapisanLabel.innerHTML = window.SIPohon.getSemuaPohon().map(labelPinHtml).join('');
  }

  function terapkanViewBox() {
    if (!el.peta) return;
    const lebar = 1000 / kamera.zoom;
    const tinggi = 640 / kamera.zoom;
    const x = kamera.cx - lebar / 2;
    const y = kamera.cy - tinggi / 2;
    el.peta.setAttribute('viewBox', [
      angkaDesimal(x),
      angkaDesimal(y),
      angkaDesimal(lebar),
      angkaDesimal(tinggi)
    ].join(' '));
  }

  function renderPeta() {
    const pohon = window.SIPohon.getSemuaPohon();
    el.jumlahPin.textContent = pohon.length + ' pohon';
    terapkanViewBox();

    if (!pohon.length) {
      el.lapisanPin.innerHTML =
        '<text class="peta-kosong-teks" x="500" y="320" text-anchor="middle">Belum ada data pohon</text>';
      if (el.lapisanLabel) el.lapisanLabel.innerHTML = '';
      return;
    }

    el.lapisanPin.innerHTML = pohon.map(pinHtml).join('');
    perbaruiSkalaPin();
    renderLabel();
  }

  function terapkanKamera(cxBaru, cyBaru, zoomBaru, umumkan) {
    const zoom = batasNilai(Number(zoomBaru) || 1, ZOOM_MIN, ZOOM_MAKS);
    const lebar = 1000 / zoom;
    const tinggi = 640 / zoom;
    const cx = batasNilai(
      Number.isFinite(Number(cxBaru)) ? Number(cxBaru) : kamera.cx,
      lebar / 2,
      1000 - lebar / 2
    );
    const cy = batasNilai(
      Number.isFinite(Number(cyBaru)) ? Number(cyBaru) : kamera.cy,
      tinggi / 2,
      640 - tinggi / 2
    );
    const zoomBerubah = zoom !== kamera.zoom;

    kamera = { cx, cy, zoom };
    terapkanViewBox();

    if (zoomBerubah) {
      perbaruiSkalaPin();
      renderLabel();
    }

    renderPreviewPilih();

    if (umumkan && el.statusZoom) {
      el.statusZoom.textContent = 'Zoom ' + zoom.toFixed(1).replace('.', ',') + ' kali.';
    }
  }

  function resetKamera(umumkan) {
    kamera = Object.assign({}, KAMERA_AWAL);
    terapkanViewBox();
    perbaruiSkalaPin();
    renderLabel();
    renderPreviewPilih();
    if (umumkan && el.statusZoom) {
      el.statusZoom.textContent = 'Tampilan peta direset ke zoom 1 kali.';
    }
  }

  function fraksiLayar(clientX, clientY) {
    const kotak = el.peta.getBoundingClientRect();
    if (!kotak.width || !kotak.height) return { fx: 0.5, fy: 0.5 };
    return {
      fx: batasNilai((clientX - kotak.left) / kotak.width, 0, 1),
      fy: batasNilai((clientY - kotak.top) / kotak.height, 0, 1)
    };
  }

  function duniaDariLayar(clientX, clientY) {
    const fraksi = fraksiLayar(clientX, clientY);
    const lebar = 1000 / kamera.zoom;
    const tinggi = 640 / kamera.zoom;
    return {
      x: kamera.cx - lebar / 2 + fraksi.fx * lebar,
      y: kamera.cy - tinggi / 2 + fraksi.fy * tinggi
    };
  }

  function zoomDiLayar(faktor, clientX, clientY, umumkan) {
    const zoomBaru = batasNilai(kamera.zoom * faktor, ZOOM_MIN, ZOOM_MAKS);
    if (zoomBaru === kamera.zoom) return false;

    const fraksi = fraksiLayar(clientX, clientY);
    const titik = duniaDariLayar(clientX, clientY);
    const lebar = 1000 / zoomBaru;
    const tinggi = 640 / zoomBaru;

    terapkanKamera(
      titik.x - (fraksi.fx - 0.5) * lebar,
      titik.y - (fraksi.fy - 0.5) * tinggi,
      zoomBaru,
      umumkan
    );
    return true;
  }

  function ubahZoom(faktor) {
    terapkanKamera(kamera.cx, kamera.cy, kamera.zoom * faktor, true);
  }

  function pusatkanKePin(pohon) {
    const posisi = posisiPin(pohon);
    terapkanKamera(posisi.x, posisi.y, Math.max(kamera.zoom, ZOOM_CARI), false);
    if (el.statusZoom) {
      el.statusZoom.textContent = 'Peta dipusatkan ke ' + pohon.id +
        ' pada zoom ' + kamera.zoom.toFixed(1).replace('.', ',') + ' kali.';
    }
  }

  // Kebalikan dari posisiPin: koordinat viewBox diubah menjadi persen (0-100).
  function persenDariDunia(x, y) {
    return {
      x: batasNilai(((x - 36) / 928) * 100, 0, 100),
      y: batasNilai(((y - 32) / 576) * 100, 0, 100)
    };
  }

  // Menampilkan penanda posisi pin yang sedang dipilih di peta.
  function renderPreviewPilih() {
    if (!el.lapisanPilih) return;
    if (!modePilihPosisi || !posisiPilih) {
      el.lapisanPilih.innerHTML = '';
      return;
    }
    const pos = posisiPin({ x: posisiPilih.x, y: posisiPilih.y });
    const skala = angkaDesimal(1 / kamera.zoom);
    el.lapisanPilih.innerHTML =
      '<g class="pin-pilih" transform="translate(' + angkaDesimal(pos.x) + ' ' + angkaDesimal(pos.y) + ')">' +
        '<g transform="scale(' + skala + ')">' +
          '<circle class="pin-pilih-area" r="22"></circle>' +
          '<circle class="pin-pilih-titik" r="9"></circle>' +
          '<path class="pin-pilih-silang" d="M-5 0h10M0-5v10"></path>' +
        '</g>' +
      '</g>';
  }

  function setPosisiPilih(x, y) {
    posisiPilih = { x: batasNilai(x, 0, 100), y: batasNilai(y, 0, 100) };
    renderPreviewPilih();
    if (el.statusPosisi) {
      el.statusPosisi.textContent = 'Posisi dipilih: ' +
        Math.round(posisiPilih.x) + '% , ' + Math.round(posisiPilih.y) + '% pada peta.';
    }
  }

  function pasangPetaInteraksi() {
    if (!el.peta) return;

    const pointerAktif = new Map();
    let mulaiGeser = null;
    let pinchAwal = null;
    let totalGerak = 0;

    function titikTengah(a, b) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    function jarak(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function mulaiPinch() {
      if (pointerAktif.size !== 2) return;
      const [a, b] = Array.from(pointerAktif.values());
      const tengah = titikTengah(a, b);
      const jangkar = duniaDariLayar(tengah.x, tengah.y);
      pinchAwal = {
        jarak: jarak(a, b) || 1,
        zoom: kamera.zoom,
        jangkar
      };
    }

    function tekanPointer(peristiwa) {
      if (peristiwa.pointerType === 'mouse' && peristiwa.button !== 0) return;
      abaikanKlikPin = false;
      totalGerak = 0;
      pointerAktif.set(peristiwa.pointerId, { x: peristiwa.clientX, y: peristiwa.clientY });

      if (pointerAktif.size === 1) {
        mulaiGeser = { x: peristiwa.clientX, y: peristiwa.clientY };
        pinchAwal = null;
        el.peta.classList.add('sedang-geser');
      } else if (pointerAktif.size === 2) {
        mulaiGeser = null;
        mulaiPinch();
      }
    }

    function gerakPointer(peristiwa) {
      if (!pointerAktif.has(peristiwa.pointerId)) return;

      const lama = pointerAktif.get(peristiwa.pointerId);
      const deltaX = peristiwa.clientX - lama.x;
      const deltaY = peristiwa.clientY - lama.y;
      pointerAktif.set(peristiwa.pointerId, { x: peristiwa.clientX, y: peristiwa.clientY });
      totalGerak += Math.hypot(deltaX, deltaY);

      if (totalGerak > 4) abaikanKlikPin = true;

      if (pointerAktif.size === 1 && mulaiGeser) {
        // Pada zoom 1 kamera tidak dapat digeser lagi. Di layar sentuh, drag
        // dipakai untuk menggulir bingkai peta (horizontal) atau halaman
        // (vertikal) agar peta yang lebih lebar dari layar tetap bisa dijelajahi.
        if (kamera.zoom <= ZOOM_MIN) {
          if (peristiwa.pointerType === 'mouse') return;
          if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            if (el.bingkaiPeta) el.bingkaiPeta.scrollLeft -= deltaX;
          } else {
            window.scrollBy({ top: -deltaY, behavior: 'instant' });
          }
          return;
        }

        const kotak = el.peta.getBoundingClientRect();
        if (!kotak.width || !kotak.height) return;
        const lebar = 1000 / kamera.zoom;
        const tinggi = 640 / kamera.zoom;
        terapkanKamera(
          kamera.cx - (deltaX * lebar) / kotak.width,
          kamera.cy - (deltaY * tinggi) / kotak.height,
          kamera.zoom,
          false
        );
        return;
      }

      if (pointerAktif.size === 2 && pinchAwal) {
        const [a, b] = Array.from(pointerAktif.values());
        const tengah = titikTengah(a, b);
        const fraksi = fraksiLayar(tengah.x, tengah.y);
        const zoomBaru = batasNilai(
          pinchAwal.zoom * (jarak(a, b) / pinchAwal.jarak),
          ZOOM_MIN,
          ZOOM_MAKS
        );
        const lebar = 1000 / zoomBaru;
        const tinggi = 640 / zoomBaru;

        terapkanKamera(
          pinchAwal.jangkar.x - (fraksi.fx - 0.5) * lebar,
          pinchAwal.jangkar.y - (fraksi.fy - 0.5) * tinggi,
          zoomBaru,
          false
        );
      }
    }

    function lepasPointer(peristiwa) {
      if (!pointerAktif.has(peristiwa.pointerId)) return;
      pointerAktif.delete(peristiwa.pointerId);

      if (totalGerak > 4) {
        abaikanKlikPin = true;
        // Klik bawaan setelah pointerup masih perlu diabaikan, lalu flag dibersihkan.
        window.setTimeout(() => {
          abaikanKlikPin = false;
        }, 0);
      }

      if (pointerAktif.size === 1) {
        const sisa = Array.from(pointerAktif.values())[0];
        mulaiGeser = { x: sisa.x, y: sisa.y };
        pinchAwal = null;
      } else if (pointerAktif.size >= 2) {
        mulaiGeser = null;
        mulaiPinch();
      } else {
        mulaiGeser = null;
        pinchAwal = null;
        el.peta.classList.remove('sedang-geser');
      }
    }

    el.peta.addEventListener('pointerdown', tekanPointer);
    window.addEventListener('pointermove', gerakPointer);
    window.addEventListener('pointerup', lepasPointer);
    window.addEventListener('pointercancel', lepasPointer);

    el.peta.addEventListener('wheel', (peristiwa) => {
      if (!peristiwa.deltaY) return;
      const faktor = Math.exp(-peristiwa.deltaY * 0.0015);
      const zoomBaru = batasNilai(kamera.zoom * faktor, ZOOM_MIN, ZOOM_MAKS);
      if (zoomBaru === kamera.zoom) return;
      peristiwa.preventDefault();
      zoomDiLayar(faktor, peristiwa.clientX, peristiwa.clientY, false);
    }, { passive: false });

    if (el.zoomMasuk) el.zoomMasuk.addEventListener('click', () => ubahZoom(1.5));
    if (el.zoomKeluar) el.zoomKeluar.addEventListener('click', () => ubahZoom(1 / 1.5));
    if (el.zoomReset) el.zoomReset.addEventListener('click', () => resetKamera(true));

    // Saat form pohon terbuka, klik pada peta memilih posisi pin.
    el.peta.addEventListener('click', (peristiwa) => {
      if (!modePilihPosisi) return;
      peristiwa.stopPropagation();
      if (abaikanKlikPin) {
        abaikanKlikPin = false;
        return;
      }
      const titik = duniaDariLayar(peristiwa.clientX, peristiwa.clientY);
      const pos = persenDariDunia(titik.x, titik.y);
      setPosisiPilih(pos.x, pos.y);
    }, true);
  }

  function hapusSorotan() {
    if (!el.lapisanPin) return;
    el.lapisanPin.querySelectorAll('.pin-pohon').forEach((pin) => {
      pin.classList.remove('pin-sorot', 'pin-redup');
    });
  }

  function sorotPin(idPohon) {
    hapusSorotan();
    const target = el.lapisanPin.querySelector('.pin-pohon[data-id="' + CSS.escape(idPohon) + '"]');
    if (!target) return false;
    target.classList.add('pin-sorot');
    el.lapisanPin.querySelectorAll('.pin-pohon').forEach((pin) => {
      if (pin !== target) pin.classList.add('pin-redup');
    });
    return true;
  }

  function fokusPin(idPohon) {
    const target = el.lapisanPin.querySelector('.pin-pohon[data-id="' + CSS.escape(idPohon) + '"]');
    if (target && typeof target.focus === 'function') {
      try {
        target.focus({ preventScroll: true });
      } catch (err) {
        target.focus();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Panel detail pohon
  // ---------------------------------------------------------------------------

  function barisRincian(label, nilai) {
    return '<div class="baris-rincian"><dt>' + esc(label) + '</dt><dd>' + nilai + '</dd></div>';
  }

  function kelasKesehatan(nilai) {
    if (nilai >= 75) return 'baik';
    if (nilai >= 60) return 'sedang';
    return 'rendah';
  }

  function rincianHtml(pohon) {
    const kesehatan = Math.max(0, Math.min(100, Number(pohon.kesehatan) || 0));
    const resapan = pohon.resapanAir || { tingkat: '-', liter: 0 };
    const jadwal = window.SIPohon.formatTanggalIndonesia(pohon.jadwalPangkas);

    const kesehatanHtml =
      '<span class="nilai-kesehatan">' +
        '<span class="bar-kesehatan bar-' + kelasKesehatan(kesehatan) + '">' +
          '<span style="width:' + kesehatan + '%"></span>' +
        '</span>' +
        '<strong>' + kesehatan + '%</strong>' +
      '</span>';

    return [
      barisRincian('Kawasan', esc(pohon.taman)),
      barisRincian('Estimasi usia', esc(pohon.usia) + ' tahun'),
      barisRincian(
        'Daya resapan air',
        esc(resapan.tingkat) + ' <span class="teks-redup">(~' + esc(resapan.liter) + ' L/hari)</span>'
      ),
      barisRincian('Jadwal pemangkasan', esc(jadwal)),
      barisRincian('Tingkat kesehatan', kesehatanHtml)
    ].join('');
  }

  function bukaDetail(idPohon) {
    const pohon = window.SIPohon.getPohon(idPohon);
    if (!pohon) return false;

    const kelas = kelasStatus(pohon.status);
    el.detailKode.textContent = pohon.id;
    el.detailNama.textContent = pohon.nama;
    el.detailLatin.textContent = pohon.namaLatin || '-';
    el.detailBadge.className = 'badge badge-' + kelas;
    el.detailBadge.textContent = labelStatus(pohon.status);
    el.detailRincian.innerHTML = rincianHtml(pohon);
    el.detailTautan.href = 'index.html?id=' + encodeURIComponent(pohon.id);
    el.detailTautan.textContent = 'Buka Halaman Publik ' + pohon.id;

    bukaDialog(el.dialog);

    return true;
  }

  function tutupDetail() {
    tutupDialog(el.dialog);
  }

  function pasangPanelDetail() {
    el.lapisanPin.addEventListener('click', (peristiwa) => {
      if (modePilihPosisi) return;
      if (abaikanKlikPin) {
        abaikanKlikPin = false;
        return;
      }
      const pin = peristiwa.target instanceof Element
        ? peristiwa.target.closest('.pin-pohon')
        : null;
      if (!pin) return;
      // Klik pin juga menyorot baris pohon yang sesuai di tabel.
      const idPin = pin.getAttribute('data-id');
      idTerpilih = idPin;
      sorotBaris(idPin);
      bukaDetail(idPin);
    });

    el.lapisanPin.addEventListener('keydown', (peristiwa) => {
      if (peristiwa.key !== 'Enter' && peristiwa.key !== ' ') return;
      const pin = peristiwa.target instanceof Element
        ? peristiwa.target.closest('.pin-pohon')
        : null;
      if (!pin) return;
      peristiwa.preventDefault();
      const idPin = pin.getAttribute('data-id');
      idTerpilih = idPin;
      sorotBaris(idPin);
      bukaDetail(idPin);
    });

    el.tutupDialog.addEventListener('click', tutupDetail);

    el.dialog.addEventListener('click', (peristiwa) => {
      if (peristiwa.target === el.dialog) tutupDetail();
    });
  }

  // ---------------------------------------------------------------------------
  // Daftar laporan warga
  // ---------------------------------------------------------------------------

  function kelasTahap(tahap) {
    if (tahap >= 5) return 'badge-aman';
    if (tahap >= 3) return 'badge-dikerjakan';
    return 'badge-perhatian';
  }

  function pilihanLaporanHtml(id, jenis, daftar, terpilih, labelKosong, nonaktif) {
    const opsi = daftar.map((nilai) => (
      '<option value="' + esc(nilai) + '"' +
        (nilai === terpilih ? ' selected' : '') + '>' + esc(nilai) + '</option>'
    )).join('');

    return (
      '<select class="pilihan pilihan-laporan" id="' + esc(id) + '" data-pilih="' + jenis + '"' +
        (nonaktif ? ' disabled' : '') + '>' +
        '<option value="">' + esc(labelKosong) + '</option>' +
        opsi +
      '</select>'
    );
  }

  function laporanKartuHtml(laporan) {
    const tahap = Number(laporan.tahap) || 1;
    const pohon = window.SIPohon.getPohon(laporan.idPohon);
    const label = window.SIPohon.labelTahapLengkap(tahap, laporan.subTahap);
    const idTim = 'tim-' + laporan.id;
    const idSub = 'subtahap-' + laporan.id;
    const idAman = esc(laporan.id);

    function kelasTombol(siap) {
      return 'tombol tombol-kecil ' + (siap ? 'tombol-utama' : 'tombol-sekunder');
    }

    return `
      <article class="laporan-kartu" data-laporan="${idAman}">
        <div class="laporan-kepala">
          <div>
            <p class="laporan-kode">${idAman}</p>
            <p class="laporan-pohon">${esc(laporan.idPohon)} · ${esc(pohon ? pohon.nama : 'Pohon tidak ditemukan')}</p>
          </div>
          <span class="badge ${kelasTahap(tahap)}">${esc(label)}</span>
        </div>
        <p class="laporan-cuplikan">${esc(laporan.deskripsi)}</p>
        <p class="laporan-meta">Anonim (${esc(window.SIPohon.waktuRelatif(laporan.waktu))})</p>
        <div class="laporan-aksi">
          <button class="tombol tombol-sekunder tombol-kecil" type="button" data-aksi="detail">Tinjau Detail</button>
          <button class="${kelasTombol(tahap === 1)}" type="button" data-aksi="verifikasi"${tahap === 1 ? '' : ' disabled'}>Verifikasi</button>
          <div class="laporan-aksi-grup">
            <label class="sr-only" for="${esc(idTim)}">Tim lapangan untuk ${idAman}</label>
            ${pilihanLaporanHtml(idTim, 'tim', window.SIPohon.TIM, laporan.tim, 'Pilih tim...', tahap !== 2)}
            <button class="${kelasTombol(tahap === 2)}" type="button" data-aksi="tugaskan"${tahap === 2 ? '' : ' disabled'}>Tugaskan Tim Lapangan</button>
          </div>
          <div class="laporan-aksi-grup">
            <label class="sr-only" for="${esc(idSub)}">Sub-tahap pengerjaan untuk ${idAman}</label>
            ${pilihanLaporanHtml(idSub, 'subtahap', window.SIPohon.SUB_TAHAP, laporan.subTahap, 'Pilih sub-tahap...', tahap !== 3)}
            <button class="${kelasTombol(tahap === 3)}" type="button" data-aksi="mulai"${tahap === 3 ? '' : ' disabled'}>Mulai Pengerjaan</button>
          </div>
          <button class="${kelasTombol(tahap === 4)}" type="button" data-aksi="selesai"${tahap === 4 ? '' : ' disabled'}>Tandai Selesai</button>
          <p class="pesan-error laporan-pesan" data-pesan role="alert" hidden></p>
        </div>
      </article>
    `;
  }

  function laporanKosongHtml() {
    return `
      <div class="keadaan-kosong laporan-kosong">
        <h3>Belum ada laporan warga</h3>
        <p class="teks-redup">Laporan baru dari halaman publik akan muncul di sini.</p>
      </div>
    `;
  }

  function notifikasiLaporanHtml(laporan) {
    const tahap = Number(laporan.tahap) || 1;
    const pohon = window.SIPohon.getPohon(laporan.idPohon);
    const kelasTitik = tahap === 1 ? 'notif-baru' : 'notif-diproses';

    return `
      <button class="notif-laporan" type="button" data-buka-laporan title="${esc(laporan.deskripsi)}">
        <span class="notif-titik ${kelasTitik}" aria-hidden="true"></span>
        <span class="notif-isi">
          <span class="notif-kepala">
            <span class="notif-pohon">${esc(laporan.idPohon)}${pohon ? ' · ' + esc(pohon.nama) : ''}</span>
            <span class="notif-waktu">Anonim (${esc(window.SIPohon.waktuRelatif(laporan.waktu))})</span>
          </span>
          <span class="notif-cuplikan">${esc(laporan.deskripsi)}</span>
        </span>
      </button>
    `;
  }

  function notifikasiKosongHtml() {
    return `
      <div class="notif-kosong">
        <p>Belum ada laporan warga.</p>
      </div>
    `;
  }

  function renderLaporan() {
    const daftar = window.SIPohon.getSemuaLaporan();

    if (el.daftarLaporan) {
      el.daftarLaporan.innerHTML = daftar.length
        ? daftar.slice(0, 5).map(notifikasiLaporanHtml).join('')
        : notifikasiKosongHtml();
    }

    if (el.daftarLaporanLengkap) {
      el.daftarLaporanLengkap.innerHTML = daftar.length
        ? daftar.map(laporanKartuHtml).join('')
        : laporanKosongHtml();
    }

    if (el.ringkasanLaporan) {
      const berjalan = daftar.filter((laporan) => Number(laporan.tahap) < 5).length;
      el.ringkasanLaporan.textContent = daftar.length + ' laporan · ' + berjalan + ' berjalan';
    }
  }

  function isiDetailLaporan(laporan) {
    const pohon = window.SIPohon.getPohon(laporan.idPohon);
    const tahap = Number(laporan.tahap) || 1;
    const label = window.SIPohon.labelTahapLengkap(tahap, laporan.subTahap);
    const waktu = window.SIPohon.waktuRelatif(laporan.waktu);
    const tanggal = window.SIPohon.formatTanggalIndonesia(laporan.waktu);

    el.detailLaporanKode.textContent = laporan.id;
    el.detailLaporanJudul.textContent = 'Detail Laporan Warga';
    el.detailLaporanMeta.textContent =
      laporan.idPohon + (pohon ? ' · ' + pohon.nama : '') + ' · Anonim (' + waktu + ')';
    el.detailLaporanBadge.className = 'badge ' + kelasTahap(tahap);
    el.detailLaporanBadge.textContent = label;
    el.detailLaporanDeskripsi.textContent = laporan.deskripsi;

    if (laporan.foto) {
      el.detailLaporanFoto.src = laporan.foto;
      el.detailLaporanFoto.alt = 'Foto laporan ' + laporan.id;
      el.detailLaporanFotoWadah.hidden = false;
    } else {
      el.detailLaporanFoto.removeAttribute('src');
      el.detailLaporanFotoWadah.hidden = true;
    }

    el.detailLaporanRincian.innerHTML = [
      barisRincian('Tahap saat ini', esc(label)),
      barisRincian('Tim lapangan', laporan.tim
        ? esc(laporan.tim)
        : '<span class="teks-redup">Belum ditugaskan</span>'),
      barisRincian('Sub-tahap', laporan.subTahap
        ? esc(laporan.subTahap)
        : '<span class="teks-redup">Belum ada</span>'),
      barisRincian('Waktu laporan', esc(tanggal)),
      barisRincian('Perkiraan selesai', esc(window.SIPohon.perkiraanSelesai(laporan)))
    ].join('');

    el.detailLaporanTautan.href = 'index.html?id=' + encodeURIComponent(laporan.idPohon);
    el.detailLaporanTautan.textContent = 'Buka Halaman Publik ' + laporan.idPohon;
  }

  function bukaDetailLaporan(idLaporan) {
    const laporan = window.SIPohon.getLaporan(idLaporan);
    if (!laporan) return false;

    isiDetailLaporan(laporan);

    bukaDialog(el.dialogLaporan);

    return true;
  }

  function tutupDetailLaporan() {
    tutupDialog(el.dialogLaporan);
  }

  function tampilkanPesanLaporan(kartu, pesan) {
    const wadah = kartu.querySelector('[data-pesan]');
    if (!wadah) return;
    wadah.textContent = pesan;
    wadah.hidden = false;
  }

  function jalankanAksiLaporan(kartu, aksi) {
    const id = kartu.getAttribute('data-laporan');
    const laporan = window.SIPohon.getLaporan(id);
    if (!laporan) {
      tampilkanToast('Laporan tidak ditemukan. Daftar akan dimuat ulang.');
      renderSemua();
      return;
    }

    if (aksi === 'detail') {
      bukaDetailLaporan(id);
      return;
    }

    let tahap = null;
    const opsi = {};

    if (aksi === 'verifikasi') {
      tahap = 2;
    } else if (aksi === 'tugaskan') {
      const pilih = kartu.querySelector('[data-pilih="tim"]');
      opsi.tim = pilih ? pilih.value : '';
      if (!opsi.tim) {
        tampilkanPesanLaporan(kartu, 'Pilih tim lapangan terlebih dahulu.');
        return;
      }
      tahap = 3;
    } else if (aksi === 'mulai') {
      const pilih = kartu.querySelector('[data-pilih="subtahap"]');
      opsi.subTahap = pilih ? pilih.value : '';
      if (!opsi.subTahap) {
        tampilkanPesanLaporan(kartu, 'Pilih sub-tahap pengerjaan terlebih dahulu.');
        return;
      }
      tahap = 4;
    } else if (aksi === 'selesai') {
      tahap = 5;
    }

    if (!tahap) return;

    const hasil = window.SIPohon.ubahTahapLaporan(id, tahap, opsi);
    if (!hasil.ok) {
      tampilkanPesanLaporan(kartu, hasil.pesan || 'Perubahan tahap gagal disimpan.');
      return;
    }

    renderSemua();
    tampilkanToast(
      'Laporan ' + id + ' diperbarui: ' +
      window.SIPohon.labelTahapLengkap(hasil.laporan.tahap, hasil.laporan.subTahap) + '.'
    );

    if (el.dialogLaporan.open && el.detailLaporanKode.textContent === id) {
      isiDetailLaporan(hasil.laporan);
    }
  }

  function bukaMenuLaporan() {
    tutupDetail();
    tutupDetailLaporan();
    tampilkanTampilan('laporan');
    tutupSidebar(false);
  }

  function pasangDaftarLaporan() {
    if (el.daftarLaporan) {
      el.daftarLaporan.addEventListener('click', (peristiwa) => {
        const baris = peristiwa.target instanceof Element
          ? peristiwa.target.closest('[data-buka-laporan]')
          : null;
        if (baris) bukaMenuLaporan();
      });
    }

    if (el.tombolLihatSemuaLaporan) {
      el.tombolLihatSemuaLaporan.addEventListener('click', bukaMenuLaporan);
    }

    if (!el.daftarLaporanLengkap) return;

    el.daftarLaporanLengkap.addEventListener('click', (peristiwa) => {
      const tombol = peristiwa.target instanceof Element
        ? peristiwa.target.closest('[data-aksi]')
        : null;
      if (!tombol || tombol.disabled) return;
      const kartu = tombol.closest('.laporan-kartu');
      if (!kartu) return;
      jalankanAksiLaporan(kartu, tombol.getAttribute('data-aksi'));
    });
  }

  function pasangDialogLaporan() {
    if (!el.dialogLaporan) return;

    el.tutupDialogLaporan.addEventListener('click', tutupDetailLaporan);

    el.dialogLaporan.addEventListener('click', (peristiwa) => {
      if (peristiwa.target === el.dialogLaporan) tutupDetailLaporan();
    });
  }

  // ---------------------------------------------------------------------------
  // Pencarian ID pohon
  // ---------------------------------------------------------------------------

  function bersihkanErrorCari() {
    el.errorCari.hidden = true;
    el.errorCari.textContent = '';
    el.inputCari.removeAttribute('aria-invalid');
  }

  function tampilkanErrorCari(pesan) {
    el.errorCari.textContent = pesan;
    el.errorCari.hidden = false;
    el.inputCari.setAttribute('aria-invalid', 'true');
    el.inputCari.focus();
  }

  function pasangPencarian() {
    el.formCari.addEventListener('submit', (peristiwa) => {
      peristiwa.preventDefault();
      const masukan = el.inputCari.value.trim();

      if (!masukan) {
        tampilkanErrorCari('Masukkan ID pohon terlebih dahulu.');
        return;
      }

      const kode = kodeKueri(masukan);
      const pohon = window.SIPohon.getPohon(kode);

      if (!pohon) {
        tampilkanErrorCari('ID pohon "' + kode + '" tidak ditemukan. Periksa kembali kode pada papan pohon.');
        return;
      }

      bersihkanErrorCari();
      if (tampilanAktif !== 'data-pohon') tampilkanTampilan('dashboard');
      pusatkanKePin(pohon);
      sorotPin(pohon.id);
      idTerpilih = pohon.id;
      sorotBaris(pohon.id);
      fokusPin(pohon.id);
      el.statusCari.textContent = 'Pin ' + pohon.id + ' disorot di peta.';
      if (el.kartuPeta && typeof el.kartuPeta.scrollIntoView === 'function') {
        el.kartuPeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      bukaDetail(pohon.id);
    });

    el.inputCari.addEventListener('input', () => {
      bersihkanErrorCari();
      const masukan = el.inputCari.value.trim();

      if (!masukan) {
        idTerpilih = null;
        hapusSorotan();
        hapusSorotanBaris();
        el.statusCari.textContent = '';
        return;
      }

      const pohon = window.SIPohon.getPohon(kodeKueri(masukan));
      if (!pohon) {
        idTerpilih = null;
        hapusSorotan();
        hapusSorotanBaris();
        el.statusCari.textContent = '';
        return;
      }

      sorotPin(pohon.id);
      idTerpilih = pohon.id;
      sorotBaris(pohon.id);
      el.statusCari.textContent = 'Pin ' + pohon.id + ' disorot di peta. Tekan Enter untuk membuka detail.';
    });
  }

  // ---------------------------------------------------------------------------
  // Jam dan tanggal WIB
  // ---------------------------------------------------------------------------

  function perbaruiWaktu() {
    const sekarang = new Date();
    el.tanggal.textContent = window.SIPohon.formatTanggalLengkapWIB(sekarang);
    el.jam.textContent = window.SIPohon.formatJamWIB(sekarang);
  }

  function mulaiWaktu() {
    perbaruiWaktu();
    if (jamInterval) window.clearInterval(jamInterval);
    jamInterval = window.setInterval(perbaruiWaktu, 1000);
  }

  // ---------------------------------------------------------------------------
  // Navigasi sidebar dan tampilan
  // ---------------------------------------------------------------------------

  function menuAktif(nama) {
    el.menu.forEach((tombol) => {
      const aktif = tombol.dataset.tampilan === nama;
      tombol.classList.toggle('aktif', aktif);
      if (aktif) tombol.setAttribute('aria-current', 'page');
      else tombol.removeAttribute('aria-current');
    });
  }

  // Satu peta dipakai bersama: berada di Dashboard, dan dipindah ke halaman
  // Data Pohon agar posisi pohon baru bisa dipilih di peta yang sama.
  function pindahkanPeta(keDataPohon) {
    if (!el.kartuPeta) return;
    if (keDataPohon) {
      if (el.slotPetaData && el.kartuPeta.parentElement !== el.slotPetaData) {
        el.slotPetaData.appendChild(el.kartuPeta);
      }
    } else if (el.gridDasbor && el.kartuPeta.parentElement !== el.gridDasbor) {
      el.gridDasbor.insertBefore(el.kartuPeta, el.gridDasbor.firstChild);
    }
  }

  function tampilkanTampilan(nama) {
    const tampilDashboard = nama === 'dashboard';
    const tampilLaporan = nama === 'laporan';
    const tampilData = nama === 'data-pohon';
    const tampilSegera = !tampilDashboard && !tampilLaporan && !tampilData;

    tampilanAktif = nama;
    pindahkanPeta(tampilData);

    el.tampilanDashboard.hidden = !tampilDashboard;
    el.tampilanLaporan.hidden = !tampilLaporan;
    if (el.tampilanDataPohon) el.tampilanDataPohon.hidden = !tampilData;
    el.tampilanSegera.hidden = !tampilSegera;

    if (tampilLaporan) renderLaporan();

    if (tampilSegera) {
      el.deskripsiSegera.textContent = DESKRIPSI_SEGERA[nama] || 'Fitur ini akan tersedia pada versi berikutnya.';
    }

    menuAktif(nama);
  }

  function sidebarTerbuka() {
    return el.sidebar.classList.contains('terbuka');
  }

  function bukaSidebar() {
    el.sidebar.classList.add('terbuka');
    el.lapisanSidebar.hidden = false;
    el.tombolMenu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('kunci-gulir');
    const pertama = el.sidebar.querySelector('.menu-dasbor');
    if (pertama) window.setTimeout(() => pertama.focus(), 60);
  }

  function tutupSidebar(kembalikanFokus) {
    if (!sidebarTerbuka()) return;
    el.sidebar.classList.remove('terbuka');
    el.lapisanSidebar.hidden = true;
    el.tombolMenu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('kunci-gulir');
    if (kembalikanFokus) el.tombolMenu.focus();
  }

  function pasangNavigasi() {
    el.menu.forEach((tombol) => {
      tombol.addEventListener('click', () => {
        const target = tombol.dataset.tampilan;
        tutupDetail();
        tutupDetailLaporan();
        tutupFormPohon();
        tampilkanTampilan(target);
        tutupSidebar(false);
      });
    });

    el.kembaliDasbor.addEventListener('click', () => {
      tutupDetail();
      tutupDetailLaporan();
      tutupFormPohon();
      tampilkanTampilan('dashboard');
      const menuDashboard = el.menu.find((tombol) => tombol.dataset.tampilan === 'dashboard');
      if (menuDashboard) menuDashboard.focus();
    });

    el.tombolMenu.addEventListener('click', () => {
      if (sidebarTerbuka()) tutupSidebar(true);
      else bukaSidebar();
    });

    el.lapisanSidebar.addEventListener('click', () => tutupSidebar(true));

    document.addEventListener('keydown', (peristiwa) => {
      if (peristiwa.key === 'Escape' && sidebarTerbuka()) {
        tutupSidebar(true);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && sidebarTerbuka()) {
        tutupSidebar(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Tabel Data Pohon — satu tempat pengelolaan pohon
  // ---------------------------------------------------------------------------

  function labelLokasi(lokasiTipe) {
    return lokasiTipe === 'jalan' ? 'Di jalan sekitar taman' : 'Di dalam taman';
  }

  function barisTabelHtml(pohon) {
    const kelas = kelasStatus(pohon.status);
    const kesehatan = Math.max(0, Math.min(100, Number(pohon.kesehatan) || 0));
    const id = esc(pohon.id);
    const aria = pohon.id + ', ' + pohon.nama + ', ' + labelStatus(pohon.status) +
      '. Klik untuk menyorot pin di peta.';

    return `
      <tr class="baris-tabel" data-id="${id}" tabindex="0" aria-label="${esc(aria)}">
        <td class="sel-kode">${id}</td>
        <td class="sel-nama">${esc(pohon.nama)}</td>
        <td class="sel-latin">${esc(pohon.namaLatin || '-')}</td>
        <td class="sel-lokasi">${esc(labelLokasi(pohon.lokasiTipe))}</td>
        <td class="sel-status"><span class="badge badge-${kelas}">${esc(labelStatus(pohon.status))}</span></td>
        <td class="sel-kesehatan">
          <span class="nilai-kesehatan nilai-kesehatan-tabel">
            <span class="bar-kesehatan bar-${kelasKesehatan(kesehatan)}"><span style="width:${kesehatan}%"></span></span>
            <strong>${kesehatan}%</strong>
          </span>
        </td>
        <td class="sel-aksi">
          <div class="aksi-tabel">
            <button class="tombol tombol-sekunder tombol-kecil" type="button" data-aksi="ubah" data-id="${id}">Ubah</button>
            <button class="tombol tombol-bahaya tombol-kecil" type="button" data-aksi="hapus" data-id="${id}">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }

  // Menyaring daftar pohon sesuai kolom cari (kode/nama) dan filter status/lokasi.
  function pohonTabelTersaring() {
    const mentah = el.inputCariTabel ? el.inputCariTabel.value.trim() : '';
    const kueri = mentah.toLowerCase();
    const kode = kodeKueri(mentah).toLowerCase();
    const status = el.filterStatus ? el.filterStatus.value : '';
    const lokasi = el.filterLokasi ? el.filterLokasi.value : '';

    return window.SIPohon.getSemuaPohon().filter((pohon) => {
      if (status && pohon.status !== status) return false;
      if (lokasi && (pohon.lokasiTipe || 'taman') !== lokasi) return false;
      if (kueri) {
        const cocokKode = pohon.id.toLowerCase().includes(kode);
        const cocokNama = pohon.nama.toLowerCase().includes(kueri);
        const cocokLatin = String(pohon.namaLatin || '').toLowerCase().includes(kueri);
        if (!cocokKode && !cocokNama && !cocokLatin) return false;
      }
      return true;
    });
  }

  function renderTabelPohon() {
    if (!el.isiTabel) return;
    const total = window.SIPohon.getSemuaPohon().length;
    const daftar = pohonTabelTersaring();

    if (el.jumlahTabel) {
      el.jumlahTabel.textContent = daftar.length === total
        ? total + ' pohon'
        : daftar.length + ' dari ' + total + ' pohon';
    }

    el.isiTabel.innerHTML = daftar.length
      ? daftar.map(barisTabelHtml).join('')
      : '<tr class="baris-kosong"><td colspan="7">Tidak ada pohon yang cocok dengan pencarian atau filter.</td></tr>';

    if (idTerpilih) sorotBaris(idTerpilih);
  }

  function sorotBaris(id) {
    if (!el.isiTabel) return;
    el.isiTabel.querySelectorAll('.baris-tabel').forEach((baris) => {
      baris.classList.toggle('baris-terpilih', baris.getAttribute('data-id') === id);
    });
  }

  function hapusSorotanBaris() {
    sorotBaris(null);
  }

  // Klik baris: sorot baris + pin dan pusatkan (zoom) peta ke pin.
  function pilihBaris(id) {
    const pohon = window.SIPohon.getPohon(id);
    if (!pohon) return;
    idTerpilih = id;
    sorotBaris(id);
    sorotPin(id);
    pusatkanKePin(pohon);
    if (el.statusTabel) {
      el.statusTabel.textContent = 'Pohon ' + id + ' dipilih. Peta dipusatkan ke pin.';
    }
    if (el.kartuPeta && typeof el.kartuPeta.scrollIntoView === 'function') {
      el.kartuPeta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function pasangTabelPohon() {
    if (el.formCariTabel) {
      el.formCariTabel.addEventListener('submit', (peristiwa) => {
        peristiwa.preventDefault();
        renderTabelPohon();
      });
    }
    if (el.inputCariTabel) el.inputCariTabel.addEventListener('input', renderTabelPohon);
    if (el.filterStatus) el.filterStatus.addEventListener('change', renderTabelPohon);
    if (el.filterLokasi) el.filterLokasi.addEventListener('change', renderTabelPohon);

    if (el.tombolTambahTabel) {
      el.tombolTambahTabel.addEventListener('click', () => {
        bukaFormPohon(null);
      });
    }

    if (!el.isiTabel) return;

    el.isiTabel.addEventListener('click', (peristiwa) => {
      const target = peristiwa.target instanceof Element ? peristiwa.target : null;
      if (!target) return;

      const tombol = target.closest('[data-aksi]');
      if (tombol) {
        peristiwa.stopPropagation();
        const id = tombol.getAttribute('data-id');
        if (tombol.getAttribute('data-aksi') === 'ubah') {
          const pohon = window.SIPohon.getPohon(id);
          if (pohon) bukaFormPohon(pohon);
        } else if (tombol.getAttribute('data-aksi') === 'hapus') {
          bukaHapusPohon(id);
        }
        return;
      }

      const baris = target.closest('.baris-tabel');
      if (baris) pilihBaris(baris.getAttribute('data-id'));
    });

    el.isiTabel.addEventListener('keydown', (peristiwa) => {
      if (peristiwa.key !== 'Enter' && peristiwa.key !== ' ') return;
      const target = peristiwa.target instanceof Element ? peristiwa.target : null;
      if (!target || target.closest('[data-aksi]')) return;
      const baris = target.closest('.baris-tabel');
      if (!baris) return;
      peristiwa.preventDefault();
      pilihBaris(baris.getAttribute('data-id'));
    });
  }

  // ---------------------------------------------------------------------------
  // Kelola data pohon
  // ---------------------------------------------------------------------------

  function bersihkanErrorForm() {
    [el.errorNama, el.errorKesehatan, el.errorForm].forEach((wadah) => {
      if (!wadah) return;
      wadah.hidden = true;
      wadah.textContent = '';
    });
    if (el.inputNama) el.inputNama.removeAttribute('aria-invalid');
    if (el.inputKesehatan) el.inputKesehatan.removeAttribute('aria-invalid');
  }

  function tampilkanErrorForm(wadah, pesan) {
    if (!wadah) return;
    wadah.textContent = pesan;
    wadah.hidden = false;
  }

  // Mengisi form dari data pohon. Tanpa argumen berarti mode tambah pohon.
  function isiFormPohon(pohon) {
    if (pohon) {
      const resapan = pohon.resapanAir || {};
      el.judulForm.textContent = 'Ubah Pohon ' + pohon.id;
      el.subForm.textContent = 'Perbarui data pohon. Klik pada peta bila ingin memindahkan pin.';
      el.inputKode.value = pohon.id;
      el.inputNama.value = pohon.nama || '';
      el.inputLatin.value = pohon.namaLatin || '';
      el.inputUsia.value = Number.isFinite(Number(pohon.usia)) ? pohon.usia : 0;
      el.inputResapan.value = ['Tinggi', 'Sedang', 'Rendah'].includes(resapan.tingkat)
        ? resapan.tingkat
        : 'Sedang';
      el.inputLiter.value = Number.isFinite(Number(resapan.liter)) ? resapan.liter : 0;
      el.inputPangkas.value = /^\d{4}-\d{2}-\d{2}$/.test(pohon.jadwalPangkas || '')
        ? pohon.jadwalPangkas
        : '';
      el.inputKesehatan.value = Number.isFinite(Number(pohon.kesehatan)) ? pohon.kesehatan : 0;
      el.inputStatus.value = ['aman', 'perhatian', 'kritis', 'dikerjakan'].includes(pohon.status)
        ? pohon.status
        : 'aman';
      el.inputLokasi.value = pohon.lokasiTipe === 'jalan' ? 'jalan' : 'taman';
      posisiPilih = { x: Number(pohon.x) || 0, y: Number(pohon.y) || 0 };
      return;
    }

    el.judulForm.textContent = 'Tambah Pohon';
    el.subForm.textContent = 'Isi data pohon, lalu klik pada peta untuk memilih posisi pin.';
    el.formPohon.reset();
    el.inputKode.value = window.SIPohon.kodePohonBerikutnya();
    el.inputKesehatan.value = 75;
    posisiPilih = { x: 50, y: 50 };
  }

  function bukaFormPohon(pohon) {
    if (!el.panelForm) return;
    if (tampilanAktif !== 'data-pohon') tampilkanTampilan('data-pohon');
    if (el.tampilanDataPohon) el.tampilanDataPohon.classList.add('form-terbuka');
    idPohonDiubah = pohon ? pohon.id : null;
    modePilihPosisi = true;
    bersihkanErrorForm();
    isiFormPohon(pohon);
    // Dialog dibuka non-modal agar peta di belakangnya tetap bisa diklik
    // untuk memilih posisi pin, di-zoom, dan digeser.
    if (typeof el.panelForm.show === 'function') {
      if (!el.panelForm.open) el.panelForm.show();
    } else {
      el.panelForm.setAttribute('open', '');
    }
    setPosisiPilih(posisiPilih.x, posisiPilih.y);
    if (el.kartuPeta && typeof el.kartuPeta.scrollIntoView === 'function') {
      el.kartuPeta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (el.inputNama) window.setTimeout(() => el.inputNama.focus({ preventScroll: true }), 40);
  }

  function tutupFormPohon() {
    if (!el.panelForm) return;
    if (el.tampilanDataPohon) el.tampilanDataPohon.classList.remove('form-terbuka');
    modePilihPosisi = false;
    idPohonDiubah = null;
    posisiPilih = null;
    if (el.panelForm.open && typeof el.panelForm.close === 'function') {
      el.panelForm.close();
    } else {
      el.panelForm.removeAttribute('open');
    }
    if (el.lapisanPilih) el.lapisanPilih.innerHTML = '';
  }

  function kirimFormPohon(peristiwa) {
    peristiwa.preventDefault();
    bersihkanErrorForm();

    const nama = el.inputNama.value.trim();
    const kesehatanMentah = String(el.inputKesehatan.value).trim();
    const kesehatan = Number(kesehatanMentah);
    let adaError = false;

    if (!nama) {
      tampilkanErrorForm(el.errorNama, 'Nama pohon wajib diisi.');
      el.inputNama.setAttribute('aria-invalid', 'true');
      adaError = true;
    }
    if (!kesehatanMentah || !Number.isFinite(kesehatan) || kesehatan < 0 || kesehatan > 100) {
      tampilkanErrorForm(el.errorKesehatan, 'Tingkat kesehatan harus angka 0 sampai 100.');
      el.inputKesehatan.setAttribute('aria-invalid', 'true');
      adaError = true;
    }
    if (adaError) {
      tampilkanErrorForm(el.errorForm, 'Periksa kembali kolom yang ditandai merah.');
      const fokus = el.inputNama.getAttribute('aria-invalid') === 'true'
        ? el.inputNama
        : el.inputKesehatan;
      fokus.focus();
      return;
    }

    const usia = Number(el.inputUsia.value);
    const liter = Number(el.inputLiter.value);
    const muatan = {
      nama,
      namaLatin: el.inputLatin.value.trim(),
      taman: window.SIPohon.NAMA_TAMAN,
      x: posisiPilih ? posisiPilih.x : 50,
      y: posisiPilih ? posisiPilih.y : 50,
      lokasiTipe: el.inputLokasi.value,
      usia: Number.isFinite(usia) && usia >= 0 ? usia : 0,
      resapanAir: {
        tingkat: el.inputResapan.value,
        liter: Number.isFinite(liter) && liter >= 0 ? liter : 0
      },
      jadwalPangkas: el.inputPangkas.value,
      kesehatan: Math.round(kesehatan),
      status: el.inputStatus.value
    };

    const mengubah = Boolean(idPohonDiubah);
    const hasil = mengubah
      ? window.SIPohon.ubahPohon(idPohonDiubah, muatan)
      : window.SIPohon.tambahPohon(muatan);

    if (!hasil.ok) {
      tampilkanErrorForm(el.errorForm, hasil.pesan || 'Data pohon gagal disimpan.');
      return;
    }

    const pohon = hasil.pohon;
    tutupFormPohon();
    idTerpilih = pohon.id;
    renderSemua();
    pusatkanKePin(pohon);
    sorotPin(pohon.id);
    sorotBaris(pohon.id);
    tampilkanToast(mengubah
      ? 'Data pohon ' + pohon.id + ' diperbarui.'
      : 'Pohon ' + pohon.id + ' ditambahkan.');
    bukaDetail(pohon.id);
  }

  // Bisa dipanggil dari tabel (idMinta) maupun dari panel detail (tanpa argumen).
  function bukaHapusPohon(idMinta) {
    const id = idMinta || (el.detailKode ? el.detailKode.textContent : '');
    const pohon = window.SIPohon.getPohon(id);
    if (!pohon) return;

    idPohonHapus = id;
    const daftarLaporan = window.SIPohon.laporanUntukPohon(id);
    const jumlahLaporan = daftarLaporan.length;
    const laporanBerjalan = daftarLaporan.filter((laporan) => Number(laporan.tahap) < 5).length;

    el.hapusKode.textContent = id;
    el.judulHapus.textContent = 'Hapus ' + pohon.nama + '?';
    el.pesanHapus.textContent = 'Pohon ' + id +
      ' akan dihapus dari peta, metrik, dan daftar kawasan. Tindakan ini tidak dapat dibatalkan.';

    if (laporanBerjalan) {
      el.peringatanHapus.textContent = 'Peringatan: pohon ini memiliki ' + laporanBerjalan +
        ' laporan yang masih berjalan' +
        (jumlahLaporan > laporanBerjalan ? ' (total ' + jumlahLaporan + ' laporan)' : '') +
        '. Semua laporan tersebut akan ikut terhapus.';
      el.peringatanHapus.hidden = false;
    } else if (jumlahLaporan) {
      el.peringatanHapus.textContent = 'Peringatan: pohon ini memiliki ' + jumlahLaporan +
        ' laporan warga yang juga akan ikut terhapus.';
      el.peringatanHapus.hidden = false;
    } else {
      el.peringatanHapus.hidden = true;
      el.peringatanHapus.textContent = '';
    }

    tutupDetail();
    bukaDialog(el.dialogHapus);
  }

  function konfirmasiHapusPohon() {
    const id = idPohonHapus;
    if (!id) return;

    const hasil = window.SIPohon.hapusPohon(id);
    if (!hasil.ok) {
      window.alert(hasil.pesan || 'Pohon gagal dihapus.');
      return;
    }

    idPohonHapus = null;
    if (idTerpilih === id) idTerpilih = null;
    tutupDialog(el.dialogHapus);
    if (el.inputCari) {
      el.inputCari.value = '';
      el.statusCari.textContent = '';
    }
    renderSemua();
    tampilkanToast('Pohon ' + id + ' dihapus' +
      (hasil.laporanDihapus ? ' beserta ' + hasil.laporanDihapus + ' laporan.' : '.'));
  }

  function pasangKelolaPohon() {
    if (el.tutupForm) el.tutupForm.addEventListener('click', tutupFormPohon);
    if (el.batalForm) el.batalForm.addEventListener('click', tutupFormPohon);
    if (el.formPohon) el.formPohon.addEventListener('submit', kirimFormPohon);

    if (el.tombolUbah) {
      el.tombolUbah.addEventListener('click', () => {
        const pohon = window.SIPohon.getPohon(el.detailKode.textContent);
        if (!pohon) return;
        tutupDetail();
        bukaFormPohon(pohon);
      });
    }
    if (el.tombolHapus) el.tombolHapus.addEventListener('click', () => bukaHapusPohon());

    if (el.dialogHapus) {
      if (el.tutupHapus) el.tutupHapus.addEventListener('click', () => tutupDialog(el.dialogHapus));
      if (el.batalHapus) el.batalHapus.addEventListener('click', () => tutupDialog(el.dialogHapus));
      if (el.konfirmasiHapus) el.konfirmasiHapus.addEventListener('click', konfirmasiHapusPohon);
      el.dialogHapus.addEventListener('click', (peristiwa) => {
        if (peristiwa.target === el.dialogHapus) tutupDialog(el.dialogHapus);
      });
    }

    // Dialog form pohon bersifat non-modal, jadi tombol Esc ditangani manual.
    document.addEventListener('keydown', (peristiwa) => {
      if (peristiwa.key === 'Escape' && el.panelForm && el.panelForm.open) {
        tutupFormPohon();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Reset data demo
  // ---------------------------------------------------------------------------

  function renderSemua() {
    renderMetrik();
    renderPeta();
    renderTabelPohon();
    renderLaporan();
    renderPreviewPilih();

    if (idTerpilih && window.SIPohon.getPohon(idTerpilih)) {
      sorotPin(idTerpilih);
      sorotBaris(idTerpilih);
    } else {
      idTerpilih = null;
      hapusSorotan();
      hapusSorotanBaris();
    }
  }

  function muatUlangData() {
    el.inputCari.value = '';
    el.statusCari.textContent = '';
    bersihkanErrorCari();
    if (el.inputCariTabel) el.inputCariTabel.value = '';
    if (el.filterStatus) el.filterStatus.value = '';
    if (el.filterLokasi) el.filterLokasi.value = '';
    idTerpilih = null;
    resetKamera(false);
    renderSemua();
  }

  function pasangReset() {
    el.tombolReset.addEventListener('click', () => {
      const setuju = window.confirm(
        'Reset data demo ke kondisi awal? Semua laporan dan perubahan akan dihapus.'
      );
      if (!setuju) return;

      const hasil = window.SIPohon.resetData();
      if (!hasil.ok) {
        window.alert(hasil.pesan || 'Data gagal direset. Coba lagi.');
        return;
      }

      tutupDetail();
      tutupDetailLaporan();
      tutupFormPohon();
      if (el.dialogHapus) tutupDialog(el.dialogHapus);
      idPohonHapus = null;
      muatUlangData();
      tampilkanTampilan('dashboard');
      tampilkanToast('Data demo berhasil direset ke kondisi awal.');
    });
  }

  // ---------------------------------------------------------------------------
  // Mulai
  // ---------------------------------------------------------------------------

  function mulai() {
    if (!window.SIPohon) {
      const isi = document.getElementById('isi-dasbor');
      if (isi) {
        isi.innerHTML = '<section class="kartu kartu-isi"><p>Data dashboard gagal dimuat. Muat ulang halaman ini.</p></section>';
      }
      return;
    }

    ambilElemen();
    const judulDasbor = document.getElementById('judul-dasbor');
    if (judulDasbor) judulDasbor.textContent = 'Kawasan ' + window.SIPohon.NAMA_TAMAN;
    if (el.judulPeta) el.judulPeta.textContent = 'Peta Lokasi Pohon - Kawasan ' + window.SIPohon.NAMA_TAMAN;
    if (el.labelTamanPeta) el.labelTamanPeta.textContent = window.SIPohon.NAMA_TAMAN;

    renderSemua();
    pasangPetaInteraksi();
    mulaiWaktu();
    pasangPencarian();
    pasangPanelDetail();
    pasangDialogLaporan();
    pasangDaftarLaporan();
    pasangNavigasi();
    pasangReset();
    pasangKelolaPohon();
    pasangTabelPohon();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();