/**
 * Hook para prefetch de imagens críticas em mobile
 * Usa IntersectionObserver para só carregar quando próximo da viewport
 */
import { useEffect, useRef } from 'react'

/**
 * Prefetch de imagem com prioridade baixa
 * @param {string} src - URL da imagem
 */
export function prefetchImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = src
  })
}

/**
 * Hook para prefetch de múltiplas imagens
 * @param {string[]} imageUrls - Array de URLs
 * @param {object} options - Opções
 */
export function useImagePrefetch(imageUrls, options = {}) {
  const { 
    delay = 1000,           // Delay inicial em ms
    stagger = 200,          // Delay entre cada imagem
    enabled = true          // Se deve executar
  } = options
  
  const prefetchedRef = useRef(new Set())
  
  useEffect(() => {
    if (!enabled || !imageUrls.length) return
    
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    
    // Em mobile, prefetch após delay para não competir com renderização
    const prefetchWithDelay = () => {
      imageUrls.forEach((url, index) => {
        if (prefetchedRef.current.has(url)) return
        
        const timeout = delay + (index * stagger)
        
        const doPrefetch = () => {
          prefetchImage(url)
            .then(() => {
              prefetchedRef.current.add(url)
            })
            .catch(() => {
              // Silently fail - imagem será carregada normalmente depois
            })
        }
        
        if (isMobile) {
          // Em mobile, usa requestIdleCallback se disponível
          if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(doPrefetch, { timeout: timeout })
          } else {
            setTimeout(doPrefetch, timeout)
          }
        } else {
          setTimeout(doPrefetch, timeout)
        }
      })
    }
    
    prefetchWithDelay()
  }, [imageUrls, delay, stagger, enabled])
}

/**
 * Hook para prefetch quando elemento entra na viewport
 * Útil para imagens abaixo da dobra
 */
export function usePrefetchOnVisible(ref, imageUrls, options = {}) {
  const { rootMargin = '100px', enabled = true } = options
  const prefetchedRef = useRef(false)
  
  useEffect(() => {
    if (!enabled || !ref.current || prefetchedRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetchedRef.current) {
            prefetchedRef.current = true
            // Prefetch todas as imagens quando visível
            imageUrls.forEach((url) => {
              prefetchImage(url).catch(() => {})
            })
            observer.disconnect()
          }
        })
      },
      { rootMargin }
    )
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [ref, imageUrls, rootMargin, enabled])
}
