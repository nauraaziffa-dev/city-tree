(function () {
  'use strict';

  const KUNCI = 'sipohon_data_v1';
  // Naikkan versi ini setiap struktur/isi data awal berubah agar data lama
  // di localStorage otomatis diganti dengan data dari data.js.
  const DATA_VERSION = 2;
  const NAMA_TAMAN = 'Taman Malioboro';

  const STATUS = Object.freeze({
    AMAN: 'aman',
    PERHATIAN: 'perhatian',
    KRITIS: 'kritis',
    DIKERJAKAN: 'dikerjakan'
  });

  const LABEL_STATUS = Object.freeze({
    aman: 'Sehat & Aman',
    perhatian: 'Perlu Perhatian',
    kritis: 'Kondisi Kritis',
    dikerjakan: 'Sedang Dikerjakan'
  });

  const LABEL_TAHAP = Object.freeze([
    'Laporan diterima',
    'Diverifikasi',
    'Ditugaskan',
    'Dikerjakan',
    'Selesai'
  ]);

  const LABEL_PROGRES = Object.freeze([
    'Laporan',
    'Verifikasi',
    'Ditugaskan',
    'Dikerjakan',
    'Selesai'
  ]);

  const SUB_TAHAP = Object.freeze(['Survei', 'Pengerjaan', 'Pemeriksaan akhir']);

  const TIM = Object.freeze([
    'Tim Pemangkasan A',
    'Tim Pemangkasan B',
    'Tim Survei & Perawatan'
  ]);

  // ---------------------------------------------------------------------------
  // Pembuat data contoh
  // ---------------------------------------------------------------------------

  function salin(nilai) {
    return JSON.parse(JSON.stringify(nilai));
  }

  function gagal(pesan) {
    return { ok: false, pesan };
  }

  function batasAngka(nilai, minimum, maksimum, cadangan) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) return cadangan;
    return Math.min(maksimum, Math.max(minimum, angka));
  }

  function tanggalHariIni() {
    const sekarang = new Date();
    const dua = (angka) => String(angka).padStart(2, '0');
    return (
      sekarang.getFullYear() + '-' +
      dua(sekarang.getMonth() + 1) + '-' +
      dua(sekarang.getDate())
    );
  }

  function waktuLalu(menit) {
    return new Date(Date.now() - menit * 60 * 1000).toISOString();
  }

  // Foto contoh berupa gambar SVG agar data awal tetap ringan.
  function fotoContoh(warna, keterangan) {
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">',
      '<rect width="640" height="420" fill="#EEF3EA"/>',
      '<rect y="300" width="640" height="120" fill="#DCE7D8"/>',
      '<path d="M0 300h640" stroke="#C3D3BE" stroke-width="10"/>',
      '<rect x="304" y="190" width="32" height="120" rx="10" fill="#7A5A3A"/>',
      `<path d="M320 60c70 25 100 75 66 125-40 58-112 44-128 4-16-40 10-96 62-129Z" fill="${warna}"/>`,
      '<path d="M320 70c-20 42-28 86-20 134" stroke="#E3F1E0" stroke-width="6" fill="none" stroke-linecap="round"/>',
      `<text x="320" y="378" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="#4B5563">${keterangan}</text>`,
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function riwayat(tanggal, judul, keterangan) {
    return { tanggal, judul, keterangan };
  }

  function pohonContoh(nomor, nama, namaLatin, usia, tingkat, liter, pangkas, kesehatan, status, x, y, lokasiTipe, daftarRiwayat) {
    return {
      id: 'PH-YOG-' + String(nomor).padStart(3, '0'),
      nama,
      namaLatin,
      taman: NAMA_TAMAN,
      x,
      y,
      lokasiTipe: lokasiTipe === 'jalan' ? 'jalan' : 'taman',
      usia,
      resapanAir: { tingkat, liter },
      jadwalPangkas: pangkas,
      kesehatan,
      status,
      riwayat: daftarRiwayat
    };
  }

  function laporanContoh(id, idPohon, deskripsi, foto, waktu, tahap, subTahap, tim) {
    return { id, idPohon, deskripsi, foto, waktu, tahap, subTahap: subTahap || null, tim: tim || null };
  }

  function dataAwal() {
    // 8 pohon di dalam area taman, 5 pohon di jalan sekeliling taman.
    // Posisi x/y adalah persentase terhadap area peta (lihat posisiPin di dashboard.js).
    const pohon = [
      pohonContoh(1, 'Trembesi', 'Samanea saman', 25, 'Tinggi', 200, '2026-12-03', 92, 'aman', 52.16, 42.71, 'taman', [
        riwayat('2025-09-12', 'Pemangkasan rutin', 'Dahan bagian utara dipangkas agar tidak menutupi lampu jalan.')
      ]),
      pohonContoh(2, 'Beringin', 'Ficus benjamina', 18, 'Sedang', 90, '2026-11-20', 81, 'aman', 57.33, 43.75, 'taman', [
        riwayat('2026-02-20', 'Pemeriksaan kesehatan', 'Batang dan tajuk diperiksa, kondisi pohon stabil.')
      ]),
      pohonContoh(3, 'Angsana', 'Pterocarpus indicus', 12, 'Sedang', 80, '2026-11-15', 68, 'perhatian', 62.93, 43.06, 'taman', [
        riwayat('2026-05-14', 'Penyiraman dan pemupukan', 'Pupuk organik ditambahkan di sekitar area akar.')
      ]),
      pohonContoh(4, 'Tanjung', 'Mimusops elengi', 9, 'Rendah', 45, '2026-12-10', 88, 'aman', 44.61, 51.74, 'jalan', [
        riwayat('2025-11-08', 'Pemangkasan bentuk', 'Tajuk dirapikan agar pertumbuhan cabang lebih seimbang.')
      ]),
      pohonContoh(5, 'Beringin', 'Ficus benjamina', 30, 'Tinggi', 180, '2026-11-13', 42, 'kritis', 51.72, 53.47, 'taman', [
        riwayat('2026-04-22', 'Pemeriksaan batang', 'Ditemukan rongga pada batang utama, perlu pemantauan intensif.')
      ]),
      pohonContoh(6, 'Flamboyan', 'Delonix regia', 14, 'Sedang', 70, '2026-12-01', 84, 'aman', 57.76, 52.78, 'taman', [
        riwayat('2025-12-03', 'Pemangkasan rutin', 'Cabang yang terlalu rapat dipangkas untuk sirkulasi cahaya.')
      ]),
      pohonContoh(7, 'Ketapang', 'Terminalia catappa', 16, 'Sedang', 95, '2026-11-18', 63, 'perhatian', 63.36, 53.82, 'taman', [
        riwayat('2026-01-19', 'Penanganan dahan patah', 'Dahan patah akibat angin dibersihkan dari area pejalan kaki.')
      ]),
      pohonContoh(8, 'Glodokan tiang', 'Polyalthia longifolia', 8, 'Rendah', 40, '2027-01-08', 90, 'aman', 56.47, 30.90, 'jalan', [
        riwayat('2025-10-27', 'Pemangkasan bentuk', 'Tajuk dirapikan agar tetap ramping dan tidak menghalangi pandangan.')
      ]),
      pohonContoh(9, 'Mahoni', 'Swietenia mahagoni', 20, 'Tinggi', 165, '2026-12-15', 58, 'kritis', 70.47, 31.25, 'jalan', [
        riwayat('2026-06-05', 'Pemeriksaan kesehatan', 'Tingkat kesehatan menurun, perlu pemeriksaan lanjutan.')
      ]),
      pohonContoh(10, 'Trembesi', 'Samanea saman', 22, 'Tinggi', 190, '2026-11-11', 71, 'dikerjakan', 68.97, 44.10, 'taman', [
        riwayat('2026-11-10', 'Pemangkasan dahan', 'Pengerjaan dimulai untuk mengurangi beban dahan bagian timur.')
      ]),
      pohonContoh(11, 'Palem raja', 'Roystonea regia', 11, 'Rendah', 35, '2027-01-05', 86, 'aman', 76.94, 46.53, 'jalan', [
        riwayat('2025-08-30', 'Perawatan rutin', 'Daun kering dibersihkan dan pelepah dirapikan.')
      ]),
      pohonContoh(12, 'Asam jawa', 'Tamarindus indica', 19, 'Sedang', 85, '2026-12-08', 66, 'perhatian', 60.99, 62.15, 'jalan', [
        riwayat('2026-03-17', 'Pemupukan', 'Pupuk kandang ditambahkan untuk memperbaiki kesuburan tanah.')
      ]),
      pohonContoh(42, 'Mahoni', 'Swietenia mahagoni', 15, 'Tinggi', 150, '2026-11-12', 75, 'aman', 69.61, 53.13, 'taman', [
        riwayat('2026-03-02', 'Penyiangan dan pemupukan', 'Area akar dibersihkan dan diberi pupuk organik.'),
        riwayat('2025-06-18', 'Pemangkasan ringan', 'Dahan bagian barat dipangkas agar tidak mengenai kabel listrik.')
      ])
    ];

    const laporan = [
      laporanContoh(
        'LAP-001',
        'PH-YOG-003',
        'Akar pohon mengangkat trotoar di depan toko dan mulai membentuk celah yang cukup dalam. Mohon diperiksa sebelum ada warga yang tersandung.',
        fotoContoh('#2D5A27', 'Foto contoh: akar trotoar'),
        waktuLalu(18),
        1
      ),
      laporanContoh(
        'LAP-002',
        'PH-YOG-005',
        'Ada dahan besar yang miring ke arah jalan dan terlihat lapuk. Saat hujan angin kemarin, beberapa ranting kecil patah dan jatuh ke trotoar.',
        fotoContoh('#9B1C1C', 'Foto contoh: dahan lapuk'),
        waktuLalu(125),
        2
      ),
      laporanContoh(
        'LAP-003',
        'PH-YOG-007',
        'Batang pohon berlubang dan mengeluarkan bau tidak sedap. Saya khawatir pohon mudah tumbang karena bagian dalamnya keropos.',
        fotoContoh('#7A4B00', 'Foto contoh: batang berlubang'),
        waktuLalu(310),
        3,
        null,
        'Tim Pemangkasan B'
      ),
      laporanContoh(
        'LAP-004',
        'PH-YOG-010',
        'Pohon ini sedang dipangkas dan beberapa dahan sudah dibuang. Mohon pastikan area sekitar dibersihkan setelah pengerjaan selesai.',
        fotoContoh('#1F4E79', 'Foto contoh: pemangkasan'),
        waktuLalu(1450),
        4,
        'Pengerjaan',
        'Tim Pemangkasan A'
      )
    ];

    return { versi: DATA_VERSION, pohon, laporan };
  }

  // ---------------------------------------------------------------------------
  // Penyimpanan lokal
  // ---------------------------------------------------------------------------

  let cadanganMemori = null;
  let statusPenyimpanan = null;

  function dataValid(data) {
    return Boolean(data) && Array.isArray(data.pohon) && Array.isArray(data.laporan);
  }

  function penyimpananTersedia() {
    if (statusPenyimpanan !== null) return statusPenyimpanan;
    try {
      const uji = '__sipohon_uji_penyimpanan__';
      window.localStorage.setItem(uji, '1');
      window.localStorage.removeItem(uji);
      statusPenyimpanan = true;
    } catch (err) {
      // Kuota penuh tetap dianggap tersedia agar pesan error penyimpanan muncul saat menyimpan.
      const penuh = err && (err.name === 'QuotaExceededError' || err.code === 22);
      statusPenyimpanan = penuh;
    }
    return statusPenyimpanan;
  }

  function bacaData() {
    if (!penyimpananTersedia()) {
      return cadanganMemori ? salin(cadanganMemori) : null;
    }
    try {
      const teks = window.localStorage.getItem(KUNCI);
      if (!teks) return null;
      const data = JSON.parse(teks);
      return dataValid(data) && data.versi === DATA_VERSION ? data : null;
    } catch (err) {
      return null;
    }
  }

  function muatData() {
    const data = bacaData();
    if (data) return data;
    const awal = dataAwal();
    simpanData(awal);
    return awal;
  }

  function simpanData(data) {
    if (!dataValid(data)) return gagal('Struktur data tidak valid.');
    if (!penyimpananTersedia()) {
      cadanganMemori = salin(data);
      return { ok: true, sementara: true };
    }
    try {
      window.localStorage.setItem(KUNCI, JSON.stringify(data));
      cadanganMemori = null;
      return { ok: true, sementara: false };
    } catch (err) {
      const penuh = err && (err.name === 'QuotaExceededError' || err.code === 22);
      return gagal(penuh
        ? 'Penyimpanan browser penuh. Reset data demo atau gunakan foto yang lebih kecil.'
        : 'Data gagal disimpan ke localStorage.');
    }
  }

  function resetData() {
    const awal = dataAwal();
    const hasil = simpanData(awal);
    return { ok: hasil.ok, pesan: hasil.pesan, sementara: hasil.sementara, data: awal };
  }

  function simpanPerubahan(data, hasil) {
    const simpan = simpanData(data);
    if (!simpan.ok) return gagal(simpan.pesan);
    return Object.assign({ ok: true, sementara: simpan.sementara }, hasil || {});
  }

  // ---------------------------------------------------------------------------
  // Pembacaan data
  // ---------------------------------------------------------------------------

  function getSemuaPohon() {
    return muatData().pohon.slice().sort((a, b) => a.id.localeCompare(b.id));
  }

  function getPohon(id) {
    const kode = String(id || '').trim().toUpperCase();
    return muatData().pohon.find((pohon) => pohon.id === kode) || null;
  }

  function getSemuaLaporan() {
    return muatData().laporan
      .slice()
      .sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
  }

  function getLaporan(id) {
    return muatData().laporan.find((laporan) => laporan.id === id) || null;
  }

  function laporanUntukPohon(idPohon) {
    return getSemuaLaporan().filter((laporan) => laporan.idPohon === idPohon);
  }

  function laporanBerjalan(idPohon) {
    return laporanUntukPohon(idPohon).find((laporan) => laporan.tahap < 5) || null;
  }

  function hitungMetrik() {
    const data = muatData();
    const jumlah = (status) => data.pohon.filter((pohon) => pohon.status === status).length;
    return {
      totalPohon: data.pohon.length,
      aman: jumlah(STATUS.AMAN),
      perhatian: jumlah(STATUS.PERHATIAN),
      kritis: jumlah(STATUS.KRITIS),
      dikerjakan: jumlah(STATUS.DIKERJAKAN),
      laporanBaru: data.laporan.filter((laporan) => laporan.tahap === 1).length,
      laporanBerjalan: data.laporan.filter((laporan) => laporan.tahap < 5).length
    };
  }

  function kodePohonBerikutnyaDari(data) {
    const nomor = data.pohon
      .map((pohon) => parseInt(String(pohon.id).replace('PH-YOG-', ''), 10))
      .filter((angka) => Number.isFinite(angka));
    const berikutnya = (nomor.length ? Math.max.apply(null, nomor) : 0) + 1;
    return 'PH-YOG-' + String(berikutnya).padStart(3, '0');
  }

  function kodePohonBerikutnya() {
    return kodePohonBerikutnyaDari(muatData());
  }

  function idLaporanBerikutnya(data) {
    const nomor = data.laporan
      .map((laporan) => parseInt(String(laporan.id).replace(/\D/g, ''), 10))
      .filter((angka) => Number.isFinite(angka));
    const berikutnya = (nomor.length ? Math.max.apply(null, nomor) : 0) + 1;
    return 'LAP-' + String(berikutnya).padStart(3, '0');
  }

  // ---------------------------------------------------------------------------
  // Laporan warga
  // ---------------------------------------------------------------------------

  function tambahLaporan(masukan) {
    const data = muatData();
    const sumber = masukan || {};
    const idPohon = String(sumber.idPohon || '').trim().toUpperCase();
    const pohon = data.pohon.find((item) => item.id === idPohon);
    if (!pohon) return gagal('Pohon tidak ditemukan.');
    const deskripsi = String(sumber.deskripsi || '').trim();
    if (deskripsi.length < 10) return gagal('Deskripsi minimal 10 karakter.');
    if (deskripsi.length > 500) return gagal('Deskripsi maksimal 500 karakter.');
    const foto = String(sumber.foto || '');
    if (!/^data:image\//i.test(foto)) return gagal('Foto laporan wajib diunggah.');
    if (foto.length > 8 * 1024 * 1024) return gagal('Ukuran foto terlalu besar.');

    const laporan = {
      id: idLaporanBerikutnya(data),
      idPohon,
      deskripsi,
      foto,
      waktu: new Date().toISOString(),
      tahap: 1,
      subTahap: null,
      tim: null
    };
    data.laporan.push(laporan);
    if (pohon.status === STATUS.AMAN) pohon.status = STATUS.PERHATIAN;
    return simpanPerubahan(data, { laporan });
  }

  function ubahTahapLaporan(idLaporan, tahapBaru, pilihan) {
    const opsi = pilihan || {};
    const data = muatData();
    const laporan = data.laporan.find((item) => item.id === idLaporan);
    if (!laporan) return gagal('Laporan tidak ditemukan.');

    const tahap = Number(tahapBaru);
    if (!Number.isInteger(tahap) || tahap !== laporan.tahap + 1) {
      return gagal('Tahap laporan harus dilanjutkan secara berurutan.');
    }

    const pohon = data.pohon.find((item) => item.id === laporan.idPohon);
    if (!pohon) return gagal('Pohon untuk laporan ini tidak ditemukan.');

    if (tahap === 2 || tahap === 3) {
      if (pohon.status === STATUS.AMAN) pohon.status = STATUS.PERHATIAN;
    }
    if (tahap === 3) {
      const tim = String(opsi.tim || '').trim();
      if (!tim) return gagal('Pilih tim lapangan terlebih dahulu.');
      laporan.tim = tim;
    }
    if (tahap === 4) {
      const sub = String(opsi.subTahap || '').trim();
      if (!SUB_TAHAP.includes(sub)) return gagal('Pilih sub-tahap pengerjaan.');
      laporan.subTahap = sub;
      pohon.status = STATUS.DIKERJAKAN;
    }
    laporan.tahap = tahap;

    if (tahap === 5) {
      laporan.subTahap = null;
      const laporanLain = data.laporan.find(
        (item) => item.idPohon === pohon.id && item.id !== laporan.id && item.tahap < 5
      );
      pohon.status = laporanLain
        ? (laporanLain.tahap === 4 ? STATUS.DIKERJAKAN : STATUS.PERHATIAN)
        : STATUS.AMAN;
      pohon.riwayat.unshift({
        tanggal: tanggalHariIni(),
        judul: 'Perawatan selesai',
        keterangan: 'Laporan ' + laporan.id + ' ditutup' +
          (laporan.tim ? ' oleh ' + laporan.tim : '') + ' setelah perawatan selesai.'
      });
    }

    return simpanPerubahan(data, { laporan, pohon });
  }

  // ---------------------------------------------------------------------------
  // Kelola data pohon
  // ---------------------------------------------------------------------------

  function normalisasiPohon(masukan, lama) {
    const sumber = Object.assign({}, lama || {}, masukan || {});
    const nama = String(sumber.nama || '').trim();
    if (!nama) return gagal('Nama pohon wajib diisi.');
    const taman = String(sumber.taman || '').trim();
    if (!taman) return gagal('Nama taman wajib diisi.');

    const kesehatan = Number(sumber.kesehatan);
    if (!Number.isFinite(kesehatan) || kesehatan < 0 || kesehatan > 100) {
      return gagal('Tingkat kesehatan harus berupa angka 0 sampai 100.');
    }
    const usia = Number(sumber.usia);
    if (!Number.isFinite(usia) || usia < 0) return gagal('Estimasi usia tidak valid.');

    const resapan = sumber.resapanAir || {};
    const tingkat = ['Tinggi', 'Sedang', 'Rendah'].includes(resapan.tingkat)
      ? resapan.tingkat
      : 'Sedang';
    const liter = Number(resapan.liter);

    return {
      ok: true,
      nilai: {
        nama,
        namaLatin: String(sumber.namaLatin || '').trim(),
        taman,
        x: batasAngka(sumber.x, 0, 100, 50),
        y: batasAngka(sumber.y, 0, 100, 50),
        lokasiTipe: ['taman', 'jalan'].includes(sumber.lokasiTipe) ? sumber.lokasiTipe : 'taman',
        usia,
        resapanAir: {
          tingkat,
          liter: Number.isFinite(liter) && liter >= 0 ? liter : 0
        },
        jadwalPangkas: String(sumber.jadwalPangkas || ''),
        kesehatan: Math.round(kesehatan),
        status: Object.values(STATUS).includes(sumber.status) ? sumber.status : STATUS.AMAN
      }
    };
  }

  function tambahPohon(masukan) {
    const data = muatData();
    const cek = normalisasiPohon(masukan);
    if (!cek.ok) return cek;
    const pohon = Object.assign(
      { id: kodePohonBerikutnyaDari(data), riwayat: [] },
      cek.nilai
    );
    data.pohon.push(pohon);
    return simpanPerubahan(data, { pohon });
  }

  function ubahPohon(id, perubahan) {
    const data = muatData();
    const pohon = data.pohon.find((item) => item.id === id);
    if (!pohon) return gagal('Pohon tidak ditemukan.');
    const cek = normalisasiPohon(perubahan, pohon);
    if (!cek.ok) return cek;
    Object.assign(pohon, cek.nilai);
    return simpanPerubahan(data, { pohon });
  }

  function hapusPohon(id) {
    const data = muatData();
    const indeks = data.pohon.findIndex((pohon) => pohon.id === id);
    if (indeks === -1) return gagal('Pohon tidak ditemukan.');
    const pohon = data.pohon.splice(indeks, 1)[0];
    const sebelum = data.laporan.length;
    data.laporan = data.laporan.filter((laporan) => laporan.idPohon !== id);
    return simpanPerubahan(data, {
      pohon,
      laporanDihapus: sebelum - data.laporan.length
    });
  }

  // ---------------------------------------------------------------------------
  // Utilitas tanggal dan label
  // ---------------------------------------------------------------------------

  const HARI = Object.freeze(['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
  const BULAN = Object.freeze([
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]);

  function keTanggal(nilai) {
    if (nilai instanceof Date) return nilai;
    if (typeof nilai === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(nilai)) {
      const bagian = nilai.split('-').map(Number);
      return new Date(bagian[0], bagian[1] - 1, bagian[2]);
    }
    return new Date(nilai);
  }

  function formatTanggalIndonesia(nilai, sertakanHari) {
    const tanggal = keTanggal(nilai);
    if (isNaN(tanggal.getTime())) return '-';
    const teks = tanggal.getDate() + ' ' + BULAN[tanggal.getMonth()] + ' ' + tanggal.getFullYear();
    return sertakanHari ? HARI[tanggal.getDay()] + ', ' + teks : teks;
  }

  function formatTanggalLengkapWIB(nilai) {
    const tanggal = keTanggal(nilai);
    if (isNaN(tanggal.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(tanggal);
  }

  function formatJamWIB(nilai) {
    const tanggal = keTanggal(nilai);
    if (isNaN(tanggal.getTime())) return '-';
    const teks = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).format(tanggal);
    return teks.replace(/:/g, '.').trim() + ' WIB';
  }

  function waktuRelatif(nilai) {
    const tanggal = keTanggal(nilai);
    if (isNaN(tanggal.getTime())) return '-';
    const menit = Math.floor((Date.now() - tanggal.getTime()) / 60000);
    if (menit < 1) return 'baru saja';
    if (menit < 60) return menit + ' menit lalu';
    const jam = Math.floor(menit / 60);
    if (jam < 24) return jam + ' jam lalu';
    const hari = Math.floor(jam / 24);
    if (hari < 30) return hari + ' hari lalu';
    return formatTanggalIndonesia(tanggal);
  }

  function labelTahap(tahap) {
    return LABEL_TAHAP[tahap - 1] || '-';
  }

  function labelTahapLengkap(tahap, subTahap) {
    const dasar = labelTahap(tahap);
    return tahap === 4 && subTahap ? dasar + ' — ' + subTahap : dasar;
  }

  function perkiraanSelesai(laporan) {
    if (!laporan) return '-';
    if (laporan.tahap >= 5) return 'Selesai';
    // Dari RPC progres_pohon: tanggal sudah dihitung database.
    if (laporan.perkiraanSelesai) {
      const dariServer = formatTanggalIndonesia(laporan.perkiraanSelesai);
      if (dariServer !== '-') return dariServer;
    }
    const dasar = new Date(laporan.waktu);
    if (isNaN(dasar.getTime())) return '-';
    const tambahanHari = { 1: 5, 2: 4, 3: 3, 4: 1 }[laporan.tahap] || 1;
    dasar.setDate(dasar.getDate() + tambahanHari);
    const besok = Date.now() + 24 * 60 * 60 * 1000;
    if (dasar.getTime() < besok) dasar.setTime(besok);
    return formatTanggalIndonesia(dasar);
  }

  // ---------------------------------------------------------------------------
  // Supabase: pembacaan data pohon untuk halaman publik
  // ---------------------------------------------------------------------------

  let klienSupabase = null;

  function teksAman(nilai) {
    return nilai === null || nilai === undefined ? '' : String(nilai);
  }

  function hurufAwalBesar(nilai) {
    const teks = teksAman(nilai).trim();
    return teks ? teks.charAt(0).toUpperCase() + teks.slice(1) : '';
  }

  // Error membawa kode agar halaman bisa membedakan "tidak ditemukan" dan jaringan.
  function kesalahanData(pesan, kode) {
    const kesalahan = new Error(pesan);
    kesalahan.kode = kode;
    kesalahan.pesan = pesan;
    return kesalahan;
  }

  function klasifikasiGagal(kesalahan) {
    const asli = kesalahan || {};
    const kode = String(asli.code || '');
    const pesanAsli = teksAman(asli.message || asli.pesan || asli);

    if (kode === 'PGRST116') {
      return kesalahanData('Pohon tidak ditemukan.', 'tidak-ditemukan');
    }
    const jaringan = asli instanceof TypeError ||
      /failed to fetch|networkerror|network request failed|load failed|timeout|timed out|econn|offline|connection/i.test(pesanAsli);
    if (jaringan) {
      return kesalahanData(
        'Koneksi internet sedang bermasalah. Periksa jaringan lalu muat ulang halaman.',
        'jaringan'
      );
    }
    if (kode === '42501' || /permission denied|row level security/i.test(pesanAsli)) {
      return kesalahanData('Data pohon belum dapat diakses. Hubungi petugas DLH.', 'database');
    }
    return kesalahanData('Data pohon gagal dimuat. Silakan coba lagi beberapa saat.', 'database');
  }

  function ambilKlienSupabase() {
    if (klienSupabase) return klienSupabase;
    const konfigurasi = window.SUPABASE_CONFIG;
    if (!window.supabase || !konfigurasi || !konfigurasi.url || !konfigurasi.publishableKey) {
      throw kesalahanData('Konfigurasi Supabase belum tersedia.', 'konfigurasi');
    }
    klienSupabase = window.supabase.createClient(konfigurasi.url, konfigurasi.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    return klienSupabase;
  }

  function petaJenisServer(baris) {
    const jenis = baris || {};
    return {
      id: jenis.id || null,
      nama: teksAman(jenis.nama),
      namaLatin: teksAman(jenis.nama_latin),
      asal: teksAman(jenis.asal),
      ciri: teksAman(jenis.ciri),
      kegunaan: teksAman(jenis.kegunaan),
      perawatan: teksAman(jenis.perawatan),
      manfaatLingkungan: teksAman(jenis.manfaat_lingkungan),
      bentukTajuk: teksAman(jenis.bentuk_tajuk)
    };
  }

  function petaRiwayatServer(baris) {
    return {
      tanggal: baris.tanggal,
      judul: teksAman(baris.jenis_pekerjaan) || 'Pemeliharaan pohon',
      keterangan: teksAman(baris.keterangan),
      oleh: teksAman(baris.oleh),
      sumber: teksAman(baris.sumber),
      jenisPekerjaan: teksAman(baris.jenis_pekerjaan),
      laporanId: baris.laporan_id || null
    };
  }

  function petaProgresServer(baris) {
    if (!baris || typeof baris !== 'object') return null;
    return {
      tahap: Math.min(5, Math.max(1, Number(baris.tahap) || 1)),
      subTahap: teksAman(baris.sub_tahap),
      perkiraanSelesai: teksAman(baris.perkiraan_selesai),
      diperbaruiPada: teksAman(baris.diperbarui_pada)
    };
  }

  function petaPohonServer(baris, daftarRiwayat, progres) {
    const jenisBaris = Array.isArray(baris.jenis_pohon)
      ? baris.jenis_pohon[0]
      : baris.jenis_pohon;
    const jenis = petaJenisServer(jenisBaris);

    return {
      id: teksAman(baris.id),
      nama: jenis.nama || 'Pohon',
      namaLatin: jenis.namaLatin,
      jenis,
      jenisId: baris.jenis_id || null,
      kawasan: teksAman(baris.kawasan),
      lokasiTipe: teksAman(baris.lokasi_tipe) || 'taman',
      lat: Number(baris.lat),
      lng: Number(baris.lng),
      usia: Number(baris.usia) || 0,
      resapanAir: {
        tingkat: hurufAwalBesar(baris.resapan_tingkat),
        liter: Number(baris.resapan_liter) || 0
      },
      jadwalPangkas: teksAman(baris.jadwal_pangkas),
      kesehatan: Number(baris.kesehatan) || 0,
      status: teksAman(baris.status) || STATUS.AMAN,
      riwayat: daftarRiwayat.map(petaRiwayatServer),
      progres: petaProgresServer(progres)
    };
  }

  async function muatRiwayatServer(klien, kode) {
    const hasil = await klien
      .from('riwayat_pohon')
      .select('tanggal, keterangan, oleh, jenis_pekerjaan, sumber, laporan_id')
      .eq('pohon_id', kode)
      .order('tanggal', { ascending: false });
    if (hasil.error) throw hasil.error;
    return Array.isArray(hasil.data) ? hasil.data : [];
  }

  async function muatProgresServer(klien, kode) {
    // Penanda progres bersifat tambahan: RPC gagal tidak menghalangi info pohon.
    try {
      const hasil = await klien.rpc('progres_pohon', { p_pohon_id: kode });
      return hasil.error ? null : hasil.data;
    } catch (kesalahan) {
      return null;
    }
  }

  async function muatPohonServer(id) {
    const kode = teksAman(id).trim().toUpperCase();
    if (!kode) throw kesalahanData('Pohon tidak ditemukan.', 'tidak-ditemukan');

    try {
      const klien = ambilKlienSupabase();
      const hasil = await klien
        .from('pohon')
        .select(
          'id, jenis_id, kawasan, lokasi_tipe, lat, lng, usia, resapan_tingkat, ' +
          'resapan_liter, jadwal_pangkas, kesehatan, status, ' +
          'jenis_pohon(id, nama, nama_latin, asal, ciri, kegunaan, perawatan, manfaat_lingkungan, bentuk_tajuk)'
        )
        .eq('id', kode)
        .maybeSingle();

      if (hasil.error) {
        if (String(hasil.error.code) === 'PGRST116') {
          throw kesalahanData('Pohon tidak ditemukan.', 'tidak-ditemukan');
        }
        throw hasil.error;
      }
      if (!hasil.data) throw kesalahanData('Pohon tidak ditemukan.', 'tidak-ditemukan');

      const [riwayat, progres] = await Promise.all([
        muatRiwayatServer(klien, kode),
        muatProgresServer(klien, kode)
      ]);
      return petaPohonServer(hasil.data, riwayat, progres);
    } catch (kesalahan) {
      if (kesalahan && kesalahan.kode) throw kesalahan;
      throw klasifikasiGagal(kesalahan);
    }
  }

  // ---------------------------------------------------------------------------
  // API publik
  // ---------------------------------------------------------------------------

  window.SIPohon = Object.freeze({
    KUNCI,
    DATA_VERSION,
    NAMA_TAMAN,
    STATUS,
    LABEL_STATUS,
    LABEL_TAHAP,
    LABEL_PROGRES,
    SUB_TAHAP,
    TIM,
    dataAwal,
    muatData,
    simpanData,
    resetData,
    penyimpananTersedia,
    getSemuaPohon,
    getPohon,
    muatPohonServer,
    getSemuaLaporan,
    getLaporan,
    laporanUntukPohon,
    laporanBerjalan,
    hitungMetrik,
    kodePohonBerikutnya,
    tambahLaporan,
    ubahTahapLaporan,
    tambahPohon,
    ubahPohon,
    hapusPohon,
    formatTanggalIndonesia,
    formatTanggalLengkapWIB,
    formatJamWIB,
    waktuRelatif,
    labelTahap,
    labelTahapLengkap,
    perkiraanSelesai
  });
})();
