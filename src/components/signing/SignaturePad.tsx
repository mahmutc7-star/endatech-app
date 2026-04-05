'use client'

import { useRef, useEffect, useState } from 'react'

interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  screenWidth: number
  screenHeight: number
  pixelRatio: number
  touchSupport: boolean
  deviceType: string
  timestamp: string
}

interface LocationInfo {
  latitude: number
  longitude: number
  accuracy: number
}

interface SignatureData {
  signature: string
  device: DeviceInfo
  location: LocationInfo | null
}

interface SignaturePadProps {
  onSave: (data: SignatureData) => void
  onCancel: () => void
  signerName: string
}

function getDeviceType(): string {
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet'
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return 'Telefoon'
  return 'Computer'
}

function getDeviceInfo(): DeviceInfo {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'unknown',
    language: navigator.language || 'unknown',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    deviceType: getDeviceType(),
    timestamp: new Date().toISOString(),
  }
}

function getLocation(): Promise<LocationInfo | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })
}

export default function SignaturePad({ onSave, onCancel, signerName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [locationStatus, setLocationStatus] = useState<'asking' | 'granted' | 'denied' | 'unavailable'>('asking')
  const [submitting, setSubmitting] = useState(false)

  // Request location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        })
        setLocationStatus('granted')
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, rect.height - 40)
    ctx.lineTo(rect.width - 20, rect.height - 40)
    ctx.stroke()

    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2
  }, [])

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasDrawn(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, rect.height - 40)
    ctx.lineTo(rect.width - 20, rect.height - 40)
    ctx.stroke()

    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2

    setHasDrawn(false)
  }

  const saveSignature = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return

    setSubmitting(true)

    // Get fresh location if not already available
    const loc = location || await getLocation()
    const device = getDeviceInfo()
    const signature = canvas.toDataURL('image/png')

    onSave({ signature, device, location: loc })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-slate-900">Ondertekenen</h2>
          <p className="text-sm text-slate-600 mt-1">
            Teken uw handtekening hieronder, {signerName}
          </p>
        </div>

        <div className="p-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-48 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Gebruik uw vinger of muis om te tekenen
          </p>

          {/* Device & location status */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-500">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {getDeviceType()}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              locationStatus === 'granted'
                ? 'bg-green-50 text-green-600'
                : locationStatus === 'denied'
                ? 'bg-yellow-50 text-yellow-600'
                : locationStatus === 'asking'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-100 text-slate-500'
            }`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationStatus === 'granted' && 'Locatie vastgelegd'}
              {locationStatus === 'denied' && 'Locatie geweigerd'}
              {locationStatus === 'asking' && 'Locatie opvragen...'}
              {locationStatus === 'unavailable' && 'Locatie niet beschikbaar'}
            </span>
          </div>
        </div>

        <div className="px-4 pb-2">
          <p className="text-[10px] text-slate-400 text-center">
            Door te ondertekenen bevestigt u de offerte. Uw apparaatgegevens, IP-adres en locatie worden
            vastgelegd als bewijs van ondertekening.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={clearSignature}
            className="px-4 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Wissen
          </button>
          <button
            onClick={saveSignature}
            disabled={!hasDrawn || submitting}
            className="flex-1 px-4 py-3 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Verwerken...' : 'Ondertekenen'}
          </button>
        </div>
      </div>
    </div>
  )
}
