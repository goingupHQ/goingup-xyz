import { useEffect, useState } from 'react'

type ImageWithFallbackProps = {
  fallback?: string;
  alt: string;
  src: string;
}

const ImageWithFallback = ({
  fallback = '/images/org-fallback.svg',
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null)

  useEffect(() => {
    setError(null)
  }, [src])

  return (
    <img
      alt={alt}
      onError={setError}
      src={error ? fallback : src}
      {...props}
    />
  )
}

export default ImageWithFallback;