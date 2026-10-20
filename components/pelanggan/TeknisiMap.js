"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Crosshair,
  Wrench,
  Star,
  ArrowRight,
  ShieldCheck,
  Phone,
  Navigation,
} from "lucide-react";

// Rumus Haversine untuk menghitung jarak antara 2 titik koordinat (dalam km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function TeknisiMap({
  technicians = [],
  customerLocation,
  onCustomerLocationChange,
  selectedTechId,
  onSelectTech,
}) {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const customerMarkerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Inisialisasi peta Leaflet
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Load leaflet dinamis
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Hapus map lama jika ada
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Pastikan CSS Leaflet sudah dimuat di document head
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const initialLat = customerLocation?.lat || -5.147665;
      const initialLng = customerLocation?.lng || 119.432731;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      // Tambahkan tile OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Event klik pada peta untuk mengubah lokasi pelanggan
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (onCustomerLocationChange) {
          onCustomerLocationChange({
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            address: "Titik Lokasi Pilihan Anda",
          });
        }
      });

      setIsMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker lokasi pelanggan
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (customerLocation?.lat && customerLocation?.lng) {
        const custLat = Number(customerLocation.lat);
        const custLng = Number(customerLocation.lng);

        const customerIcon = L.divIcon({
          className: "custom-customer-marker",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #2563eb; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 3px solid white;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        if (customerMarkerRef.current) {
          customerMarkerRef.current.setLatLng([custLat, custLng]);
        } else {
          customerMarkerRef.current = L.marker([custLat, custLng], {
            icon: customerIcon,
            zIndexOffset: 1000,
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: inherit; font-size: 12px; padding: 2px;">
                <strong style="color: #1e3a8a; display: block; font-size: 13px;">📍 Lokasi Anda</strong>
                <span style="color: #64748b; font-size: 11px;">${customerLocation.address || "Titik acuan pencarian teknisi"}</span>
              </div>
            `);
        }
      }
    });
  }, [customerLocation, isMapLoaded]);

  // Update marker untuk teknisi
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Hapus marker lama
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      technicians.forEach((tech) => {
        if (!tech.latitude || !tech.longitude) return;

        const lat = Number(tech.latitude);
        const lng = Number(tech.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const distance = customerLocation
          ? calculateDistance(customerLocation.lat, customerLocation.lng, lat, lng)
          : null;

        const isSelected = selectedTechId && String(selectedTechId) === String(tech.id);

        const techIcon = L.divIcon({
          className: "custom-tech-marker",
          html: `
            <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: scale(${isSelected ? 1.15 : 1}); transition: transform 0.2s;">
              <div style="background-color: ${isSelected ? "#1d4ed8" : "#0f172a"}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 2px; border: 1.5px solid white; display: flex; align-items: center; gap: 4px;">
                <span>${tech.nama ? tech.nama.split(" ")[0] : "Teknisi"}</span>
                ${distance !== null ? `<span style="background-color: #3b82f6; padding: 1px 4px; border-radius: 6px; font-size: 9px;">${distance} km</span>` : ""}
              </div>
              <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: ${isSelected ? "#2563eb" : "#2563eb"}; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 12px -2px rgba(0,0,0,0.3); color: white;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
        });

        const marker = L.marker([lat, lng], { icon: techIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 190px; padding: 4px 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #16a34a; background: #f0fdf4; padding: 2px 6px; border-radius: 6px; border: 1px solid #bbf7d0;">
                ● ${tech.status_ketersediaan === "tersedia" ? "Siaga Kunjungan" : tech.status_ketersediaan}
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #d97706; display: flex; align-items: center;">
                ★ ${tech.rating || "4.8"}
              </span>
            </div>
            <strong style="color: #0f172a; font-size: 13px; display: block; margin-bottom: 2px;">
              ${tech.nama}
            </strong>
            <p style="color: #64748b; font-size: 11px; margin: 0 0 6px 0;">
              📍 ${tech.alamat || "Kota Makassar"}
            </p>
            ${
              distance !== null
                ? `<p style="font-size: 11px; color: #2563eb; font-weight: 600; margin: 0 0 8px 0;">
                     📏 Jarak: ~${distance} km dari lokasi Anda
                   </p>`
                : ""
            }
            <a 
              href="/pelanggan/booking?techId=${tech.id}"
              style="display: block; text-align: center; background-color: #2563eb; color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;"
            >
              Pesan Teknisi Ini &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          if (onSelectTech) onSelectTech(tech);
        });

        markersRef.current[tech.id] = marker;

        if (isSelected) {
          marker.openPopup();
        }
      });
    });
  }, [technicians, customerLocation, selectedTechId, isMapLoaded, onSelectTech]);

  // Center map ketika selectedTechId berubah
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !selectedTechId) return;
    const targetMarker = markersRef.current[selectedTechId];
    if (targetMarker) {
      const latLng = targetMarker.getLatLng();
      mapInstanceRef.current.setView(latLng, 14, { animate: true });
      targetMarker.openPopup();
    }
  }, [selectedTechId, isMapLoaded]);

  // Fungsi geolokasi browser pengguna
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6)),
          address: "Lokasi GPS Terdeteksi",
        };

        if (onCustomerLocationChange) onCustomerLocationChange(newLoc);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLoc.lat, newLoc.lng], 14, {
            animate: true,
          });
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation warning:", err);
        // Fallback ke Makassar Kota jika permission denied
        const defaultLoc = {
          lat: -5.147665,
          lng: 119.432731,
          address: "Panakkukang, Kota Makassar (Default)",
        };
        if (onCustomerLocationChange) onCustomerLocationChange(defaultLoc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([defaultLoc.lat, defaultLoc.lng], 13);
        }
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      {/* Container Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

      {/* Kontrol Lokasi Saya (Floating Button) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="px-3 py-2 bg-white text-slate-800 hover:text-blue-600 rounded-lg shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Gunakan lokasi saya saat ini"
        >
          <Crosshair className={`w-4 h-4 text-blue-600 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Mencari Lokasi..." : "Lokasi Saya"}</span>
        </button>
      </div>

      {/* Petunjuk Interaktif di Sudut Bawah Peta */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-lg shadow-xs border border-slate-200 text-[11px] text-slate-600">
        <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Klik di peta untuk memindahkan titik lokasi Anda</span>
      </div>
    </div>
  );
}
