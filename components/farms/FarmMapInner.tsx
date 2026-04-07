'use client'

import { useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  CircleMarker,
  useMapEvents,
  Tooltip,
} from 'react-leaflet'
import { useFarmStore } from '@/store/useFarmStore'
import { useFilteredFarms } from '@/hooks/useFilteredFarms'
import { useTheme } from 'next-themes'
import {
  MAP_CENTER,
  MAP_ZOOM,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from '@/config/constants'
import { FarmStatus } from '@/types/farm'
import { cn } from '@/lib/utils'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* ------------------------------------------------------------------ */
/*  Fix default marker icon (leaflet + webpack/next issue)            */
/* ------------------------------------------------------------------ */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

/* ------------------------------------------------------------------ */
/*  Status-based polygon styles                                       */
/* ------------------------------------------------------------------ */
const STATUS_STYLES: Record<
  FarmStatus,
  L.PathOptions & { hoverFillOpacity: number }
> = {
  active: {
    fillColor: '#22c55e',
    fillOpacity: 0.3,
    color: '#16a34a',
    weight: 2,
    hoverFillOpacity: 0.5,
  },
  pending: {
    fillColor: '#eab308',
    fillOpacity: 0.3,
    color: '#a16207',
    weight: 2,
    hoverFillOpacity: 0.5,
  },
  suspended: {
    fillColor: '#ef4444',
    fillOpacity: 0.3,
    color: '#dc2626',
    weight: 2,
    hoverFillOpacity: 0.5,
  },
  revoked: {
    fillColor: '#6b7280',
    fillOpacity: 0.2,
    color: '#4b5563',
    weight: 1,
    hoverFillOpacity: 0.35,
  },
}

/* ------------------------------------------------------------------ */
/*  Pin-drop click handler (used inside MapContainer)                 */
/* ------------------------------------------------------------------ */
function MapClickHandler({
  pinDropMode,
  onPinDrop,
}: {
  pinDropMode: boolean
  onPinDrop: (latlng: L.LatLng) => void
}) {
  useMapEvents({
    click(e) {
      if (pinDropMode) {
        onPinDrop(e.latlng)
      }
    },
  })
  return null
}

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */
function MapLegend({ heatmapMode }: { heatmapMode: boolean }) {
  const items: { label: string; color: string }[] = heatmapMode
    ? [
        { label: 'High Risk', color: '#ef4444' },
        { label: 'Medium Risk', color: '#f59e0b' },
        { label: 'Low Risk', color: '#22c55e' },
      ]
    : [
        { label: 'Active', color: '#22c55e' },
        { label: 'Pending', color: '#eab308' },
        { label: 'Suspended', color: '#ef4444' },
        { label: 'Revoked', color: '#6b7280' },
      ]

  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-background/90 p-3 text-xs shadow-lg backdrop-blur-sm border border-border">
      <p className="mb-2 font-semibold text-foreground">
        {heatmapMode ? 'Compliance Risk' : 'Farm Status'}
      </p>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: it.color }}
            />
            <span className="text-muted-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Heatmap risk scores (mock per-farm)                               */
/* ------------------------------------------------------------------ */
function getComplianceRisk(farmId: string): number {
  // Deterministic mock risk score based on farm ID hash
  const riskMap: Record<string, number> = {
    f001: 15, f002: 25, f003: 40, f004: 10, f005: 55,
    f006: 20, f007: 35, f008: 70, f009: 85, f010: 30,
    f011: 45, f012: 60, f013: 12, f014: 90, f015: 50,
    f016: 22, f017: 18, f018: 65, f019: 42, f020: 28,
    f021: 38, f022: 75, f023: 55,
  }
  return riskMap[farmId] ?? 30
}

function getRiskColor(score: number): string {
  if (score >= 70) return '#ef4444'
  if (score >= 45) return '#f59e0b'
  return '#22c55e'
}

function getRiskRadius(score: number): number {
  // Higher risk = larger circle
  return 8 + (score / 100) * 16
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function FarmMapInner() {
  const { theme } = useTheme()
  const setSelectedFarm = useFarmStore((s) => s.setSelectedFarm)
  const farms = useFilteredFarms()

  const [pinDropMode, setPinDropMode] = useState(false)
  const [droppedPin, setDroppedPin] = useState<L.LatLng | null>(null)
  const [heatmapMode, setHeatmapMode] = useState(false)

  const handlePinDrop = useCallback((latlng: L.LatLng) => {
    setDroppedPin(latlng)
    setPinDropMode(false)
  }, [])

  const tileUrl =
    theme === 'dark' ? TILE_URLS.dark : TILE_URLS.light

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-border">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        {/* Heatmap toggle */}
        <button
          type="button"
          onClick={() => setHeatmapMode((h) => !h)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium shadow transition-colors',
            heatmapMode
              ? 'bg-amber-500 text-white'
              : 'bg-background/90 text-foreground border border-border hover:bg-muted'
          )}
        >
          {heatmapMode ? 'Risk Heatmap ON' : 'Risk Heatmap'}
        </button>

        {/* Pin-drop toggle */}
        <button
          type="button"
          onClick={() => {
            setPinDropMode((p) => !p)
            if (!pinDropMode) setDroppedPin(null)
          }}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium shadow transition-colors',
            pinDropMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/90 text-foreground border border-border hover:bg-muted'
          )}
        >
          {pinDropMode ? 'Cancel Pin Drop' : 'Drop Pin'}
        </button>
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        style={{ background: theme === 'dark' ? '#1a1a2e' : '#f5f5f5' }}
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution={TILE_ATTRIBUTION}
        />

        <MapClickHandler
          pinDropMode={pinDropMode}
          onPinDrop={handlePinDrop}
        />

        {/* Farm polygons (normal mode) */}
        {!heatmapMode &&
          farms.map((farm) => {
            if (!farm.boundaryCoords || farm.boundaryCoords.length === 0)
              return null
            const style = STATUS_STYLES[farm.status]
            const { hoverFillOpacity, ...pathOptions } = style

            return (
              <Polygon
                key={farm.id}
                positions={farm.boundaryCoords}
                pathOptions={pathOptions}
                eventHandlers={{
                  click: () => setSelectedFarm(farm.id),
                  mouseover: (e) => {
                    e.target.setStyle({ fillOpacity: hoverFillOpacity })
                  },
                  mouseout: (e) => {
                    e.target.setStyle({
                      fillOpacity: pathOptions.fillOpacity,
                    })
                  },
                }}
              >
                <Tooltip sticky>
                  <span className="font-medium">{farm.name}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {farm.region} &middot; {farm.sizeHectares} ha
                  </span>
                </Tooltip>
              </Polygon>
            )
          })}

        {/* Risk heatmap overlay */}
        {heatmapMode &&
          farms.map((farm) => {
            // Use centroid of boundary or coordinates field
            let center: [number, number] | null = null
            if (farm.boundaryCoords && farm.boundaryCoords.length > 0) {
              const lat =
                farm.boundaryCoords.reduce((s, c) => s + c[0], 0) /
                farm.boundaryCoords.length
              const lng =
                farm.boundaryCoords.reduce((s, c) => s + c[1], 0) /
                farm.boundaryCoords.length
              center = [lat, lng]
            } else if (farm.coordinates) {
              center = [farm.coordinates[0], farm.coordinates[1]]
            }
            if (!center) return null

            const risk = getComplianceRisk(farm.id)
            const color = getRiskColor(risk)
            const radius = getRiskRadius(risk)

            return (
              <CircleMarker
                key={farm.id}
                center={center}
                radius={radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.5,
                  weight: 1,
                  opacity: 0.8,
                }}
                eventHandlers={{
                  click: () => setSelectedFarm(farm.id),
                }}
              >
                <Tooltip sticky>
                  <span className="font-medium">{farm.name}</span>
                  <br />
                  <span>Risk Score: {risk}%</span>
                  <br />
                  <span className="text-muted-foreground">
                    {risk >= 70
                      ? 'High Risk'
                      : risk >= 45
                      ? 'Medium Risk'
                      : 'Low Risk'}
                  </span>
                </Tooltip>
              </CircleMarker>
            )
          })}

        {/* Dropped pin marker */}
        {droppedPin && <Marker position={droppedPin} />}
      </MapContainer>

      <MapLegend heatmapMode={heatmapMode} />
    </div>
  )
}
