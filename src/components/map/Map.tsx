'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Marker {
  position: [number, number]
  title: string
  description: string
}

interface MapProps {
  center: [number, number]
  zoom: number
  markers?: Marker[]
}

export default function Map({ center, zoom, markers = [] }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach((marker) => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="w-4 h-4 bg-red-600 rounded-full"></div>
            <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const newMarker = L.marker(marker.position, { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${marker.title}</h3>
            <p class="text-sm text-gray-600">${marker.description}</p>
          </div>
        `)

      markersRef.current.push(newMarker)
    })

    // Update map center
    mapRef.current.setView(center, zoom)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, zoom, markers])

  return <div id="map" className="w-full h-full" />
} 