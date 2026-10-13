function OptimizedImage({ src, alt, className, width, height, fetchpriority = 'auto' }) {
  const isPriority = fetchpriority === 'high'

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={isPriority ? 'eager' : 'lazy'}
      decoding={isPriority ? 'sync' : 'async'}
      fetchpriority={fetchpriority}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : 'auto',
        objectFit: 'cover'
      }}
    />
  )
}

export default OptimizedImage
