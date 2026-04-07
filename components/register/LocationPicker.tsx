'use client'

import { useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  CircleMarker,
  useMapEvents,
} from 'react-leaflet'
import {
  MAP_CENTER,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from '@/config/constants'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'
import { MapPin, Pentagon, Undo2, CheckCircle2, Trash2 } from 'lucide-react'

/* Fix default marker icon for webpack/next */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

type DrawMode = 'pin' | 'polygon'

/* ------------------------------------------------------------------ */
/*  Click handler for pin mode                                         */
/* ------------------------------------------------------------------ */
function PinClickHandler({
  onPinDrop,
}: {
  onPinDrop: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onPinDrop(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/* ------------------------------------------------------------------ */
/*  Click handler for polygon mode                                     */
/* ------------------------------------------------------------------ */
function PolygonClickHandler({
  onAddVertex,
}: {
  onAddVertex: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onAddVertex(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
interface LocationPickerProps {
  lat: number | null
  lng: number | null
  onLocationChange: (lat: number, lng: number) => void
  polygonCoords: [number, number][]
  onPolygonChange: (coords: [number, number][]) => void
  polygonComplete: boolean
  onPolygonComplete: (complete: boolean) => void
}

export default function LocationPicker({
  lat,
  lng,
  onLocationChange,
  polygonCoords,
  onPolygonChange,
  polygonComplete,
  onPolygonComplete,
}: LocationPickerProps) {
  const [mode, setMode] = useState<DrawMode>('pin')

  const handlePinDrop = useCallback(
    (newLat: number, newLng: number) => {
      onLocationChange(newLat, newLng)
    },
    [onLocationChange]
  )

  const handleAddVertex = useCallback(
    (newLat: number, newLng: number) => {
      if (polygonComplete) return
      const updated: [number, number][] = [...polygonCoords, [newLat, newLng]]
      onPolygonChange(updated)

      // Also update the centroid as the main coordinate
      const centLat = updated.reduce((s, c) => s + c[0], 0) / updated.length
      const centLng = updated.reduce((s, c) => s + c[1], 0) / updated.length
      onLocationChange(centLat, centLng)
    },
    [polygonCoords, polygonComplete, onPolygonChange, onLocationChange]
  )

  const handleUndo = useCallback(() => {
    if (polygonCoords.length === 0) return
    const updated = polygonCoords.slice(0, -1)
    onPolygonChange(updated)
    if (updated.length > 0) {
      const centLat = updated.reduce((s, c) => s + c[0], 0) / updated.length
      const centLng = updated.reduce((s, c) => s + c[1], 0) / updated.length
      onLocationChange(centLat, centLng)
    }
  }, [polygonCoords, onPolygonChange, onLocationChange])

  const handleComplete = useCallback(() => {
    if (polygonCoords.length < 3) return
    onPolygonComplete(true)
  }, [polygonCoords.length, onPolygonComplete])

  const handleClear = useCallback(() => {
    onPolygonChange([])
    onPolygonComplete(false)
  }, [onPolygonChange, onPolygonComplete])

  const switchMode = useCallback((newMode: DrawMode) => {
    setMode(newMode)
    // Clear polygon state when switching to pin mode
    if (newMode === 'pin') {
      onPolygonChange([])
      onPolygonComplete(false)
    }
  }, [onPolygonChange, onPolygonComplete])

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchMode('pin')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            mode === 'pin'
              ? 'bg-green-600 text-white border-green-600 shadow-sm'
              : 'bg-transparent text-muted-foreground border-border hover:bg-accent'
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          Pin Drop
        </button>
        <button
          type="button"
          onClick={() => switchMode('polygon')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            mode === 'polygon'
              ? 'bg-green-600 text-white border-green-600 shadow-sm'
              : 'bg-transparent text-muted-foreground border-border hover:bg-accent'
          )}
        >
          <Pentagon className="h-3.5 w-3.5" />
          Draw Boundary
        </button>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground">
        {mode === 'pin'
          ? 'Click on the map to drop a pin at your farm location.'
          : polygonComplete
          ? 'Boundary complete. You can clear and redraw if needed.'
          : `Click on the map to add boundary points (${polygonCoords.length} vertices placed${polygonCoords.length < 3 ? ', need at least 3' : ''}).`}
      </p>

      {/* Polygon action buttons */}
      {mode === 'polygon' && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={polygonCoords.length === 0 || polygonComplete}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={polygonCoords.length < 3 || polygonComplete}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-green-600 text-green-600 hover:bg-green-600/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={polygonCoords.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-border text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {/* Map */}
      <div
        className={cn(
          'w-full h-[400px] rounded-xl overflow-hidden border border-border',
          mode === 'polygon' && !polygonComplete && 'cursor-crosshair'
        )}
      >
        <MapContainer
          center={MAP_CENTER}
          zoom={6}
          className={cn('h-full w-full', mode === 'polygon' && !polygonComplete && '[&_.leaflet-container]:cursor-crosshair')}
          zoomControl={true}
          style={{ background: '#f5f5f5' }}
        >
          <TileLayer url={TILE_URLS.light} attribution={TILE_ATTRIBUTION} />

          {mode === 'pin' && (
            <>
              <PinClickHandler onPinDrop={handlePinDrop} />
              {lat !== null && lng !== null && (
                <Marker position={[lat, lng]} />
              )}
            </>
          )}

          {mode === 'polygon' && (
            <>
              {!polygonComplete && (
                <PolygonClickHandler onAddVertex={handleAddVertex} />
              )}

              {/* Draw the polygon shape */}
              {polygonCoords.length >= 2 && (
                <Polygon
                  positions={polygonCoords}
                  pathOptions={{
                    color: polygonComplete ? '#16a34a' : '#22c55e',
                    weight: 2,
                    fillColor: '#22c55e',
                    fillOpacity: polygonComplete ? 0.2 : 0.1,
                    dashArray: polygonComplete ? undefined : '8 4',
                  }}
                />
              )}

              {/* Vertex markers */}
              {polygonCoords.map((coord, i) => (
                <CircleMarker
                  key={i}
                  center={coord}
                  radius={5}
                  pathOptions={{
                    color: '#16a34a',
                    fillColor: i === 0 ? '#ffffff' : '#22c55e',
                    fillOpacity: 1,
                    weight: 2,
                  }}
                />
              ))}

              {/* Center marker when polygon is complete */}
              {polygonComplete && lat !== null && lng !== null && (
                <Marker position={[lat, lng]} />
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
