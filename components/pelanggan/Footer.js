import Link from "next/link";
import { Wrench, Phone, Mail, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PelangganFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-16 md:pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">
                Booking Teknisi Lokal
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Platform pemesanan jasa teknisi panggilan terpercaya di area Kota Malang dan sekitarnya. Cepat, transparan, dan bergaransi resmi.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Mitra Teknisi Terseleksi & Berpengalaman</span>
            </div>
          </div>

          {/* Col 2: Kategori Layanan */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Kategori Jasa
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>Teknisi Komputer & Rakit PC</li>
              <li>Teknisi Laptop & Ganti LCD</li>
              <li>Teknisi Printer Inkjet & Laser</li>
              <li>Teknisi Jaringan & Instalasi Wi-Fi</li>
              <li>Teknisi Elektronik & Audio</li>
            </ul>
          </div>

          {/* Col 3: Wilayah Jangkauan */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Area Layanan Panggilan
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Kecamatan Klojen, Kota Malang</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Kecamatan Lowokwaru, Kota Malang</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Kecamatan Blimbing, Kota Malang</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Kecamatan Sukun, Kota Malang</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Kecamatan Kedungkandang, Kota Malang</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Portal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Kontak & Bantuan
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: 0812-3456-7890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>cs@bookingteknisi.id</span>
              </p>
              <p className="text-slate-500 pt-1">
                Jam Operasional: Setiap Hari (08:00 - 20:00 WIB)
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <Link
                href="/teknisi/login"
                className="block text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <span>Portal Mitra Teknisi &rarr;</span>
              </Link>
              <Link
                href="/admin/login"
                className="block text-[11px] text-blue-400 hover:text-blue-300 font-medium"
              >
                <span>Portal Administrator &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>&copy; 2025 Booking Teknisi Lokal. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400">Beranda</Link>
            <Link href="/booking" className="hover:text-slate-400">Form Booking</Link>
            <Link href="/riwayat-booking" className="hover:text-slate-400">Riwayat Pesanan</Link>
            <Link href="/admin/login" className="hover:text-slate-400">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
